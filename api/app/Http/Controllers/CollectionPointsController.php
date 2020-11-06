<?php

namespace App\Http\Controllers;

use App\Models\CollectionPoints;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Contracts\Cache\Repository as Cache;
use Psr\SimpleCache\InvalidArgumentException;

/**
 * Class CollectionPointsController
 * @package App\Http\Controllers
 */
class CollectionPointsController extends Controller
{
    const CACHE_KEY = 'cp';
    const REGIONS = ['BA', 'TT', 'TN', 'NR', 'ZA', 'BB', 'PO', 'KE'];

    /**
     * The cache instance.
     */
    protected $cache;

    /**
     * CollectionPointsController constructor.
     * @param Cache $cache
     */
    public function __construct(Cache $cache)
    {
        $this->cache = $cache;
    }

    /**
     * Refresh cache of a region collection points and return new value
     * @param $region
     * @return array|Builder[]|Collection
     * @throws InvalidArgumentException
     */
    private function refreshCache($region) {
        if (!in_array($region, self::REGIONS)){
            return [];
        }
        $collectionPoint = CollectionPoints::query()
            ->where('region', $region)
            ->orderBy('county')
            ->orderBy('city')
            ->orderBy('address')
            ->get();
        $this->cache->set(self::CACHE_KEY.$region, $collectionPoint);
        return $collectionPoint;
    }

    /**
     * Get actual collection points in a region
     * @param $region
     * @return Collection|array
     * @throws InvalidArgumentException
     */
    private function getByRegion($region) {
        $region = strtoupper($region);
        if (!in_array($region, self::REGIONS)){
            return [];
        }
        if (!$this->cache->has(self::CACHE_KEY.$region)) {
            return $this->refreshCache($region);
        }
        return $this->cache->get(self::CACHE_KEY.$region);
    }

    /**
     * Show all collection points
     * @param Request $request
     * @return JsonResponse
     * @throws InvalidArgumentException
     */
    public function showAll(Request $request)
    {
        $collectionPoint = $this->getByRegion($request->get('region'));
        return response()->json($collectionPoint);
    }

    /**
     * Show only admin's allowed collection points
     * @param Request $request
     * @return JsonResponse
     * @throws InvalidArgumentException
     */
    public function showMine(Request $request)
    {
        /** @var User $user */
        $user = auth()->user();
        return response()->json($user->collectionPoints()
            ->orderBy('region')
            ->orderBy('county')
            ->orderBy('city')
            ->orderBy('address'));
    }

    /**
     * @param $id
     * @return JsonResponse
     */
    public function showOne($id)
    {
        return response()->json(CollectionPoints::query()->findOrFail($id));
    }

    /**
     * @param $id
     * @param Request $request
     * @return JsonResponse
     * @throws InvalidArgumentException
     */
    public function updateBreak($id, Request $request)
    {
        /** @var User $user */
        $user = auth()->user();

        /** @var CollectionPoints $collectionPoint */
        $collectionPoint = $user->allowedCollectionPoints($id);
        if ($collectionPoint === null) {
            return $this->forbidden();
        }
        $collectionPoint->update($request->only(['break_start', 'break_stop', 'break_note']));
        $this->refreshCache($collectionPoint->region);
        return response()->json($collectionPoint, 200);
    }
}
