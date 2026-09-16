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
