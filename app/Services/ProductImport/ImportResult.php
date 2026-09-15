<?php

namespace App\Services\ProductImport;

class ImportResult
{
    public int $created = 0;

    public int $updated = 0;

    /**
     * @var list<array{sku: ?string, row: ?int, message: string}>
     */
    public array $errors = [];

    /**
     * @var list<array{sku: ?string, row: ?int, message: string}>
     */
    public array $warnings = [];

    public function addError(?string $sku, ?int $row, string $message): void
    {
        $this->errors[] = [
            'sku' => $sku,
            'row' => $row,
            'message' => $message,
        ];
    }

    public function addWarning(?string $sku, ?int $row, string $message): void
    {
        $this->warnings[] = [
            'sku' => $sku,
            'row' => $row,
            'message' => $message,
        ];
    }

    /**
     * @return array{
     *     created: int,
     *     updated: int,
     *     errors: list<array{sku: ?string, row: ?int, message: string}>,
     *     warnings: list<array{sku: ?string, row: ?int, message: string}>
     * }
     */
    public function toArray(): array
    {
        return [
            'created' => $this->created,
            'updated' => $this->updated,
            'errors' => $this->errors,
            'warnings' => $this->warnings,
        ];
    }
}
