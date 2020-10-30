<?php

namespace App\Http\Controllers;

use App\Models\CollectionPoints;
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
        if (auth()->check()) {
            return response()->json(CollectionPoints::query()
                ->orderBy('county')
                ->orderBy('city')
                ->orderBy('district')
                ->orderBy('place')
                ->get());
        }

        if (!$this->cache->has(self::CACHE_KEY)) {
            $places = CollectionPoints::query()
                ->where('active', true)
                ->orderBy('county')
                ->orderBy('city')
                ->orderBy('district')
                ->orderBy('place')
                ->get()->makeHidden('active');
            $this->cache->set(self::CACHE_KEY, $places);
        }
        else {
            $places = $this->cache->get(self::CACHE_KEY);
        }
        return response()->json($places);
    }

    public function create(Request $request)
    {
        $Place = CollectionPoints::query()->create($request->all());
        $this->cache->delete(self::CACHE_KEY);
        return response()->json($Place, 201);
    }

    public function showOne($id)
    {
        return response()->json(CollectionPoints::query()->findOrFail($id));
    }

    public function update($id, Request $request)
    {
        $author = CollectionPoints::query()->findOrFail($id);
        $author->update($request->all());
        $this->cache->delete(self::CACHE_KEY);
        return response()->json($author, 200);
    }

    public function delete($id)
    {
        CollectionPoints::query()->findOrFail($id)->delete();
        $this->cache->delete(self::CACHE_KEY);
        return response('Deleted Successfully', 200);
    }
}
