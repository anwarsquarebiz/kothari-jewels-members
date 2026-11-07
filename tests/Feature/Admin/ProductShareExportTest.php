<?php

use App\Models\Product;
use App\Models\ProductDetail;
use App\Models\ProductImage;
use App\Models\User;
use App\Services\ProductShare;

beforeEach(function (): void {
    $this->seed(\Database\Seeders\RoleSeeder::class);

    $this->admin = User::factory()->create(['is_active' => true]);
    $this->admin->assignRole('admin');
});

afterEach(function (): void {
    $directory = public_path('media/uploads/share-test');

    if (! is_dir($directory)) {
        return;
    }

    foreach (glob($directory.'/*') ?: [] as $file) {
        if (is_file($file)) {
            unlink($file);
        }
    }

    rmdir($directory);
});

test('share sheet omits the price break up image and inactive details', function (): void {
    $first = shareProduct('First Pendant', 'SHARE-1');
    $second = shareProduct('Second Pendant', 'SHARE-2');

    $front = shareJpeg('front.jpg');
    $side = shareJpeg('side.jpg');
    $breakup = shareJpeg('breakup.jpg');

    ProductImage::create([
        'product_id' => $first->id,
        'src' => $front,
        'is_primary' => true,
        'position' => 1,
    ]);
    ProductImage::create([
        'product_id' => $first->id,
        'src' => $side,
        'is_primary' => false,
        'position' => 2,
    ]);
    ProductImage::create([
        'product_id' => $first->id,
        'src' => $breakup,
        'is_primary' => false,
        'position' => 3,
        'tag' => 'price-break-up',
    ]);

    ProductDetail::create([
        'product_id' => $first->id,
        'title' => 'Diamonds',
        'subtitle' => 'Baguette cut',
        'position' => 1,
        'is_active' => true,
    ]);
    ProductDetail::create([
        'product_id' => $first->id,
        'title' => 'Hidden',
        'subtitle' => 'Not shown',
        'position' => 2,
        'is_active' => false,
    ]);

    $sheets = app(ProductShare::class)->sheets([$second->id, $first->id]);

    expect($sheets)->toHaveCount(2)
        ->and($sheets[0]['title'])->toBe('Second Pendant')
        ->and($sheets[0]['images'])->toBe([])
        ->and($sheets[1]['title'])->toBe('First Pendant')
        ->and($sheets[1]['images'])->toBe([$front, $side])
        ->and($sheets[1]['details'])->toBe([
            ['title' => 'Diamonds', 'subtitle' => 'Baguette cut'],
        ])
        ->and($sheets[1]['price'])->toBe('₹ 1,00,000');
});

test('selected products export as one pdf and one jpeg', function (): void {
    $product = shareProduct('Shareable Ring', 'SHARE-3');
    ProductImage::create([
        'product_id' => $product->id,
        'src' => shareJpeg('ring.jpg'),
        'is_primary' => true,
        'position' => 1,
    ]);
    ProductDetail::create([
        'product_id' => $product->id,
        'title' => 'Gold',
        'subtitle' => '18K yellow gold',
        'position' => 1,
        'is_active' => true,
    ]);

    $pdf = $this->actingAs($this->admin)
        ->post(route('admin.products.share-export'), [
            'ids' => [$product->id],
            'format' => 'pdf',
        ]);

    $pdf->assertOk();
    expect($pdf->headers->get('content-type'))->toContain('application/pdf')
        ->and($pdf->headers->get('content-disposition'))->toContain('products-share.pdf');

    $image = $this->actingAs($this->admin)
        ->post(route('admin.products.share-export'), [
            'ids' => [$product->id],
            'format' => 'image',
        ]);

    $image->assertOk();
    expect($image->headers->get('content-type'))->toContain('image/jpeg')
        ->and($image->headers->get('content-disposition'))->toContain('products-share.jpg')
        ->and(substr($image->getContent(), 0, 2))->toBe("\xFF\xD8");
});

function shareProduct(string $title, string $sku): Product
{
    return Product::create([
        'title' => $title,
        'sku' => $sku,
        'currency' => 'INR',
        'price' => 100000,
    ]);
}

function shareJpeg(string $filename): string
{
    $directory = public_path('media/uploads/share-test');

    if (! is_dir($directory)) {
        mkdir($directory, 0755, true);
    }

    $image = imagecreatetruecolor(40, 30);
    imagefill($image, 0, 0, imagecolorallocate($image, 180, 150, 110));
    imagejpeg($image, $directory.DIRECTORY_SEPARATOR.$filename, 90);
    imagedestroy($image);

    return '/media/uploads/share-test/'.$filename;
}
