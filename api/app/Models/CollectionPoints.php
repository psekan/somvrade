<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CollectionPoints extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'county', 'city', 'district', 'place', 'active'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [];
}
