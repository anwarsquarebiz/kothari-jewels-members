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
        Schema::table('products', function (Blueprint $table) {
            $table->boolean('show_in_landing_rail')->default(false)->index()->after('long_description');
            $table->integer('rail_position')->default(0)->after('show_in_landing_rail');
            $table->boolean('show_in_landing_jewellery')->default(false)->index()->after('rail_position');
            $table->integer('jewellery_position')->default(0)->after('show_in_landing_jewellery');
            $table->json('landing_stones')->nullable()->after('jewellery_position');
            $table->boolean('is_landing_feature')->default(false)->after('landing_stones');
            $table->string('landing_feature_bg', 50)->nullable()->after('is_landing_feature');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'show_in_landing_rail',
                'rail_position',
                'show_in_landing_jewellery',
                'jewellery_position',
                'landing_stones',
                'is_landing_feature',
                'landing_feature_bg',
            ]);
        });
    }
};
