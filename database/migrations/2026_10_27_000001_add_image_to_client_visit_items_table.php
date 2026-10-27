<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('client_visit_items', function (Blueprint $table) {
            $table->string('image')->nullable()->after('stock_code');
        });
    }

    public function down(): void
    {
        Schema::table('client_visit_items', function (Blueprint $table) {
            $table->dropColumn('image');
        });
    }
};
