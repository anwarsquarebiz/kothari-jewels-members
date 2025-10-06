<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductDetail;
use App\Models\ProductImage;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create categories
        $categories = [
            [
                'name' => 'Rings',
                'slug' => 'rings',
                'description' => 'Exquisite rings for every occasion',
                'position' => 1,
            ],
            [
                'name' => 'Necklaces',
                'slug' => 'necklaces',
                'description' => 'Stunning necklaces and pendants',
                'position' => 2,
            ],
            [
                'name' => 'Earrings',
                'slug' => 'earrings',
                'description' => 'Beautiful earrings to complement your style',
                'position' => 3,
            ],
            [
                'name' => 'Bracelets',
                'slug' => 'bracelets',
                'description' => 'Elegant bracelets and bangles',
                'position' => 4,
            ],
        ];

        foreach ($categories as $categoryData) {
            Category::updateOrCreate(
                ['slug' => $categoryData['slug']],
                $categoryData
            );
        }

        // Create sample products
        $products = [
            [
                'title' => 'Cushion Emerald and Baguette Cut Diamond Bangle',
                'slug' => 'cushion-emerald-baguette-cut-diamond-bangle',
                'short_description' => 'A stunning bangle featuring cushion cut emeralds and baguette cut diamonds',
                'long_description' => 'This exquisite bangle showcases the perfect harmony between emeralds and diamonds. The cushion cut emeralds provide rich color while the baguette cut diamonds add brilliant sparkle.',
                'sku' => 'BEM-001',
                'currency' => 'INR',
                'price' => 1260000.00,
            ],
            [
                'title' => 'Pear Shaped Emerald and Baguette Diamond Wave Choker',
                'slug' => 'pear-shaped-emerald-baguette-diamond-wave-choker',
                'short_description' => 'An elegant choker featuring pear-shaped emeralds in a wave design',
                'long_description' => 'This magnificent choker features pear-shaped emeralds arranged in a flowing wave pattern, complemented by baguette cut diamonds for added brilliance.',
                'sku' => 'NEM-001',
                'currency' => 'INR',
                'price' => 2500000.00,
            ],
            [
                'title' => 'Sapphire and Diamond Engagement Ring',
                'slug' => 'sapphire-diamond-engagement-ring',
                'short_description' => 'A classic engagement ring with a stunning sapphire center stone',
                'long_description' => 'This timeless engagement ring features a beautiful sapphire center stone surrounded by brilliant cut diamonds in a classic setting.',
                'sku' => 'RSA-001',
                'currency' => 'INR',
                'price' => 850000.00,
            ],
            [
                'title' => 'Ruby and Diamond Drop Earrings',
                'slug' => 'ruby-diamond-drop-earrings',
                'short_description' => 'Elegant drop earrings featuring rubies and diamonds',
                'long_description' => 'These stunning drop earrings feature natural rubies paired with brilliant cut diamonds in a sophisticated design.',
                'sku' => 'ERU-001',
                'currency' => 'INR',
                'price' => 750000.00,
            ],
        ];

        $createdProducts = [];
        foreach ($products as $productData) {
            $product = Product::updateOrCreate(
                ['slug' => $productData['slug']],
                $productData
            );
            $createdProducts[] = $product;
        }

        // Create product images
        $productImages = [
            // Bangle images
            [
                'product_id' => $createdProducts[0]->id,
                'src' => 'media/product/Emerald Diamond Bangle/1.jpg',
                'is_primary' => true,
                'position' => 1,
            ],
            [
                'product_id' => $createdProducts[0]->id,
                'src' => 'media/product/Emerald Diamond Bangle/2.jpg',
                'is_primary' => false,
                'position' => 2,
            ],
            [
                'product_id' => $createdProducts[0]->id,
                'src' => 'media/product/Emerald Diamond Bangle/3.jpg',
                'is_primary' => false,
                'position' => 3,
            ],
            // Choker images
            [
                'product_id' => $createdProducts[1]->id,
                'src' => 'media/product/Necklace/8.jpg',
                'is_primary' => true,
                'position' => 1,
            ],
            [
                'product_id' => $createdProducts[1]->id,
                'src' => 'media/product/Necklace/9.jpg',
                'is_primary' => false,
                'position' => 2,
            ],
            // Ring images
            [
                'product_id' => $createdProducts[2]->id,
                'src' => 'media/product/more-products/3.jpg',
                'is_primary' => true,
                'position' => 1,
            ],
            // Earrings images
            [
                'product_id' => $createdProducts[3]->id,
                'src' => 'media/product/more-products/4.jpg',
                'is_primary' => true,
                'position' => 1,
            ],
        ];

        foreach ($productImages as $imageData) {
            ProductImage::updateOrCreate(
                [
                    'product_id' => $imageData['product_id'],
                    'position' => $imageData['position'],
                ],
                $imageData
            );
        }

        // Create product details
        $productDetails = [
            // Bangle details
            [
                'product_id' => $createdProducts[0]->id,
                'title' => 'Diamonds',
                'subtitle' => 'Baguette Cut Diamonds totalling 7.87 Carats',
                'image' => 'media/materials/5.jpg',
                'position' => 1,
            ],
            [
                'product_id' => $createdProducts[0]->id,
                'title' => 'Emeralds',
                'subtitle' => 'Cushion Cut Emeralds 7.57 Carats',
                'image' => 'media/materials/4.jpg',
                'position' => 2,
            ],
            [
                'product_id' => $createdProducts[0]->id,
                'title' => 'Material',
                'subtitle' => 'Set in Yellow Gold and Platinum',
                'image' => 'media/materials/6.jpg',
                'position' => 3,
            ],
            // Choker details
            [
                'product_id' => $createdProducts[1]->id,
                'title' => 'Emeralds',
                'subtitle' => 'Pear Shaped Emeralds: 21.90 carats',
                'image' => 'media/materials/4.jpg',
                'position' => 1,
            ],
            [
                'product_id' => $createdProducts[1]->id,
                'title' => 'Diamonds',
                'subtitle' => 'Baguette Cut Diamonds: 15.07 carats',
                'image' => 'media/materials/5.jpg',
                'position' => 2,
            ],
        ];

        foreach ($productDetails as $detailData) {
            ProductDetail::updateOrCreate(
                [
                    'product_id' => $detailData['product_id'],
                    'position' => $detailData['position'],
                ],
                $detailData
            );
        }

        // Assign products to categories
        $braceletCategory = Category::where('slug', 'bracelets')->first();
        $necklaceCategory = Category::where('slug', 'necklaces')->first();
        $ringCategory = Category::where('slug', 'rings')->first();
        $earringCategory = Category::where('slug', 'earrings')->first();

        $createdProducts[0]->categories()->sync([$braceletCategory->id => ['position' => 1]]);
        $createdProducts[1]->categories()->sync([$necklaceCategory->id => ['position' => 1]]);
        $createdProducts[2]->categories()->sync([$ringCategory->id => ['position' => 1]]);
        $createdProducts[3]->categories()->sync([$earringCategory->id => ['position' => 1]]);

        // Grant access to all users for all products
        $users = User::all();
        foreach ($users as $user) {
            foreach ($createdProducts as $product) {
                $user->grantProductAccess($product);
            }
        }

        $this->command->info('Products seeded successfully!');
    }
}
