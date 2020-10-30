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

    public function refreshCache() {
        $places = CollectionPoints::query()
            ->where('active', true)
            ->orderBy('county')
            ->orderBy('city')
            ->orderBy('district')
            ->orderBy('place')
            ->get()->makeHidden('active');
        $this->cache->set(self::CACHE_KEY, $places);
        return $places;
    }

    public function showAll()
    {
        if (auth()->check()) {
            return response()->json(CollectionPoints::query()
                ->where('active', true)
                ->orderBy('county')
                ->orderBy('city')
                ->orderBy('district')
                ->orderBy('place')
                ->get());
        }

        if (!$this->cache->has(self::CACHE_KEY)) {
            $places = $this->refreshCache();
        }
        else {
            $places = $this->cache->get(self::CACHE_KEY);
        }
        return response()->json($places);
    }

    public function showAllWaiting()
    {
        return response()->json(CollectionPoints::query()
            ->where('active', false)
            ->orderBy('created_at')
            ->get());
    }

    public function create(Request $request)
    {
        $Place = CollectionPoints::query()->create($request->all());
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
        $this->refreshCache();
        return response()->json($author, 200);
    }

    public function delete($id)
    {
        CollectionPoints::query()->findOrFail($id)->delete();
        $this->refreshCache();
        return response('Deleted Successfully', 200);
    }
}
