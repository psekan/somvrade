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
        'collection_point_id', 'arrive', 'length', 'departure', 'ipaddress', 'misinformation', 'token'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'created_at',
        'updated_at',
        'ipaddress',
        'misinformation'
    ];

    /**
     * @return int|mixed
     */
    public function getMisinfoCountAttribute() {
        $json = $this->misinformation;
        if ($json === "") {
            return 0;
        }
        $object = json_decode($json, true);
        return $object['count'];
    }
}
