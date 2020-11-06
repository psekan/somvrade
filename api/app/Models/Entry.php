<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Entry
 * @package App\Models
 */
class Entry extends Model
{
    /**
     * @var string
     */
    protected $table = 'entry';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'collection_point_id', 'day', 'arrive', 'length', 'departure', 'admin_note', 'token', 'verified'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'created_at',
        'updated_at',
        'day'
    ];
}
