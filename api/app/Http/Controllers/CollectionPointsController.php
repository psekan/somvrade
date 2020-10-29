<?php

namespace App\Http\Controllers;

use App\Models\CollectionPoint;
use Illuminate\Http\Request;
use Illuminate\Contracts\Cache\Repository as Cache;

class CollectionPointsController extends Controller
{
    const CACHE_KEY = 'places';

    /**
     * The cache instance.
     */
    protected $cache;

    public function __construct(Cache $cache)
    {
        $this->cache = $cache;
    }

    public function showAll()
    {
        if (!$this->cache->has(self::CACHE_KEY)) {
            $places = CollectionPoint::query()
                ->orderBy('county')
                ->orderBy('city')
                ->orderBy('district')
                ->orderBy('place')
                ->get();
            $this->cache->set(self::CACHE_KEY, $places);
        }
        else {
            $places = $this->cache->get(self::CACHE_KEY);
        }
        return response()->json($places);
    }

    public function create(Request $request)
    {
        $Place = CollectionPoint::query()->create($request->all());
        $this->cache->delete(self::CACHE_KEY);
        return response()->json($Place, 201);
    }
}
