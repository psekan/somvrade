<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Place extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'village', 'district', 'place'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [];
}
