<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::table('users', function (Blueprint $table) {
        $table->string('specialty')->nullable();
        $table->integer('age_months')->nullable();
        $table->float('weight_kg')->nullable();
        $table->text('allergies')->nullable();
        $table->text('bio')->nullable();
    });
}

public function down(): void
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn(['specialty', 'age_months', 'weight_kg', 'allergies', 'bio']);
    });
}
};
