<?php

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->group(['prefix' => 'api'], function () use ($router) {
    $router->get('/version', function () use ($router) {
        return response()->json(['name' => 'Som v rade.sk API', 'version' => '1.1.1']);
    });
    $router->get('collectionpoints',  'CollectionPointsController@showAll');
    $router->get('collectionpoints/{id}', 'CollectionPointsController@showOne');
    $router->get('collectionpoints/{id}/entries',  'EntryController@showAll');
    $router->post('collectionpoints/{id}/entries',  'EntryController@create');
    $router->put('entries/{eid}',  'EntryController@update');
    $router->delete('entries/{eid}',  'EntryController@delete');
    $router->group([
        'middleware' => 'auth',
    ], function ($router) {
        $router->put('collectionpoints/{id}/break',  'CollectionPointsController@updateBreak');
    });

    $router->post('login', 'AuthController@login');
    $router->group([
        'middleware' => 'auth',
        'prefix' => 'auth'
    ], function ($router) {
        $router->post('logout', 'AuthController@logout');
        $router->post('refresh', 'AuthController@refresh');
        $router->post('me', 'AuthController@me');
        $router->get('collectionpoints',  'CollectionPointsController@showMine');
    });
});