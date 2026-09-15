<?php

namespace App\Services\ProductImport;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductDetail;
use App\Models\ProductImage;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use RuntimeException;
use Stevebauman\Purify\Facades\Purify;

class ProductImportService
{
    public function __construct(
        private SpreadsheetParser $parser = new SpreadsheetParser,
        private ImageResolver $images = new ImageResolver,
    ) {}

    public function import(string $spreadsheetPath, ?string $imagesZipPath = null): ImportResult
    {
        $parsed = $this->parser->parse($spreadsheetPath, $imagesZipPath);
        $result = new ImportResult;

        try {
            $this->images->setLocalFiles($parsed['files']);

            foreach ($parsed['drafts'] as $draft) {
                $this->importDraft($draft, $result);
            }
        } finally {
            $this->parser->cleanup($parsed['cleanup']);
        }

        return $result;
    }

    private function importDraft(ProductDraft $draft, ImportResult $result): void
    {
        $existing = Product::where('sku', $draft->sku)->first();
        $error = $this->validateDraft($draft, $existing);

        if ($error !== null) {
            $result->addError($draft->sku, $draft->sourceRow, $error);

            return;
        }

        try {
            DB::transaction(function () use ($draft, $existing, $result): void {
                $wasNew = $existing === null;
                $product = $this->upsertProduct($draft, $existing);

                if ($draft->hasCategories()) {
                    $this->syncCategories($product, $draft->categories ?? []);
                }

                if ($draft->hasUserEmails()) {
                    $this->syncUsers($product, $draft->userEmails ?? []);
                }

                if ($draft->hasDetails()) {
                    $this->replaceDetails($product, $draft, $result);
                }

                if ($draft->hasImages()) {
                    $this->replaceImages($product, $draft, $result);
                }

                if ($wasNew) {
                    $result->created++;
                } else {
                    $result->updated++;
                }
            });
        } catch (RuntimeException $e) {
            $result->addError($draft->sku, $draft->sourceRow, $e->getMessage());
        } catch (\Throwable $e) {
            $result->addError($draft->sku, $draft->sourceRow, 'Failed to import product: '.$e->getMessage());
        }
    }

    private function validateDraft(ProductDraft $draft, ?Product $existing): ?string
    {
        if ($draft->sku === '') {
            return 'SKU is required.';
        }

        if ($existing === null && ($draft->title === null || $draft->title === '')) {
            return 'Title is required for new products.';
        }

        if ($existing === null && ($draft->price === null || $draft->price === '')) {
            return 'Price is required for new products.';
        }

        if ($draft->price !== null && (! is_numeric($draft->price) || (float) $draft->price < 0)) {
            return 'Price must be a number greater than or equal to 0.';
        }

        if ($draft->currency !== null && strlen($draft->currency) !== 3) {
            return 'Currency must be exactly 3 characters.';
        }

        if ($draft->slug !== null) {
            $slugTaken = Product::where('slug', $draft->slug)
                ->when($existing, fn ($query) => $query->where('id', '!=', $existing->id))
                ->exists();

            if ($slugTaken) {
                return "Slug [{$draft->slug}] is already used by another product.";
            }
        }

        if ($draft->hasCategories()) {
            foreach ($draft->categories ?? [] as $name) {
                if ($this->findCategory($name) === null) {
                    return "Category [{$name}] was not found. Create it first.";
                }
            }
        }

        if ($draft->hasUserEmails()) {
            foreach ($draft->userEmails ?? [] as $email) {
                if ($this->findUser($email) === null) {
                    return "User [{$email}] was not found.";
                }
            }
        }

        return null;
    }

    private function upsertProduct(ProductDraft $draft, ?Product $existing): Product
    {
        $attributes = [
            'sku' => $draft->sku,
        ];

        if ($draft->title !== null) {
            $attributes['title'] = $draft->title;
        }

        if ($draft->shortDescription !== null) {
            $attributes['short_description'] = Purify::clean($draft->shortDescription);
        }

        if ($draft->longDescription !== null) {
            $attributes['long_description'] = Purify::clean($draft->longDescription);
        }

        if ($draft->currency !== null) {
            $attributes['currency'] = $draft->currency;
        } elseif ($existing === null) {
            $attributes['currency'] = 'INR';
        }

        if ($draft->price !== null) {
            $attributes['price'] = $draft->price;
        }

        if ($draft->slug !== null) {
            $attributes['slug'] = $draft->slug;
        } elseif ($existing === null) {
            $attributes['slug'] = $this->uniqueSlug(Str::slug($draft->title ?? $draft->sku));
        }

        if ($existing) {
            $existing->update($attributes);

            return $existing->fresh();
        }

        return Product::create($attributes);
    }

    private function uniqueSlug(string $base): string
    {
        $slug = $base !== '' ? $base : 'product';
        $candidate = $slug;
        $i = 1;

        while (Product::where('slug', $candidate)->exists()) {
            $candidate = $slug.'-'.++$i;
        }

        return $candidate;
    }

    /**
     * @param  list<string>  $names
     */
    private function syncCategories(Product $product, array $names): void
    {
        $positions = [];

        foreach (array_values($names) as $index => $name) {
            $category = $this->findCategory($name);
            if ($category) {
                $positions[$category->id] = ['position' => $index + 1];
            }
        }

        $product->categories()->sync($positions);
    }

    /**
     * @param  list<string>  $emails
     */
    private function syncUsers(Product $product, array $emails): void
    {
        $ids = [];

        foreach ($emails as $email) {
            $user = $this->findUser($email);
            if ($user) {
                $ids[] = $user->id;
            }
        }

        $product->usersWithAccess()->sync($ids);
    }

    private function replaceDetails(Product $product, ProductDraft $draft, ImportResult $result): void
    {
        $resolved = [];

        foreach (array_values($draft->details) as $index => $row) {
            $imagePath = null;

            if (! empty($row['image'])) {
                try {
                    $imagePath = $this->images->resolve((string) $row['image'], $product->id, 'details');
                } catch (RuntimeException $e) {
                    $result->addWarning($draft->sku, $row['row'] ?? $draft->sourceRow, $e->getMessage());
                }
            }

            $resolved[] = [
                'title' => $row['title'],
                'subtitle' => $row['subtitle'] ?: null,
                'image' => $imagePath,
                'position' => $row['position'] ?? ($index + 1),
                'is_active' => $row['is_active'] ?? true,
            ];
        }

        $keep = array_filter(array_column($resolved, 'image'));

        foreach ($product->details as $detail) {
            if ($detail->image && ! in_array($detail->image, $keep, true)) {
                $this->images->deleteUploadedPath($detail->image);
            }
        }

        $product->details()->delete();

        foreach ($resolved as $row) {
            ProductDetail::create([
                'product_id' => $product->id,
                'title' => $row['title'],
                'subtitle' => $row['subtitle'],
                'image' => $row['image'],
                'position' => $row['position'],
                'is_active' => $row['is_active'],
            ]);
        }
    }

    private function replaceImages(Product $product, ProductDraft $draft, ImportResult $result): void
    {
        $resolved = [];

        foreach (array_values($draft->images) as $index => $row) {
            try {
                $resolved[] = [
                    'src' => $this->images->resolve($row['image'], $product->id, 'products'),
                    'is_primary' => (bool) $row['is_primary'],
                    'position' => $row['position'] ?? ($index + 1),
                ];
            } catch (RuntimeException $e) {
                $result->addWarning($draft->sku, $row['row'] ?? $draft->sourceRow, $e->getMessage());
            }
        }

        $keep = array_column($resolved, 'src');

        foreach ($product->images as $image) {
            if (! in_array($image->src, $keep, true)) {
                $this->images->deleteUploadedPath($image->src);
            }
        }

        $product->images()->delete();

        $hasPrimary = collect($resolved)->contains(fn (array $image): bool => $image['is_primary']);

        foreach ($resolved as $index => $image) {
            ProductImage::create([
                'product_id' => $product->id,
                'src' => $image['src'],
                'is_primary' => $hasPrimary ? $image['is_primary'] : $index === 0,
                'position' => $image['position'],
            ]);
        }
    }

    private function findCategory(string $name): ?Category
    {
        $needle = strtolower($name);

        return Category::query()
            ->where(function ($query) use ($needle): void {
                $query->whereRaw('LOWER(name) = ?', [$needle])
                    ->orWhereRaw('LOWER(slug) = ?', [$needle]);
            })
            ->first();
    }

    private function findUser(string $email): ?User
    {
        return User::query()
            ->whereRaw('LOWER(email) = ?', [strtolower($email)])
            ->first();
    }
}
