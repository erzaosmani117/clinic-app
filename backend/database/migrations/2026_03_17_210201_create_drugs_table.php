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
    Schema::create('drugs', function (Blueprint $table) {
        $table->id();
        $table->foreignId('category_id')->constrained('drug_categories')->onDelete('cascade');
        $table->string('name');
        $table->float('dose_per_kg');
        $table->float('max_single_dose');
        $table->integer('min_age_months')->nullable();
        $table->text('contraindications')->nullable();
        $table->enum('contraindication_severity', ['low', 'moderate', 'high'])->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('drugs');
    }
};
