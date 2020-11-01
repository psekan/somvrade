<?php

namespace App\Http\Controllers;

use App\Models\Entry;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Contracts\Cache\Repository as Cache;
use Illuminate\Support\Carbon;
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
    const CACHE_MISINFO_KEY = 'misinfo';
    const MIN_DURATION_ON_POINT = 120;
    const ALLOWED_EARLIER_SUBMIT = 300;

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
     * @param $id
     * @return Builder[]|Collection
     * @throws InvalidArgumentException
     */
    public function refreshCache($id) {
        $entries = Entry::query()
            ->where('collection_point_id', $id)
            ->orderBy('arrive', 'desc')
            ->limit(100)
            ->get()->makeHidden(['token', 'collection_point_id']);
        $this->cache->set(self::CACHE_KEY.$id, $entries);
        return $entries;
    }

    /**
     * @param $id
     * @return JsonResponse
     * @throws InvalidArgumentException
     */
    public function showAll($id)
    {
        if (!$this->cache->has(self::CACHE_KEY.$id)) {
            $entries = $this->refreshCache($id);
        }
        else {
            $entries = $this->cache->get(self::CACHE_KEY.$id);
        }
        return response()->json($entries);
    }

    /**
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

        if ($this->verifyCaptcha($request->get('recaptcha'),$request->ip()) != true) {
            return response()->json(['messageTranslation' => 'Nedostatočne overený užívateľ. Prosíme, otvorte si stránku ešte raz.'], 401);
        }
        if (strtotime($request->get('arrive')) > time()+self::ALLOWED_EARLIER_SUBMIT) {
            return response()->json(['messageTranslation' => 'Nesprávne zadaný časový údaj.'], 400);
        }

        $token = openssl_random_pseudo_bytes(16);
        $token = bin2hex($token);

        $entry = Entry::query()->create($request->merge([
            'collection_point_id' => $id,
            'ipaddress' => $request->ip(),
            'token' => $token,
            'misinformation' => ''
        ])->all());
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
            'token' => 'required',
            'departure' => 'required',
            'recaptcha' => 'required',
        ]);

        if ($this->verifyCaptcha($request->get('recaptcha'),$request->ip()) != true) {
            return response()->json(['messageTranslation' => 'Nedostatočne overený užívateľ. Prosíme, otvorte si stránku ešte raz.'], 401);
        }

        $entry = Entry::query()->findOrFail($eid);
        $departureTime = strtotime($request->get('departure'));
        if ($departureTime <= strtotime($entry->arrive)+self::MIN_DURATION_ON_POINT ||
            $departureTime > time()+self::ALLOWED_EARLIER_SUBMIT) {
            return response()->json(['messageTranslation' => 'Nesprávne zadaný časový údaj.'], 400);
        }
        if ($entry->token != $request->get('token')) {
            return response()->json(['messageTranslation' => 'Nedostatočné oprávnenie. Vaše zariadenie nedisponuje platným prístup na úpravu zvoleného času.'], 403);
        }
        $entry->update($request->only('departure'));
        $this->refreshCache($entry->collection_point_id);
        return response()->json($entry, 200);
    }

    /**
     * @param $eid
     * @param Request $request
     * @return JsonResponse
     * @throws InvalidArgumentException
     */
    public function maskAsMisinformation($eid, Request $request)
    {
        $cacheKey = self::CACHE_MISINFO_KEY.$request->ip();
        if ($this->cache->has($cacheKey)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $expiresAt = Carbon::now()->addMinutes(10);
        $this->cache->set($cacheKey, true, $expiresAt);

        $entry = Entry::query()->findOrFail($eid);
        $json = $entry->misinformation;
        if ($json === "") {
            $json = json_encode(["ips" => [], "count" => 0]);
        }
        $object = json_decode($json, true);
        $object['count'] += 1;
        if (count($object['ips']) < 3) {
            $object['ips'][] = $request->ip();
        }
        $entry->update(['misinformation' => json_encode($object)]);
        $this->refreshCache($entry->collection_point_id);
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
        if ($entry->token != $request->get('token')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $entry->delete();
        $this->refreshCache($entry->collection_point_id);
        return response()->json(['message' => 'Deleted Successfully.'], 200);
    }

    /**
     * @param $token
     * @param $ip
     * @return bool
     */
    private function verifyCaptcha($token, $ip) {
        $secret = env('RECAPTCHA', '');
        if ($secret === 'disabled') {
            return true;
        }
        if ($secret === '') {
            Log::critical('reCAPTCHA is not configured');
            return false;
        }
        $recaptcha = new ReCaptcha($secret);
        $resp = $recaptcha->verify($token, $ip);
        return $resp->isSuccess();
    }
}
