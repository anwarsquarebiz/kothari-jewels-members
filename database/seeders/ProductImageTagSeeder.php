<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;

class ProductImageTagSeeder extends Seeder
{
    /**
     * Tag the third image as the price break-up image for products that have exactly three images.
     */
    public function run(): void
    {
        $tag = 'price-break-up';
        $updated = 0;

        Product::query()
            ->with(['images' => fn ($query) => $query->orderBy('position')->orderBy('id')])
            ->orderBy('id')
            ->chunkById(100, function ($products) use ($tag, &$updated) {
                foreach ($products as $product) {
                    if ($product->images->count() !== 3) {
                        continue;
                    }

                    $third = $product->images->values()->get(2);

                    ProductImage::query()
                        ->where('product_id', $product->id)
                        ->where('id', '!=', $third->id)
                        ->where('tag', $tag)
                        ->update(['tag' => null]);

                    if ($third->tag !== $tag) {
                        $third->update(['tag' => $tag]);
                    }

                    $updated++;
                }
            });

        $this->command?->info("Tagged the third image as price break up on {$updated} product(s) with exactly 3 images.");
    }
}
