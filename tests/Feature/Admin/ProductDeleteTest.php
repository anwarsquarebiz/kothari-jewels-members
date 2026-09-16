<?php

use App\Models\Product;
use App\Models\ProductDetail;
use App\Models\ProductImage;
use App\Models\User;

beforeEach(function (): void {
    $this->seed(\Database\Seeders\RoleSeeder::class);

    $this->admin = User::factory()->create(['is_active' => true]);
    $this->admin->assignRole('admin');
});

test('admin can delete a product that has images and details', function (): void {
    $product = Product::create([
        'title' => 'Deletable Ring',
        'slug' => 'deletable-ring',
        'sku' => 'DEL-001',
        'currency' => 'INR',
        'price' => 1500,
    ]);

    ProductImage::create([
        'product_id' => $product->id,
        'src' => '/media/product/example.jpg',
        'is_primary' => true,
        'position' => 1,
    ]);

    ProductDetail::create([
        'product_id' => $product->id,
        'title' => 'Gold',
        'subtitle' => '18K',
        'image' => '/media/materials/gold.jpg',
        'position' => 1,
        'is_active' => true,
    ]);

    $this->actingAs($this->admin)
        ->delete(route('admin.products.destroy', $product))
        ->assertRedirect(route('admin.products.index'));

    $this->assertDatabaseMissing('products', ['id' => $product->id]);
    $this->assertDatabaseMissing('product_images', ['product_id' => $product->id]);
    $this->assertDatabaseMissing('product_details', ['product_id' => $product->id]);
});

test('admin delete removes uploaded product files', function (): void {
    $product = Product::create([
        'title' => 'Uploaded Ring',
        'slug' => 'uploaded-ring',
        'sku' => 'DEL-002',
        'currency' => 'INR',
        'price' => 2500,
    ]);

    $directory = public_path("media/uploads/products/{$product->id}");
    if (! is_dir($directory)) {
        mkdir($directory, 0755, true);
    }

    $filename = 'test-image.jpg';
    $relativePath = "/media/uploads/products/{$product->id}/{$filename}";
    file_put_contents(public_path(ltrim($relativePath, '/')), 'fake-image');

    ProductImage::create([
        'product_id' => $product->id,
        'src' => $relativePath,
        'is_primary' => true,
        'position' => 1,
    ]);

    $this->actingAs($this->admin)
        ->delete(route('admin.products.destroy', $product))
        ->assertRedirect(route('admin.products.index'));

    $this->assertDatabaseMissing('products', ['id' => $product->id]);
    expect(is_file(public_path(ltrim($relativePath, '/'))))->toBeFalse();

    if (is_dir($directory)) {
        @rmdir($directory);
    }
});
