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
            $table->date('day');
            $table->time('arrive');
            $table->integer('length');
            $table->time('departure')->nullable();
            $table->string('admin_note', 250)->nullable();
            $table->boolean('verified')->default(false);
            $table->string('token', 40);
            $table->index(['collection_point_id', 'day', 'arrive']);
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
