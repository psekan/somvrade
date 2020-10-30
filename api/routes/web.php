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
    $router->get('version', function () use ($router) {
        return $router->app->version();
    });
    $router->get('collectionpoints',  'CollectionPointsController@showAll');
    $router->get('collectionpoints/waiting',  'CollectionPointsController@showAllWaiting');
    $router->post('collectionpoints', 'CollectionPointsController@create');
    $router->group([
        'middleware' => 'auth',
    ], function ($router) {
        $router->get('collectionpoints/{id}', 'CollectionPointsController@showOne');
        $router->delete('collectionpoints/{id}', 'CollectionPointsController@delete');
        $router->put('collectionpoints/{id}', 'CollectionPointsController@update');
    });

    $router->post('register', 'AuthController@register');
    $router->post('login', 'AuthController@login');
    $router->group([
        'middleware' => 'auth',
        'prefix' => 'auth'
    ], function ($router) {
        $router->post('logout', 'AuthController@logout');
        $router->post('refresh', 'AuthController@refresh');
        $router->post('me', 'AuthController@me');
    });
});