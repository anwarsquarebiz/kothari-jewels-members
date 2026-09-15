<?php

namespace App\Services\ProductImport;

class ProductDraft
{
    public string $sku;

    public int $sourceRow;

    public ?string $title = null;

    public ?string $slug = null;

    public ?string $shortDescription = null;

    public ?string $longDescription = null;

    public ?string $currency = null;

    public ?string $price = null;

    /**
     * @var list<string>|null
     */
    public ?array $categories = null;

    /**
     * @var list<string>|null
     */
    public ?array $userEmails = null;

    /**
     * @var list<array{title: string, subtitle: ?string, image: ?string, position: ?int, is_active: bool, row: int}>
     */
    public array $details = [];

    /**
     * @var list<array{image: string, is_primary: bool, position: ?int, row: int}>
     */
    public array $images = [];

    public function __construct(string $sku, int $sourceRow)
    {
        $this->sku = $sku;
        $this->sourceRow = $sourceRow;
    }

    public function hasDetails(): bool
    {
        return $this->details !== [];
    }

    public function hasImages(): bool
    {
        return $this->images !== [];
    }

    public function hasCategories(): bool
    {
        return $this->categories !== null && $this->categories !== [];
    }

    public function hasUserEmails(): bool
    {
        return $this->userEmails !== null && $this->userEmails !== [];
    }
}
