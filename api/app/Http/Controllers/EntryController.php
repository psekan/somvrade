<?php

namespace App\Http\Controllers;

use App\Models\Entry;
use App\Models\User;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Contracts\Cache\Repository as Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Psr\SimpleCache\InvalidArgumentException;
use ReCaptcha\ReCaptcha;

/**
 * Class EntryController
 * @package App\Http\Controllers
 */
class EntryController extends Controller
{
    const CACHE_KEY = 'entries';
    const MIN_DURATION_ON_POINT = 60;
    const ALLOWED_EARLIER_SUBMIT = 600;

    /**
     * The cache instance.
     */
    protected $cache;

    /**
     * EntryController constructor.
     * @param Cache $cache
     */
    public function __construct(Cache $cache)
    {
        $this->cache = $cache;
    }

    /**
     * Refresh the cache of a collection point's entries
     * @param $id
     * @return Builder[]|Collection
     * @throws InvalidArgumentException
     */
    private function refreshCache($id) {
        $entries = Entry::query()
            ->where('collection_point_id', $id)
            ->where('day', date('Y-m-d'))
            ->orderBy('arrive', 'desc')
            ->limit(100)
            ->get()->makeHidden(['token', 'collection_point_id']);
        $this->cache->set(self::CACHE_KEY.$id, $entries);
        return $entries;
    }

    /**
     * Get cached entries for a collection point
     * @param $id
     * @return Collection|array
     * @throws InvalidArgumentException
     */
    private function getByPoint($id) {
        if (!$this->cache->has(self::CACHE_KEY.$id)) {
            return $this->refreshCache($id);
        }
        return $this->cache->get(self::CACHE_KEY.$id);
    }

    /**
     * Return true if a user is authenticated and is capable to modify the collection point
     * @param $id
     * @return bool
     */
    private function isUserAdmin($id) {
        if (auth()->check()) {
            /** @var User $user */
            $user = auth()->user();
            $collectionPoint = $user->allowedCollectionPoint($id);
            if ($collectionPoint !== null) {
                return true;
            }
        }
        return false;
    }

    /**
     * @return string
     */
    private function generateToken() {
        $token = openssl_random_pseudo_bytes(16);
        return bin2hex($token);
    }

    private function captchaNotValid() {
        return response()->json([
            'messageTranslation' => 'Nepodarilo sa nám overiť užívateľa. Prosíme, otvorte stránku ešte raz.'
        ], 401);
    }

    /**
     * Get entries for a collection point
     * @param $id
     * @return JsonResponse
     * @throws InvalidArgumentException
     */
    public function showAll($id)
    {
        return response()->json($this->getByPoint($id));
    }

    /**
     * Create an entry
     * If authenticated user is an admin for this point, create verified entry with admin note
     * @param $id
     * @param Request $request
     * @return JsonResponse
     * @throws InvalidArgumentException
     * @throws ValidationException
     */
    public function create($id, Request $request)
    {
        $this->validate($request, [
            'arrive' => 'required',
            'length' => 'required',
            'recaptcha' => 'required'
        ]);

        $verified = false;
        $adminNote = '';
        $isAdmin = $this->isUserAdmin($id);
        if ($isAdmin) {
            $verified = true;
            $adminNote = $request->get('admin_note', '');
        }

        if ($this->verifyCaptcha($request->get('recaptcha')) != true) {
            return $this->captchaNotValid();
        }
        if (strtotime($request->get('arrive')) > time()+self::ALLOWED_EARLIER_SUBMIT && !$isAdmin) {
            return response()->json(['messageTranslation' => 'Nesprávne zadaný časový údaj.'], 400);
        }

        $entry = Entry::query()->create($request->merge([
            'day' => date('Y-m-d'),
            'collection_point_id' => $id,
            'token' => $this->generateToken(),
            'verified' => $verified,
            'admin_note' => $adminNote
        ])->only(['collection_point_id', 'day', 'arrive', 'length', 'admin_note', 'verified', 'token']));
        $this->refreshCache($id);
        return response()->json($entry, 201);
    }

    /**
     * @param $eid
     * @param Request $request
     * @return JsonResponse
     * @throws InvalidArgumentException
     * @throws ValidationException
     */
    public function update($eid, Request $request)
    {
        $this->validate($request, [
            'recaptcha' => 'required',
        ]);

        if ($this->verifyCaptcha($request->get('recaptcha')) != true) {
            return $this->captchaNotValid();
        }

        $entry = Entry::query()->findOrFail($eid);
        $collectionPointId = $entry->collection_point_id;

        $verified = $entry->verified;
        $adminNote = $entry->admin_note;
        $isAdmin = $this->isUserAdmin($collectionPointId);
        if ($isAdmin) {
            $verified = true;
            $adminNote = $request->get('admin_note', $entry->admin_note);
        }
        else {
            $this->validate($request, [
                'token' => 'required',
                'departure' => 'required'
            ]);
            $departureTime = strtotime($request->get('departure'));
            if ($departureTime <= strtotime($entry->arrive)+self::MIN_DURATION_ON_POINT ||
                $departureTime > time()+self::ALLOWED_EARLIER_SUBMIT) {
                return response()->json(['messageTranslation' => 'Nesprávne zadaný časový údaj.'], 400);
            }
            if ($entry->token != $request->get('token')) {
                return response()->json(['messageTranslation' => 'Nedostatočné oprávnenie. Vaše zariadenie nedisponuje platným prístup na úpravu zvoleného času.'], 403);
            }
        }
        $entry->update($request->merge([
            'verified' => $verified,
            'admin_note' => $adminNote
        ])->only('departure', 'admin_note', 'verified'));
        $this->refreshCache($collectionPointId);
        return response()->json($entry, 200);
    }

    /**
     * @param $eid
     * @param Request $request
     * @return JsonResponse
     * @throws InvalidArgumentException
     * @throws Exception
     */
    public function delete($eid, Request $request)
    {
        $entry = Entry::query()->findOrFail($eid);
        $collectionPointId = $entry->collection_point_id;
        if ($entry->token != $request->get('token', '-') &&
            !$this->isUserAdmin($collectionPointId)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $entry->delete();
        $this->refreshCache($collectionPointId);
        return response()->json(['message' => 'Deleted Successfully.'], 200);
    }

    /**
     * @param $token
     * @return bool
     */
    private function verifyCaptcha($token) {
        $secret = env('RECAPTCHA', '');
        if ($secret === 'disabled') {
            return true;
        }
        if ($secret === '') {
            Log::critical('reCAPTCHA is not configured');
            return false;
        }
        $recaptcha = new ReCaptcha($secret);
        $resp = $recaptcha->verify($token);
        return $resp->isSuccess();
    }
}
