<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEntryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('entry', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('collection_point_id')->unsigned();
            $table->foreign('collection_point_id')->references('id')->on('collection_points');
            $table->time('arrive');
            $table->integer('length');
            $table->time('departure')->nullable();
            $table->string('token', 40);
            $table->string('ipaddress', 20);
            $table->string('misinformation',100);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('entry');
    }
}
