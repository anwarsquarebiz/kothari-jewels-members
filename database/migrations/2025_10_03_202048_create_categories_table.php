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
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');                      // "Rings", "Necklaces", etc.
            $table->string('slug')->unique();            // url-friendly unique slug
            $table->foreignId('parent_id')               // optional hierarchy
                  ->nullable()
                  ->constrained('categories')
                  ->nullOnDelete();
            $table->unsignedInteger('position')->default(0); // ordering within siblings
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            // Indexes to speed up common queries
            $table->index(['parent_id', 'position']);
            $table->index(['is_active']);
            // (Optional) Prevent duplicate names under the same parent
            $table->unique(['parent_id', 'name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
