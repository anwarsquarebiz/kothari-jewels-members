<?php

use App\Models\Product;
use App\Models\User;

test('products index includes laravel pagination props for the storefront', function (): void {
    $user = User::factory()->create(['is_active' => true]);

    foreach (range(1, 13) as $index) {
        $product = Product::create([
            'title' => "Storefront Product {$index}",
            'slug' => "storefront-product-{$index}",
            'sku' => "SF-{$index}",
            'currency' => 'INR',
            'price' => 1000 + $index,
        ]);

        $user->grantProductAccess($product);
    }

    $this->actingAs($user)
        ->get(route('products.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Products/Index')
            ->has('products.data', 12)
            ->where('products.current_page', 1)
            ->where('products.last_page', 2)
            ->where('products.per_page', 12)
            ->where('products.total', 13)
            ->has('products.links')
        );
});

test('products index sorts by the requested order', function (): void {
    $user = User::factory()->create(['is_active' => true]);

    $zebra = Product::create([
        'title' => 'Zebra Ring',
        'slug' => 'zebra-ring',
        'sku' => 'SORT-ZEBRA',
        'currency' => 'INR',
        'price' => 100,
    ]);
    $apple = Product::create([
        'title' => 'Apple Necklace',
        'slug' => 'apple-necklace',
        'sku' => 'SORT-APPLE',
        'currency' => 'INR',
        'price' => 900,
    ]);

    $user->grantProductAccess($zebra);
    $user->grantProductAccess($apple);

    $this->actingAs($user)
        ->get(route('products.index', ['sort' => 'price-low']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('filters.sort', 'price-low')
            ->where('products.data.0.sku', 'SORT-ZEBRA')
            ->where('products.data.1.sku', 'SORT-APPLE')
        );

    $this->actingAs($user)
        ->get(route('products.index', ['sort' => 'price-high']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('products.data.0.sku', 'SORT-APPLE')
            ->where('products.data.1.sku', 'SORT-ZEBRA')
        );

    $this->actingAs($user)
        ->get(route('products.index', ['sort' => 'name']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('products.data.0.sku', 'SORT-APPLE')
            ->where('products.data.1.sku', 'SORT-ZEBRA')
        );
});
