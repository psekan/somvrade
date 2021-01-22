<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class CollectionPoints
 * @package App\Models
 */
class CollectionPoints extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id', 'region', 'county', 'city', 'address', 'external_system_id', 'external_system_link', 'note',
        'break_start', 'break_stop', 'break_note', 'teams'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'created_at',
        'updated_at'
    ];
}
