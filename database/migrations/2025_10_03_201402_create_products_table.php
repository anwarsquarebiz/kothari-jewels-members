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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('title');                                // Product title
            $table->longText('short_description')->nullable();      // Short description
            $table->string('sku')->unique();                        // SKU - unique identifier
            $table->string('currency', 10)->default('INR');         // Currency (e.g. USD, INR)
            $table->decimal('price', 12, 2)->default(0);            // Price with 2 decimals
            $table->longText('long_description')->nullable();       // Full description
            $table->timestamps();

            // 🔍 Indexes
            $table->index('title');            // Useful for search
            $table->index('price');            // Useful for filtering/sorting
            $table->index('currency');         // Filter by currency
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
