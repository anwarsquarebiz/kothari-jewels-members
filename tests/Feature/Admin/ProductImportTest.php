<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductDetail;
use App\Models\ProductImage;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

beforeEach(function (): void {
    $this->seed(\Database\Seeders\RoleSeeder::class);

    Category::create([
        'name' => 'Rings',
        'slug' => 'rings',
        'position' => 1,
        'is_active' => true,
    ]);
});

afterEach(function (): void {
    foreach (['media/uploads/products', 'media/uploads/details'] as $relative) {
        $directory = public_path($relative);
        if (is_dir($directory)) {
            deleteTestDirectory($directory);
        }
    }

    $importFile = public_path('media/imports/folder-ring.png');
    if (is_file($importFile)) {
        @unlink($importFile);
    }
});

function importAdmin(): User
{
    $admin = User::factory()->create(['is_active' => true]);
    $admin->assignRole('admin');

    return $admin;
}

function csvUpload(string $contents, string $filename = 'products.csv'): UploadedFile
{
    return UploadedFile::fake()->createWithContent($filename, $contents);
}

function tinyPng(): string
{
    return base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==') ?: '';
}

function xlsxUpload(array $productRow, array $detailRows = [], array $imageRows = []): UploadedFile
{
    $spreadsheet = new Spreadsheet;
    $products = $spreadsheet->getActiveSheet()->setTitle('products');
    $products->fromArray(['sku', 'title', 'slug', 'short_description', 'long_description', 'currency', 'price', 'categories', 'user_emails'], null, 'A1');
    $products->fromArray($productRow, null, 'A2');

    $details = $spreadsheet->createSheet()->setTitle('details');
    $details->fromArray(['sku', 'title', 'subtitle', 'image', 'position', 'is_active'], null, 'A1');
    if ($detailRows !== []) {
        $details->fromArray($detailRows, null, 'A2');
    }

    $images = $spreadsheet->createSheet()->setTitle('images');
    $images->fromArray(['sku', 'image', 'is_primary', 'position'], null, 'A1');
    if ($imageRows !== []) {
        $images->fromArray($imageRows, null, 'A2');
    }

    $path = sys_get_temp_dir().DIRECTORY_SEPARATOR.uniqid('products_', true).'.xlsx';
    (new Xlsx($spreadsheet))->save($path);

    return new UploadedFile($path, 'products.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', null, true);
}

function zipUpload(array $files, string $filename = 'import.zip'): UploadedFile
{
    $path = sys_get_temp_dir().DIRECTORY_SEPARATOR.uniqid('import_', true).'.zip';
    $zip = new ZipArchive;
    $zip->open($path, ZipArchive::CREATE);
    foreach ($files as $name => $contents) {
        $zip->addFromString($name, $contents);
    }
    $zip->close();

    return new UploadedFile($path, $filename, 'application/zip', null, true);
}

function deleteTestDirectory(string $directory): void
{
    $items = scandir($directory) ?: [];
    foreach ($items as $item) {
        if ($item === '.' || $item === '..') {
            continue;
        }

        $path = $directory.DIRECTORY_SEPARATOR.$item;
        if (is_dir($path)) {
            deleteTestDirectory($path);
        } else {
            @unlink($path);
        }
    }

    @rmdir($directory);
}

test('admin can view the product import page', function (): void {
    $this->actingAs(importAdmin())
        ->get(route('admin.products.import'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('Admin/Products/Import'));
});

test('admin can download the import template', function (): void {
    $this->actingAs(importAdmin())
        ->get(route('admin.products.import.template'))
        ->assertOk()
        ->assertDownload('product-import-template.xlsx');
});

test('admin can export current products', function (): void {
    $this->actingAs(importAdmin())
        ->get(route('admin.products.export'))
        ->assertOk()
        ->assertDownload('products-export.xlsx');
});

test('invalid file type is rejected', function (): void {
    $this->actingAs(importAdmin())
        ->post(route('admin.products.import.store'), [
            'file' => UploadedFile::fake()->create('notes.txt', 20, 'text/plain'),
        ])
        ->assertSessionHasErrors('file');
});

test('it creates a new product from csv', function (): void {
    $csv = <<<'CSV'
sku,title,price,currency,categories
NEW-001,Gold Ring,1500,INR,Rings
CSV;

    $this->actingAs(importAdmin())
        ->post(route('admin.products.import.store'), [
            'file' => csvUpload($csv),
        ])
        ->assertRedirect(route('admin.products.import'))
        ->assertSessionHas('import_result.created', 1);

    $product = Product::where('sku', 'NEW-001')->first();
    expect($product)->not->toBeNull()
        ->and($product->title)->toBe('Gold Ring')
        ->and((float) $product->price)->toBe(1500.0)
        ->and($product->categories->pluck('slug')->all())->toContain('rings');
});

test('it updates an existing product by sku', function (): void {
    $product = Product::create([
        'title' => 'Old Title',
        'slug' => 'old-title',
        'sku' => 'SKU-001',
        'currency' => 'INR',
        'price' => 100,
    ]);

    $csv = <<<'CSV'
sku,title,price
SKU-001,Updated Title,250
CSV;

    $this->actingAs(importAdmin())
        ->post(route('admin.products.import.store'), [
            'file' => csvUpload($csv),
        ])
        ->assertRedirect(route('admin.products.import'))
        ->assertSessionHas('import_result.updated', 1);

    expect($product->fresh()->title)->toBe('Updated Title')
        ->and((float) $product->fresh()->price)->toBe(250.0);
});

test('it replaces details when the file includes them', function (): void {
    $product = Product::create([
        'title' => 'Emerald Ring',
        'slug' => 'emerald-ring',
        'sku' => 'DET-001',
        'currency' => 'INR',
        'price' => 500,
    ]);

    ProductDetail::create([
        'product_id' => $product->id,
        'title' => 'Old Material',
        'subtitle' => 'Should be replaced',
        'position' => 1,
        'is_active' => true,
    ]);

    $file = xlsxUpload(
        ['DET-001', 'Emerald Ring', 'emerald-ring', '', '', 'INR', '500', 'Rings', ''],
        [
            ['DET-001', 'Diamonds', 'Round brilliant 1.2ct', '', 1, 'TRUE'],
            ['DET-001', 'Gold', '18K Yellow Gold', '', 2, 'TRUE'],
        ]
    );

    $this->actingAs(importAdmin())
        ->post(route('admin.products.import.store'), [
            'file' => $file,
        ])
        ->assertRedirect(route('admin.products.import'));

    $product->refresh()->load('details');
    expect($product->details)->toHaveCount(2)
        ->and($product->details->pluck('title')->all())->toBe(['Diamonds', 'Gold']);
});

test('missing category is reported and the product is not created', function (): void {
    $csv = <<<'CSV'
sku,title,price,categories
BAD-001,Missing Category Ring,100,Does Not Exist
CSV;

    $this->actingAs(importAdmin())
        ->post(route('admin.products.import.store'), [
            'file' => csvUpload($csv),
        ])
        ->assertRedirect(route('admin.products.import'))
        ->assertSessionHas('import_result.created', 0);

    $this->assertDatabaseMissing('products', ['sku' => 'BAD-001']);
});

test('it downloads image urls during import', function (): void {
    Http::fake([
        'https://cdn.example.com/ring.png' => Http::response(tinyPng(), 200, ['Content-Type' => 'image/png']),
    ]);

    $csv = <<<'CSV'
sku,title,price,images
URL-001,URL Ring,900,https://cdn.example.com/ring.png
CSV;

    $this->actingAs(importAdmin())
        ->post(route('admin.products.import.store'), [
            'file' => csvUpload($csv),
        ])
        ->assertRedirect(route('admin.products.import'))
        ->assertSessionHas('import_result.created', 1);

    $product = Product::where('sku', 'URL-001')->with('images')->first();
    expect($product->images)->toHaveCount(1)
        ->and($product->images->first()->src)->toStartWith('/media/uploads/products/')
        ->and($product->images->first()->is_primary)->toBeTrue();

    expect(is_file(public_path(ltrim($product->images->first()->src, '/'))))->toBeTrue();
});

test('it copies image filenames from an uploaded zip', function (): void {
    $csv = <<<'CSV'
sku,title,price,images
ZIP-001,Zip Ring,800,ring.png
CSV;

    $this->actingAs(importAdmin())
        ->post(route('admin.products.import.store'), [
            'file' => csvUpload($csv),
            'images_zip' => zipUpload(['ring.png' => tinyPng()], 'images.zip'),
        ])
        ->assertRedirect(route('admin.products.import'))
        ->assertSessionHas('import_result.created', 1);

    $product = Product::where('sku', 'ZIP-001')->with('images')->first();
    expect($product->images)->toHaveCount(1);
    expect(is_file(public_path(ltrim($product->images->first()->src, '/'))))->toBeTrue();
});

test('it copies image filenames from the media imports folder', function (): void {
    $imports = public_path('media/imports');
    if (! is_dir($imports)) {
        mkdir($imports, 0755, true);
    }
    file_put_contents($imports.DIRECTORY_SEPARATOR.'folder-ring.png', tinyPng());

    $csv = <<<'CSV'
sku,title,price,images
FLD-001,Folder Ring,700,folder-ring.png
CSV;

    $this->actingAs(importAdmin())
        ->post(route('admin.products.import.store'), [
            'file' => csvUpload($csv),
        ])
        ->assertRedirect(route('admin.products.import'))
        ->assertSessionHas('import_result.created', 1);

    $product = Product::where('sku', 'FLD-001')->with('images')->first();
    expect($product->images)->toHaveCount(1);
});

test('missing image filename warns but still creates the product', function (): void {
    $csv = <<<'CSV'
sku,title,price,images
WARN-001,Warning Ring,400,missing.png
CSV;

    $this->actingAs(importAdmin())
        ->post(route('admin.products.import.store'), [
            'file' => csvUpload($csv),
        ])
        ->assertRedirect(route('admin.products.import'))
        ->assertSessionHas('import_result.created', 1);

    $result = session('import_result');
    expect($result['warnings'])->not->toBeEmpty();
    expect(Product::where('sku', 'WARN-001')->exists())->toBeTrue();
    expect(ProductImage::query()->count())->toBe(0);
});

test('empty related columns leave existing details unchanged', function (): void {
    $product = Product::create([
        'title' => 'Keep Details',
        'slug' => 'keep-details',
        'sku' => 'KEEP-001',
        'currency' => 'INR',
        'price' => 200,
    ]);

    ProductDetail::create([
        'product_id' => $product->id,
        'title' => 'Platinum',
        'subtitle' => 'Keep me',
        'position' => 1,
        'is_active' => true,
    ]);

    $csv = <<<'CSV'
sku,title,price
KEEP-001,Keep Details Updated,300
CSV;

    $this->actingAs(importAdmin())
        ->post(route('admin.products.import.store'), [
            'file' => csvUpload($csv),
        ])
        ->assertRedirect(route('admin.products.import'));

    expect($product->fresh()->details)->toHaveCount(1)
        ->and($product->fresh()->details->first()->title)->toBe('Platinum');
});
