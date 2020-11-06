<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCollectionPointsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('collection_points', function (Blueprint $table) {
            $table->id();
            $table->string('region', 4);
            $table->string('county', 60);
            $table->string('city', 60);
            $table->string('address', 150);
            $table->integer('teams')->unsigned()->default(1);
            $table->integer('external_system_id')->unsigned()->default(0);
            $table->time('break_start')->nullable();
            $table->time('break_stop')->nullable();
            $table->string('break_note', 250)->nullable();
            $table->timestamps();

            $table->index(['region', 'county', 'city', 'address']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('collection_points');
    }
}
