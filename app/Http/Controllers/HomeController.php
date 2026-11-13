<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Display the home page.
     */
    public function index()
    {
        $formatProduct = function (Product $product) {
            $primaryImage = $product->images->firstWhere('is_primary', true) ?? $product->images->first();
            $src = $primaryImage ? $primaryImage->src : null;
            if ($src && !str_starts_with($src, 'http://') && !str_starts_with($src, 'https://') && !str_starts_with($src, '/')) {
                $src = '/' . $src;
            }

            $stones = $product->landing_stones;
            if (!is_array($stones) || empty($stones)) {
                $stones = ['diamond'];
            }

            return [
                'id' => $product->id,
                'slug' => $product->slug,
                'title' => $product->title,
                'sku' => $product->sku,
                'price' => (float) $product->price,
                'currency' => $product->currency,
                'formatted_price' => $product->formatted_price,
                'short_description' => $product->short_description,
                'image_url' => $src,
                'alt' => $product->title,
                'stones' => $stones,
                'is_feature' => (bool) $product->is_landing_feature,
                'bg' => $product->landing_feature_bg,
                'category_slug' => $product->categories->first()?->slug ?? 'jewellery',
            ];
        };

        // Query rail products
        $railProducts = Product::where('show_in_landing_rail', true)
            ->with(['images', 'categories'])
            ->orderBy('rail_position')
            ->orderBy('id', 'desc')
            ->get()
            ->map($formatProduct)
            ->values()
            ->all();

        // If no products explicitly selected, fallback to recent products
        if (empty($railProducts)) {
            $railProducts = Product::with(['images', 'categories'])
                ->orderBy('id', 'desc')
                ->take(6)
                ->get()
                ->map($formatProduct)
                ->values()
                ->all();
        }

        // Query jewellery page products
        $jewelleryProducts = Product::where('show_in_landing_jewellery', true)
            ->with(['images', 'categories'])
            ->orderBy('jewellery_position')
            ->orderBy('id', 'desc')
            ->get()
            ->map($formatProduct)
            ->values()
            ->all();

        // If no products explicitly selected, fallback to recent products
        if (empty($jewelleryProducts)) {
            $jewelleryProducts = Product::with(['images', 'categories'])
                ->orderBy('id', 'desc')
                ->get()
                ->map($formatProduct)
                ->values()
                ->all();
        }

        return Inertia::render('Home', [
            'title' => 'Welcome to Kothari Jewels',
            'description' => 'Discover our exquisite collection of jewelry',
            'railProducts' => $railProducts,
            'jewelleryProducts' => $jewelleryProducts,
        ]);
    }
}
