<?php

namespace App\Services\ProductImport;

use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use RuntimeException;
use ZipArchive;

class SpreadsheetParser
{
    /**
     * @return array{drafts: array<string, ProductDraft>, files: array<string, string>, cleanup: list<string>}
     */
    public function parse(string $spreadsheetPath, ?string $imagesZipPath = null): array
    {
        $cleanup = [];
        $localFiles = [];
        $workingPath = $spreadsheetPath;

        try {
            $extension = strtolower(pathinfo($spreadsheetPath, PATHINFO_EXTENSION));

            $sidecars = [];

            if ($extension === 'zip') {
                $extracted = $this->extractZip($spreadsheetPath);
                $cleanup[] = $extracted['directory'];
                $localFiles = $extracted['files'];
                $workingPath = $extracted['spreadsheet'];
                $sidecars = $extracted['sidecars'];
            }

            if ($imagesZipPath) {
                $extractedImages = $this->extractZip($imagesZipPath, expectSpreadsheet: false);
                $cleanup[] = $extractedImages['directory'];
                $localFiles = array_merge($localFiles, $extractedImages['files']);
                $sidecars = array_merge($sidecars, $extractedImages['sidecars']);
            }

            $drafts = $this->parseSpreadsheet($workingPath);
            $this->applySidecarCsvs($drafts, $sidecars);

            return [
                'drafts' => $drafts,
                'files' => $localFiles,
                'cleanup' => $cleanup,
            ];
        } catch (\Throwable $e) {
            $this->cleanup($cleanup);
            throw $e;
        }
    }

    /**
     * @param  list<string>  $directories
     */
    public function cleanup(array $directories): void
    {
        foreach ($directories as $directory) {
            $this->deleteDirectory($directory);
        }
    }

    /**
     * @return array<string, ProductDraft>
     */
    private function parseSpreadsheet(string $path): array
    {
        $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));

        if (! in_array($extension, ['xlsx', 'xlsm', 'csv', 'txt'], true)) {
            throw new RuntimeException('Unsupported spreadsheet type. Upload an .xlsx, .csv, or .zip file.');
        }

        $reader = IOFactory::createReaderForFile($path);
        $reader->setReadDataOnly(true);
        $spreadsheet = $reader->load($path);

        if ($extension === 'csv' || $extension === 'txt') {
            return $this->parseCsvWorkbook($spreadsheet);
        }

        return $this->parseExcelWorkbook($spreadsheet);
    }

    /**
     * @return array<string, ProductDraft>
     */
    private function parseExcelWorkbook(Spreadsheet $spreadsheet): array
    {
        $sheets = [];
        foreach ($spreadsheet->getWorksheetIterator() as $worksheet) {
            $sheets[strtolower(trim($worksheet->getTitle()))] = $worksheet;
        }

        $productsSheet = $sheets['products'] ?? $this->firstNonMetaSheet($sheets);
        if (! $productsSheet) {
            throw new RuntimeException('The workbook is missing a Products sheet.');
        }

        $drafts = $this->parseProductsSheet($productsSheet, includeInlineRelated: false);

        if (isset($sheets['details'])) {
            $this->applyDetailsSheet($drafts, $sheets['details']);
        }

        if (isset($sheets['images'])) {
            $this->applyImagesSheet($drafts, $sheets['images']);
        }

        return $drafts;
    }

    /**
     * @return array<string, ProductDraft>
     */
    private function parseCsvWorkbook(Spreadsheet $spreadsheet): array
    {
        return $this->parseProductsSheet($spreadsheet->getActiveSheet(), includeInlineRelated: true);
    }

    /**
     * @param  array<string, Worksheet>  $sheets
     */
    private function firstNonMetaSheet(array $sheets): ?Worksheet
    {
        foreach ($sheets as $name => $sheet) {
            if (! in_array($name, ['readme', 'instructions', 'help'], true)) {
                return $sheet;
            }
        }

        return null;
    }

    /**
     * @return array<string, ProductDraft>
     */
    private function parseProductsSheet(Worksheet $sheet, bool $includeInlineRelated): array
    {
        $rows = $sheet->toArray(null, true, true, false);
        if ($rows === []) {
            throw new RuntimeException('The products sheet is empty.');
        }

        $headers = $this->normalizeHeaders(array_shift($rows) ?? []);
        $drafts = [];

        foreach ($rows as $index => $row) {
            $line = $index + 2;
            $values = $this->rowToAssoc($headers, $row);

            if ($this->isEmptyRow($values)) {
                continue;
            }

            $sku = $this->cell($values, 'sku');
            if ($sku === null) {
                throw new RuntimeException("Row {$line}: SKU is required.");
            }

            $draft = $drafts[strtolower($sku)] ?? new ProductDraft($sku, $line);
            $this->fillProductFields($draft, $values, $line);

            if ($includeInlineRelated) {
                $this->appendInlineDetails($draft, $values, $line);
                $this->appendInlineImages($draft, $values, $line);
            }

            $drafts[strtolower($sku)] = $draft;
        }

        return $drafts;
    }

    /**
     * @param  array<string, ProductDraft>  $drafts
     */
    private function applyDetailsSheet(array &$drafts, Worksheet $sheet): void
    {
        $rows = $sheet->toArray(null, true, true, false);
        if ($rows === []) {
            return;
        }

        $headers = $this->normalizeHeaders(array_shift($rows) ?? []);

        foreach ($rows as $index => $row) {
            $line = $index + 2;
            $values = $this->rowToAssoc($headers, $row);

            if ($this->isEmptyRow($values)) {
                continue;
            }

            $sku = $this->cell($values, 'sku');
            if ($sku === null) {
                continue;
            }

            $draft = $drafts[strtolower($sku)] ?? new ProductDraft($sku, $line);
            $title = $this->cell($values, 'title');

            if ($title === null) {
                throw new RuntimeException("Details row {$line}: title is required.");
            }

            $draft->details[] = [
                'title' => $title,
                'subtitle' => $this->cell($values, 'subtitle'),
                'image' => $this->cell($values, 'image'),
                'position' => $this->intCell($values, 'position'),
                'is_active' => $this->boolCell($values, 'is_active', true),
                'row' => $line,
            ];

            $drafts[strtolower($sku)] = $draft;
        }
    }

    /**
     * @param  array<string, ProductDraft>  $drafts
     */
    private function applyImagesSheet(array &$drafts, Worksheet $sheet): void
    {
        $rows = $sheet->toArray(null, true, true, false);
        if ($rows === []) {
            return;
        }

        $headers = $this->normalizeHeaders(array_shift($rows) ?? []);

        foreach ($rows as $index => $row) {
            $line = $index + 2;
            $values = $this->rowToAssoc($headers, $row);

            if ($this->isEmptyRow($values)) {
                continue;
            }

            $sku = $this->cell($values, 'sku');
            $image = $this->cell($values, 'image');

            if ($sku === null || $image === null) {
                continue;
            }

            $draft = $drafts[strtolower($sku)] ?? new ProductDraft($sku, $line);
            $draft->images[] = [
                'image' => $image,
                'is_primary' => $this->boolCell($values, 'is_primary', $draft->images === []),
                'position' => $this->intCell($values, 'position'),
                'row' => $line,
            ];
            $drafts[strtolower($sku)] = $draft;
        }
    }

    /**
     * @param  array<string, string|null>  $values
     */
    private function fillProductFields(ProductDraft $draft, array $values, int $line): void
    {
        $title = $this->cell($values, 'title');
        if ($title !== null) {
            $draft->title = $title;
        }

        $slug = $this->cell($values, 'slug');
        if ($slug !== null) {
            $draft->slug = $slug;
        }

        if (array_key_exists('short_description', $values) && $this->cell($values, 'short_description') !== null) {
            $draft->shortDescription = $this->cell($values, 'short_description');
        }

        if (array_key_exists('long_description', $values) && $this->cell($values, 'long_description') !== null) {
            $draft->longDescription = $this->cell($values, 'long_description');
        }

        $currency = $this->cell($values, 'currency');
        if ($currency !== null) {
            $draft->currency = strtoupper($currency);
        }

        $price = $this->cell($values, 'price');
        if ($price !== null) {
            $draft->price = $price;
        }

        $categories = $this->listCell($values, 'categories');
        if ($categories !== []) {
            $draft->categories = $categories;
        }

        $emails = $this->listCell($values, 'user_emails');
        if ($emails !== []) {
            $draft->userEmails = $emails;
        }

        $draft->sourceRow = $line;
    }

    /**
     * @param  array<string, string|null>  $values
     */
    private function appendInlineDetails(ProductDraft $draft, array $values, int $line): void
    {
        $raw = $this->cell($values, 'details');
        if ($raw === null) {
            return;
        }

        $lines = preg_split('/\\r\\n|\\n|\\r/', $raw) ?: [];

        foreach ($lines as $offset => $detailLine) {
            $detailLine = trim($detailLine);
            if ($detailLine === '') {
                continue;
            }

            $parts = array_map('trim', explode('|', $detailLine));
            $title = $parts[0] ?? '';

            if ($title === '') {
                continue;
            }

            $draft->details[] = [
                'title' => $title,
                'subtitle' => $parts[1] ?? null,
                'image' => $parts[2] ?? null,
                'position' => $offset + 1,
                'is_active' => true,
                'row' => $line,
            ];
        }
    }

    /**
     * @param  array<string, string|null>  $values
     */
    private function appendInlineImages(ProductDraft $draft, array $values, int $line): void
    {
        $raw = $this->cell($values, 'images');
        if ($raw === null) {
            return;
        }

        $images = array_values(array_filter(array_map('trim', explode(',', $raw))));

        foreach ($images as $index => $image) {
            $draft->images[] = [
                'image' => $image,
                'is_primary' => $index === 0 && $draft->images === [],
                'position' => $index + 1,
                'row' => $line,
            ];
        }
    }

    /**
     * @param  list<mixed>  $headerRow
     * @return list<string>
     */
    private function normalizeHeaders(array $headerRow): array
    {
        $aliases = [
            'name' => 'title',
            'product_title' => 'title',
            'product_sku' => 'sku',
            'short description' => 'short_description',
            'long description' => 'long_description',
            'description' => 'long_description',
            'category' => 'categories',
            'users' => 'user_emails',
            'member_emails' => 'user_emails',
            'image_src' => 'image',
            'image' => 'image',
            'images' => 'images',
        ];

        $headers = [];

        foreach ($headerRow as $header) {
            $normalized = strtolower(trim((string) $header));
            $normalized = str_replace(['-', ' '], '_', $normalized);
            $normalized = $aliases[$normalized] ?? $normalized;
            $headers[] = $normalized;
        }

        return $headers;
    }

    /**
     * @param  list<string>  $headers
     * @param  list<mixed>  $row
     * @return array<string, string|null>
     */
    private function rowToAssoc(array $headers, array $row): array
    {
        $values = [];

        foreach ($headers as $index => $header) {
            if ($header === '') {
                continue;
            }

            $value = $row[$index] ?? null;
            $values[$header] = $this->stringify($value);
        }

        return $values;
    }

    private function stringify(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }

        if (is_bool($value)) {
            return $value ? '1' : '0';
        }

        if (is_float($value) || is_int($value)) {
            if (is_float($value) && floor($value) === $value) {
                return (string) (int) $value;
            }

            return (string) $value;
        }

        $string = trim((string) $value);

        return $string === '' ? null : $string;
    }

    /**
     * @param  array<string, string|null>  $values
     */
    private function cell(array $values, string $key): ?string
    {
        $value = $values[$key] ?? null;

        return $value === null || $value === '' ? null : $value;
    }

    /**
     * @param  array<string, string|null>  $values
     * @return list<string>
     */
    private function listCell(array $values, string $key): array
    {
        $raw = $this->cell($values, $key);
        if ($raw === null) {
            return [];
        }

        return array_values(array_filter(array_map('trim', preg_split('/[,;]+/', $raw) ?: [])));
    }

    /**
     * @param  array<string, string|null>  $values
     */
    private function intCell(array $values, string $key): ?int
    {
        $raw = $this->cell($values, $key);

        return $raw !== null && is_numeric($raw) ? (int) $raw : null;
    }

    /**
     * @param  array<string, string|null>  $values
     */
    private function boolCell(array $values, string $key, bool $default): bool
    {
        $raw = $this->cell($values, $key);
        if ($raw === null) {
            return $default;
        }

        return in_array(strtolower($raw), ['1', 'true', 'yes', 'y'], true);
    }

    /**
     * @param  array<string, string|null>  $values
     */
    private function isEmptyRow(array $values): bool
    {
        foreach ($values as $value) {
            if ($value !== null && $value !== '') {
                return false;
            }
        }

        return true;
    }

    /**
     * @param  array<string, ProductDraft>  $drafts
     * @param  array<string, string>  $sidecars
     */
    private function applySidecarCsvs(array &$drafts, array $sidecars): void
    {
        if (! empty($sidecars['details'])) {
            $this->applyDetailsSheet($drafts, $this->loadCsvSheet($sidecars['details']));
        }

        if (! empty($sidecars['images'])) {
            $this->applyImagesSheet($drafts, $this->loadCsvSheet($sidecars['images']));
        }
    }

    private function loadCsvSheet(string $path): Worksheet
    {
        $reader = IOFactory::createReaderForFile($path);
        $reader->setReadDataOnly(true);

        return $reader->load($path)->getActiveSheet();
    }

    /**
     * @return array{directory: string, spreadsheet: string, files: array<string, string>, sidecars: array<string, string>}
     */
    private function extractZip(string $zipPath, bool $expectSpreadsheet = true): array
    {
        if (! class_exists(ZipArchive::class)) {
            throw new RuntimeException('PHP Zip extension is required to import zip files.');
        }

        $zip = new ZipArchive;
        if ($zip->open($zipPath) !== true) {
            throw new RuntimeException('Could not open the zip file.');
        }

        $directory = storage_path('app/product-imports/'.uniqid('import_', true));
        if (! mkdir($directory, 0755, true) && ! is_dir($directory)) {
            $zip->close();
            throw new RuntimeException('Could not create a temporary import directory.');
        }

        $files = [];
        $sidecars = [];
        $spreadsheet = null;
        $preferredNames = ['products.xlsx', 'products.csv', 'product.xlsx', 'product.csv'];

        for ($i = 0; $i < $zip->numFiles; $i++) {
            $name = $zip->getNameIndex($i);
            if ($name === false || str_ends_with($name, '/')) {
                continue;
            }

            $safeName = str_replace('\\', '/', $name);
            if (str_contains($safeName, '..')) {
                continue;
            }

            $target = $directory.DIRECTORY_SEPARATOR.basename($safeName);
            $contents = $zip->getFromIndex($i);
            if ($contents === false) {
                continue;
            }

            file_put_contents($target, $contents);

            $basename = strtolower(basename($safeName));
            $extension = strtolower(pathinfo($basename, PATHINFO_EXTENSION));

            if (in_array($basename, ['details.csv', 'product_details.csv'], true)) {
                $sidecars['details'] = $target;
            } elseif (in_array($basename, ['images.csv', 'product_images.csv'], true)) {
                $sidecars['images'] = $target;
            } elseif (in_array($extension, ['xlsx', 'xlsm', 'csv'], true)) {
                if (in_array($basename, $preferredNames, true) || $spreadsheet === null) {
                    $spreadsheet = $target;
                }
            }

            if (in_array($extension, ['jpg', 'jpeg', 'png', 'webp', 'gif'], true)) {
                $files[$basename] = $target;
            }
        }

        $zip->close();

        if ($expectSpreadsheet && $spreadsheet === null) {
            $this->deleteDirectory($directory);
            throw new RuntimeException('The zip file does not contain a products.xlsx or products.csv spreadsheet.');
        }

        return [
            'directory' => $directory,
            'spreadsheet' => $spreadsheet ?? '',
            'files' => $files,
            'sidecars' => $sidecars,
        ];
    }

    private function deleteDirectory(string $directory): void
    {
        if ($directory === '' || ! is_dir($directory)) {
            return;
        }

        $items = scandir($directory) ?: [];
        foreach ($items as $item) {
            if ($item === '.' || $item === '..') {
                continue;
            }

            $path = $directory.DIRECTORY_SEPARATOR.$item;
            if (is_dir($path)) {
                $this->deleteDirectory($path);
            } else {
                @unlink($path);
            }
        }

        @rmdir($directory);
    }
}
