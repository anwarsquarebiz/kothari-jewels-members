<?php

namespace App\Services\ProductImport;

use App\Models\Product;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class SpreadsheetWorkbook
{
    public const PRODUCT_HEADERS = [
        'sku',
        'title',
        'slug',
        'short_description',
        'long_description',
        'currency',
        'price',
        'categories',
        'user_emails',
    ];

    public const DETAIL_HEADERS = [
        'sku',
        'title',
        'subtitle',
        'image',
        'position',
        'is_active',
    ];

    public const IMAGE_HEADERS = [
        'sku',
        'image',
        'is_primary',
        'position',
    ];

    public function templatePath(): string
    {
        $spreadsheet = new Spreadsheet;
        $this->writeReadmeSheet($spreadsheet->getActiveSheet());

        $products = $spreadsheet->createSheet()->setTitle('products');
        $products->fromArray(self::PRODUCT_HEADERS, null, 'A1');
        $products->fromArray([
            'BEM-001',
            'Cushion Emerald and Baguette Cut Diamond Bangle',
            'cushion-emerald-baguette-cut-diamond-bangle',
            'A stunning bangle featuring cushion cut emeralds and baguette cut diamonds',
            'This exquisite bangle showcases the perfect harmony between emeralds and diamonds.',
            'INR',
            '1260000',
            'Bracelets',
            '',
        ], null, 'A2');

        $details = $spreadsheet->createSheet()->setTitle('details');
        $details->fromArray(self::DETAIL_HEADERS, null, 'A1');
        $details->fromArray([
            ['BEM-001', 'Diamonds', 'Baguette Cut Diamonds totalling 7.87 Carats', '', 1, 'TRUE'],
            ['BEM-001', 'Emeralds', 'Cushion Cut Emeralds 7.57 Carats', '', 2, 'TRUE'],
            ['BEM-001', 'Material', 'Set in Yellow Gold and Platinum', '', 3, 'TRUE'],
        ], null, 'A2');

        $images = $spreadsheet->createSheet()->setTitle('images');
        $images->fromArray(self::IMAGE_HEADERS, null, 'A1');
        $images->fromArray([
            ['BEM-001', 'bangle-1.jpg', 'TRUE', 1],
            ['BEM-001', 'https://example.com/bangle-2.jpg', 'FALSE', 2],
        ], null, 'A2');

        $spreadsheet->setActiveSheetIndex(1);

        return $this->saveTemp($spreadsheet, 'product-import-template');
    }

    public function exportPath(): string
    {
        $spreadsheet = new Spreadsheet;

        $productsSheet = $spreadsheet->getActiveSheet()->setTitle('products');
        $productsSheet->fromArray(self::PRODUCT_HEADERS, null, 'A1');

        $detailsSheet = $spreadsheet->createSheet()->setTitle('details');
        $detailsSheet->fromArray(self::DETAIL_HEADERS, null, 'A1');

        $imagesSheet = $spreadsheet->createSheet()->setTitle('images');
        $imagesSheet->fromArray(self::IMAGE_HEADERS, null, 'A1');

        $products = Product::with(['categories', 'details', 'images', 'usersWithAccess'])
            ->orderBy('title')
            ->get();

        $productRow = 2;
        $detailRow = 2;
        $imageRow = 2;

        foreach ($products as $product) {
            $productsSheet->fromArray([[
                $product->sku,
                $product->title,
                $product->slug,
                $product->short_description,
                $product->long_description,
                $product->currency,
                $product->price,
                $product->categories->pluck('name')->implode(', '),
                $product->usersWithAccess->pluck('email')->implode(', '),
            ]], null, 'A'.$productRow);
            $productRow++;

            foreach ($product->details as $detail) {
                $detailsSheet->fromArray([[
                    $product->sku,
                    $detail->title,
                    $detail->subtitle,
                    $detail->image,
                    $detail->position,
                    $detail->is_active ? 'TRUE' : 'FALSE',
                ]], null, 'A'.$detailRow);
                $detailRow++;
            }

            foreach ($product->images as $image) {
                $imagesSheet->fromArray([[
                    $product->sku,
                    $image->src,
                    $image->is_primary ? 'TRUE' : 'FALSE',
                    $image->position,
                ]], null, 'A'.$imageRow);
                $imageRow++;
            }
        }

        $spreadsheet->setActiveSheetIndex(0);

        return $this->saveTemp($spreadsheet, 'products-export');
    }

    private function writeReadmeSheet(\PhpOffice\PhpSpreadsheet\Worksheet\Worksheet $sheet): void
    {
        $sheet->setTitle('readme');
        $lines = [
            ['Kothari Jewels product import'],
            [''],
            ['Use the products, details, and images sheets. Match existing products by SKU to update them.'],
            [''],
            ['products columns'],
            ['sku (required)', 'title (required for new products)', 'slug (optional)', 'short_description', 'long_description', 'currency (default INR)', 'price (required for new products)', 'categories (comma-separated existing names or slugs)', 'user_emails (optional, comma-separated)'],
            [''],
            ['details columns'],
            ['sku', 'title', 'subtitle', 'image (URL or filename)', 'position', 'is_active'],
            [''],
            ['images columns'],
            ['sku', 'image (public https URL or filename from zip / public/media/imports)', 'is_primary', 'position'],
            [''],
            ['CSV: a single products.csv may include an images column (comma-separated) and a details column (one detail per line: title | subtitle | image).'],
            ['A zip may contain products.xlsx or products.csv plus image files.'],
            ['Empty details/images/categories for a SKU leave existing related data unchanged. Provided rows replace that related data.'],
        ];

        foreach ($lines as $index => $line) {
            $sheet->fromArray($line, null, 'A'.($index + 1));
        }
    }

    private function saveTemp(Spreadsheet $spreadsheet, string $prefix): string
    {
        $directory = storage_path('app/product-imports');
        if (! is_dir($directory)) {
            mkdir($directory, 0755, true);
        }

        $path = $directory.DIRECTORY_SEPARATOR.$prefix.'-'.uniqid('', true).'.xlsx';
        $writer = new Xlsx($spreadsheet);
        $writer->save($path);

        return $path;
    }
}
