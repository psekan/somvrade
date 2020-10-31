<?php

namespace App\Http\Controllers;

use App\Models\CollectionPoints;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Contracts\Cache\Repository as Cache;
use Illuminate\Validation\ValidationException;
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
     * @param $region
     * @return array|Builder[]|Collection
     * @throws InvalidArgumentException
     */
    public function refreshCache($region) {
        if ($region == '') {
            $collectionPoint = CollectionPoints::query()
                ->orderBy('county')
                ->orderBy('city')
                ->orderBy('address')
                ->get();
            $this->cache->set(self::CACHE_KEY, $collectionPoint);
            return $collectionPoint;
        }
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
     * @param Request $request
     * @return JsonResponse
     * @throws InvalidArgumentException
     */
    public function showAll(Request $request)
    {
        if (auth()->check()) {
            return response()->json(CollectionPoints::query()
                ->orderBy('county')
                ->orderBy('city')
                ->orderBy('address')
                ->get());
        }

        $region = strtoupper($request->get('region'));
        if (!in_array($region, self::REGIONS)){
            $region = '';
        }
        if (!$this->cache->has(self::CACHE_KEY.$region)) {
            $collectionPoint = $this->refreshCache($region);
        }
        else {
            $collectionPoint = $this->cache->get(self::CACHE_KEY.$region);
        }
        return response()->json($collectionPoint);
    }

    /**
     * @return JsonResponse
     */
    public function showAllWaiting()
    {
        return response()->json(CollectionPoints::query()
            ->where('active', false)
            ->orderBy('county')
            ->orderBy('city')
            ->orderBy('district')
            ->orderBy('place')
            ->get());
    }

    /**
     * @param Request $request
     * @return JsonResponse
     * @throws ValidationException
     */
    public function create(Request $request)
    {
        $this->validate($request, [
            'county' => 'required',
            'city' => 'required',
            'address' => 'required',
            'unoccupied' => 'required'
        ]);
        $collectionPoint = CollectionPoints::query()->create($request->merge(['active' => false])->all());
        return response()->json($collectionPoint, 201);
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
    public function update($id, Request $request)
    {
        $collectionPoint = CollectionPoints::query()->findOrFail($id);
        $collectionPoint->update($request->all());
        $this->refreshCache($collectionPoint->region);
        return response()->json($collectionPoint, 200);
    }

    /**
     * @param $id
     * @return JsonResponse
     * @throws InvalidArgumentException
     * @throws Exception
     */
    public function delete($id)
    {
        $collectionPoint = CollectionPoints::query()->findOrFail($id);
        $collectionPoint->delete();
        $this->refreshCache($collectionPoint->region);
        return response()->json(['message' => 'Deleted Successfully.'], 200);
    }
}
