<?php

namespace App\Http\Controllers;

use App\Models\Entry;
use Illuminate\Http\Request;
use Illuminate\Contracts\Cache\Repository as Cache;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use ReCaptcha\ReCaptcha;

class EntryController extends Controller
{
    const CACHE_KEY = 'entries';
    const CACHE_MISINFO_KEY = 'misinfo';

    /**
     * The cache instance.
     */
    protected $cache;

    public function __construct(Cache $cache)
    {
        $this->cache = $cache;
    }

    public function refreshCache($id) {
        $entries = Entry::query()
            ->where('collection_point_id', $id)
            ->orderBy('arrive', 'desc')
            ->limit(100)
            ->get()->makeHidden(['token', 'collection_point_id']);
        $this->cache->set(self::CACHE_KEY.$id, $entries);
        return $entries;
    }

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

    public function create($id, Request $request)
    {
        try {
            $this->validate($request, [
                'arrive' => 'required',
                'length' => 'required',
                'recaptcha' => 'required'
            ]);
        }
        catch (\Throwable $ex) {
            Log::error($request->getContentType());
            Log::error($request->getContent());
            Log::error($ex->getMessage());
            Log::error($ex->getTraceAsString());
            throw $ex;
        }

        if ($this->verifyCaptcha($request->get('recaptcha'),$request->ip()) != true) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        if (strtotime($request->get('arrive')) > time()) {
            return response()->json(['message' => 'Bad request'], 401);
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

    public function update($eid, Request $request)
    {
        $this->validate($request, [
            'token' => 'required',
            'departure' => 'required',
            'recaptcha' => 'required',
        ]);

        if ($this->verifyCaptcha($request->get('recaptcha'),$request->ip()) != true) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        if (strtotime($request->get('departure')) > time()) {
            return response()->json(['message' => 'Bad request'], 401);
        }

        $entry = Entry::query()->findOrFail($eid);
        if ($entry->token != $request->get('token')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $entry->update($request->only('departure'));
        $this->refreshCache($entry->collection_point_id);
        return response()->json($entry, 200);
    }

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

    private function verifyCaptcha($token, $ip) {
        $secret = env('RECAPTCHA', '');
        $recaptcha = new ReCaptcha($secret);
        $resp = $recaptcha->verify($token, $ip);
        return $resp->isSuccess();
    }
}
