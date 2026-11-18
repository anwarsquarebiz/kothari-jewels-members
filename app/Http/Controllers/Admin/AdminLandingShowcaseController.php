<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminLandingShowcaseController extends Controller
{
    /**
     * Display the landing showcase management interface.
     */
    public function index(Request $request)
    {
        $formatProduct = function (Product $product) {
            $primaryImage = $product->images->firstWhere('is_primary', true) ?? $product->images->first();
            $src = $primaryImage ? $primaryImage->src : null;
            if ($src && !str_starts_with($src, 'http://') && !str_starts_with($src, 'https://') && !str_starts_with($src, '/')) {
                $src = '/' . $src;
            }

            return [
                'id' => $product->id,
                'title' => $product->title,
                'slug' => $product->slug,
                'sku' => $product->sku,
                'price' => (float) $product->price,
                'currency' => $product->currency,
                'formatted_price' => $product->formatted_price,
                'primary_image_url' => $src,
                'show_in_landing_rail' => (bool) $product->show_in_landing_rail,
                'rail_position' => (int) ($product->rail_position ?? 0),
                'show_in_landing_jewellery' => (bool) $product->show_in_landing_jewellery,
                'jewellery_position' => (int) ($product->jewellery_position ?? 0),
                'landing_stones' => $product->landing_stones ?: [],
                'is_landing_feature' => (bool) $product->is_landing_feature,
                'landing_feature_bg' => $product->landing_feature_bg,
                'categories' => $product->categories->map(fn($c) => ['id' => $c->id, 'name' => $c->name, 'slug' => $c->slug]),
            ];
        };

        // Products for Selected Pieces rail
        $railProducts = Product::where('show_in_landing_rail', true)
            ->with(['images', 'categories'])
            ->orderBy('rail_position')
            ->orderBy('id', 'desc')
            ->get()
            ->map($formatProduct);

        // Products for Jewellery page grid
        $jewelleryProducts = Product::where('show_in_landing_jewellery', true)
            ->with(['images', 'categories'])
            ->orderBy('jewellery_position')
            ->orderBy('id', 'desc')
            ->get()
            ->map($formatProduct);

        // All active products for search & selection modal
        $allProducts = Product::with(['images', 'categories'])
            ->orderBy('title')
            ->get()
            ->map($formatProduct);

        $categories = Category::active()->orderBy('name')->get(['id', 'name', 'slug']);

        return Inertia::render('Admin/LandingShowcase/Index', [
            'railProducts' => $railProducts,
            'jewelleryProducts' => $jewelleryProducts,
            'allProducts' => $allProducts,
            'categories' => $categories,
            'stoneOptions' => [
                ['key' => 'emerald', 'label' => 'Emerald', 'color' => '#1F6B4F'],
                ['key' => 'ruby', 'label' => 'Ruby', 'color' => '#540C1F'],
                ['key' => 'pearl', 'label' => 'Pearl', 'color' => '#E4DCC8'],
                ['key' => 'diamond', 'label' => 'Diamond', 'color' => '#FFFFFF'],
                ['key' => 'onyx', 'label' => 'Onyx', 'color' => '#1A1718'],
            ],
            'featureColorOptions' => [
                ['name' => 'Merlot Wine', 'value' => '#540C1F'],
                ['name' => 'Midnight Emerald', 'value' => '#0F0E0E'],
                ['name' => 'Ivory Pearl', 'value' => '#EDE7D6'],
                ['name' => 'Warm Sand', 'value' => '#E4DCC8'],
                ['name' => 'Dark Onyx', 'value' => '#1A1718'],
                ['name' => 'Deep Charcoal', 'value' => '#242021'],
            ],
        ]);
    }

    /**
     * Update the Selected Pieces rail order and products list.
     */
    public function updateRail(Request $request)
    {
        $validated = $request->validate([
            'product_ids' => 'present|array',
            'product_ids.*' => 'integer|exists:products,id',
        ]);

        $productIds = $validated['product_ids'];

        // Clear previous rail selections
        Product::where('show_in_landing_rail', true)->update([
            'show_in_landing_rail' => false,
            'rail_position' => 0,
        ]);

        // Apply new order
        foreach ($productIds as $index => $id) {
            Product::where('id', $id)->update([
                'show_in_landing_rail' => true,
                'rail_position' => $index + 1,
            ]);
        }

        return back()->with('success', 'Selected Pieces rail updated successfully.');
    }

    /**
     * Update the Jewellery collection showcase pieces, ordering, stones and feature cards.
     */
    public function updateJewellery(Request $request)
    {
        $validated = $request->validate([
            'items' => 'present|array',
            'items.*.id' => 'required|integer|exists:products,id',
            'items.*.position' => 'nullable|integer',
            'items.*.landing_stones' => 'nullable|array',
            'items.*.landing_stones.*' => 'string|in:emerald,ruby,pearl,diamond,onyx',
            'items.*.is_landing_feature' => 'nullable|boolean',
            'items.*.landing_feature_bg' => 'nullable|string|max:50',
        ]);

        $items = $validated['items'];
        $itemIds = array_column($items, 'id');

        // Remove products not present in items
        Product::where('show_in_landing_jewellery', true)
            ->whereNotIn('id', $itemIds)
            ->update([
                'show_in_landing_jewellery' => false,
                'jewellery_position' => 0,
            ]);

        // Update selected items
        foreach ($items as $index => $itemData) {
            Product::where('id', $itemData['id'])->update([
                'show_in_landing_jewellery' => true,
                'jewellery_position' => $itemData['position'] ?? ($index + 1),
                'landing_stones' => $itemData['landing_stones'] ?? ['diamond'],
                'is_landing_feature' => (bool) ($itemData['is_landing_feature'] ?? false),
                'landing_feature_bg' => $itemData['landing_feature_bg'] ?? null,
            ]);
        }

        return back()->with('success', 'Jewellery collection showcase updated successfully.');
    }

    /**
     * Toggle a single product for the rail.
     */
    public function toggleRail(Product $product)
    {
        if ($product->show_in_landing_rail) {
            $product->update([
                'show_in_landing_rail' => false,
                'rail_position' => 0,
            ]);
            $message = "\"{$product->title}\" removed from Selected Pieces rail.";
        } else {
            $nextPos = (int) Product::where('show_in_landing_rail', true)->max('rail_position') + 1;
            $product->update([
                'show_in_landing_rail' => true,
                'rail_position' => $nextPos,
            ]);
            $message = "\"{$product->title}\" added to Selected Pieces rail.";
        }

        return back()->with('success', $message);
    }

    /**
     * Toggle a single product for the Jewellery page.
     */
    public function toggleJewellery(Product $product)
    {
        if ($product->show_in_landing_jewellery) {
            $product->update([
                'show_in_landing_jewellery' => false,
                'jewellery_position' => 0,
            ]);
            $message = "\"{$product->title}\" removed from Jewellery collection page.";
        } else {
            $nextPos = (int) Product::where('show_in_landing_jewellery', true)->max('jewellery_position') + 1;
            $stones = $product->landing_stones ?: ['diamond'];
            $product->update([
                'show_in_landing_jewellery' => true,
                'jewellery_position' => $nextPos,
                'landing_stones' => $stones,
            ]);
            $message = "\"{$product->title}\" added to Jewellery collection page.";
        }

        return back()->with('success', $message);
    }

    /**
     * Update individual product landing showcase settings.
     */
    public function updateProductSettings(Request $request, Product $product)
    {
        $validated = $request->validate([
            'show_in_landing_rail' => 'nullable|boolean',
            'rail_position' => 'nullable|integer',
            'show_in_landing_jewellery' => 'nullable|boolean',
            'jewellery_position' => 'nullable|integer',
            'landing_stones' => 'nullable|array',
            'landing_stones.*' => 'string|in:emerald,ruby,pearl,diamond,onyx',
            'is_landing_feature' => 'nullable|boolean',
            'landing_feature_bg' => 'nullable|string|max:50',
        ]);

        $product->update($validated);

        return back()->with('success', "Updated landing showcase settings for \"{$product->title}\".");
    }
}

