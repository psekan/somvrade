<?php

namespace App\Http\Controllers;

use App\Models\Place;
use Illuminate\Http\Request;

class PlaceController extends Controller
{

    public function showAll()
    {
        return response()->json(Place::all());
    }

    public function create(Request $request)
    {
        $Place = Place::query()->create($request->all());

        return response()->json($Place, 201);
    }
}
