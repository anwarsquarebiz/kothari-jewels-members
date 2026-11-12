<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class LandingShowcaseSeeder extends Seeder
{
    /**
     * Seed initial products for the landing showcase.
     */
    public function run(): void
    {
        $products = Product::with('categories')->get();

        if ($products->isEmpty()) {
            return;
        }

        // Stone mappings based on product titles/categories
        $stoneKeywords = [
            'emerald' => 'emerald',
            'ruby' => 'ruby',
            'pearl' => 'pearl',
            'diamond' => 'diamond',
            'sapphire' => 'diamond', // map sapphire to diamond or elegant category
            'onyx' => 'onyx',
        ];

        $railIndex = 1;
        $jewelleryIndex = 1;

        foreach ($products as $product) {
            $titleLower = strtolower($product->title . ' ' . $product->short_description);
            $stones = [];

            foreach ($stoneKeywords as $keyword => $stoneTag) {
                if (str_contains($titleLower, $keyword)) {
                    $stones[] = $stoneTag;
                }
            }

            // Always ensure at least one stone tag for filterability
            if (empty($stones)) {
                $stones[] = 'diamond';
            }
            $stones = array_values(array_unique($stones));

            // Mark for rail
            $inRail = $railIndex <= 6;
            // Mark for jewellery
            $inJewellery = true;

            $isFeature = ($jewelleryIndex === 1 || $jewelleryIndex === 6);
            $featureBg = null;
            if ($isFeature) {
                if (in_array('ruby', $stones)) {
                    $featureBg = '#540C1F';
                } elseif (in_array('emerald', $stones)) {
                    $featureBg = '#0F0E0E';
                } else {
                    $featureBg = '#1A1718';
                }
            }

            $product->update([
                'show_in_landing_rail' => $inRail,
                'rail_position' => $inRail ? $railIndex : 0,
                'show_in_landing_jewellery' => $inJewellery,
                'jewellery_position' => $jewelleryIndex,
                'landing_stones' => $stones,
                'is_landing_feature' => $isFeature,
                'landing_feature_bg' => $featureBg,
            ]);

            if ($inRail) {
                $railIndex++;
            }
            $jewelleryIndex++;
        }
    }
}

