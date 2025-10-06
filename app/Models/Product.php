<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;
use Stevebauman\Purify\Facades\Purify;

class Product extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'slug',
        'short_description',
        'sku',
        'currency',
        'price',
        'long_description',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price' => 'decimal:2',
    ];

    /**
     * The attributes that should be automatically sanitized.
     *
     * @var array<string>
     */
    protected $purify = [
        'short_description',
        'long_description',
    ];

    /**
     * Get the product images for the product.
     */
    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('position');
    }

    /**
     * Get the product details for the product.
     */
    public function details(): HasMany
    {
        return $this->hasMany(ProductDetail::class)->orderBy('position');
    }

    /**
     * Get the primary image for the product.
     */
    public function primaryImage(): BelongsTo
    {
        return $this->belongsTo(ProductImage::class, 'id', 'product_id')->where('is_primary', true);
    }

    /**
     * Get active product details for the product.
     */
    public function activeDetails(): HasMany
    {
        return $this->hasMany(ProductDetail::class)->where('is_active', true)->orderBy('position');
    }

    /**
     * Get the categories for the product.
     */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class)
                    ->withPivot('position')
                    ->withTimestamps()
                    ->orderByPivot('position');
    }

    /**
     * Get active categories for the product.
     */
    public function activeCategories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class)
                    ->where('is_active', true)
                    ->withPivot('position')
                    ->withTimestamps()
                    ->orderByPivot('position');
    }

    /**
     * Get the primary category for the product (first assigned category).
     */
    public function primaryCategory(): BelongsToMany
    {
        return $this->belongsToMany(Category::class)
                    ->where('is_active', true)
                    ->withPivot('position')
                    ->withTimestamps()
                    ->orderByPivot('position')
                    ->limit(1);
    }

    /**
     * Get users who have access to this product.
     */
    public function usersWithAccess(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_products')->withTimestamps();
    }

    /**
     * Check if a user has access to this product.
     */
    public function userHasAccess(User $user): bool
    {
        return $this->usersWithAccess()->where('user_id', $user->id)->exists();
    }

    /**
     * Grant access to a user.
     */
    public function grantAccess(User $user): void
    {
        $this->usersWithAccess()->syncWithoutDetaching([$user->id]);
    }

    /**
     * Revoke access from a user.
     */
    public function revokeAccess(User $user): void
    {
        $this->usersWithAccess()->detach($user->id);
    }

    /**
     * Find product by slug.
     */
    public static function findBySlug(string $slug): ?self
    {
        return static::where('slug', $slug)->first();
    }

    /**
     * Boot method to auto-generate slug.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->title);
            }
        });

        static::updating(function ($product) {
            if ($product->isDirty('title') && empty($product->slug)) {
                $product->slug = Str::slug($product->title);
            }
        });
    }

    /**
     * Get the primary image URL.
     */
    public function getPrimaryImageUrlAttribute(): ?string
    {
        $primaryImage = $this->images()->where('is_primary', true)->first();
        return $primaryImage ? $primaryImage->src : null;
    }

    /**
     * Get formatted price.
     */
    public function getFormattedPriceAttribute(): string
    {
        return number_format($this->price, 2) . ' ' . $this->currency;
    }
}
