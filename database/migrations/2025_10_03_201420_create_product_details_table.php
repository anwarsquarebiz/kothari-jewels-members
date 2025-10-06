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
        Schema::create('product_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')
                  ->constrained('products')
                  ->cascadeOnDelete();         // Cascade delete with product

            $table->string('title');                     // e.g., Diamonds
            $table->string('subtitle')->nullable();      // e.g., Baguette Cut Diamonds totalling 7.87 Carats
            $table->string('image')->nullable();         // e.g., /media/materials/5.jpg
            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            // 🔍 Indexes
            $table->index(['product_id', 'position']);
            $table->index(['product_id', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_details');
    }
};
