<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductDetail;
use App\Models\ProductImage;
use Barryvdh\DomPDF\Facade\Pdf;
use Barryvdh\DomPDF\PDF as DomPdfDocument;
use GdImage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ProductShare
{
    private const PAGE_WIDTH = 1240;

    private const PAGE_HEIGHT = 1500;

    private const PRICE_BREAK_UP = 'price-break-up';

    /**
     * Customer share sheets in the requested product order.
     * Gallery images tagged as a price break-up are omitted.
     *
     * @param  list<int>  $ids
     * @return list<array{title: string, images: list<string>, details: list<array{title: string, subtitle: ?string}>, price: ?string}>
     */
    public function sheets(array $ids): array
    {
        $products = Product::query()
            ->with([
                'images' => fn ($query) => $query->orderBy('position')->orderBy('id'),
                'activeDetails',
            ])
            ->whereIn('id', $ids)
            ->get()
            ->keyBy('id');

        $sheets = [];

        foreach ($ids as $id) {
            $product = $products->get($id);

            if (! $product instanceof Product) {
                continue;
            }

            $images = $product->images
                ->reject(fn (ProductImage $image): bool => $image->tag === self::PRICE_BREAK_UP)
                ->sortBy(fn (ProductImage $image): string => sprintf(
                    '%d-%05d-%010d',
                    $image->is_primary ? 0 : 1,
                    $image->position,
                    $image->id,
                ))
                ->values();

            $sheets[] = [
                'title' => $product->title,
                'images' => $images
                    ->map(fn (ProductImage $image): string => $image->src)
                    ->all(),
                'details' => $product->activeDetails
                    ->map(fn (ProductDetail $detail): array => [
                        'title' => $detail->title,
                        'subtitle' => $detail->subtitle,
                    ])
                    ->values()
                    ->all(),
                'price' => $this->formatPrice($product->price, $product->currency),
            ];
        }

        return $sheets;
    }

    /**
     * @param  list<int>  $ids
     */
    public function pdf(array $ids): DomPdfDocument
    {
        $sheets = $this->sheets($ids);
        $this->ensureSheets($sheets);

        $products = array_map(function (array $sheet): array {
            $images = array_values(array_filter(array_map(
                fn (string $src): ?string => $this->dataUri($src, 1200),
                array_slice($sheet['images'], 0, 2),
            )));

            return [
                'title' => $sheet['title'],
                'main' => $images[0] ?? null,
                'secondary' => $images[1] ?? null,
                'details' => $sheet['details'],
                'price' => $sheet['price'],
            ];
        }, $sheets);

        $this->ensureFontDirectory();

        return Pdf::loadView('pdf.product-share', [
            'logo' => $this->pngDataUri('/media/kothari-1937-logo.png', 480),
            'font' => str_replace('\\', '/', resource_path('fonts/BodoniModa-Regular.ttf')),
            'products' => $products,
        ])->setPaper('a4', 'portrait');
    }

    /**
     * @param  list<int>  $ids
     */
    public function jpeg(array $ids): string
    {
        $sheets = $this->sheets($ids);
        $this->ensureSheets($sheets);

        $logo = $this->loadPublicImage('/media/kothari-1937-logo.png', 480, true);
        $galleries = [];

        try {
            foreach ($sheets as $index => $sheet) {
                $galleries[$index] = [];

                foreach (array_slice($sheet['images'], 0, 2) as $src) {
                    $image = $this->loadPublicImage($src, 1200);

                    if ($image instanceof GdImage) {
                        $galleries[$index][] = $image;
                    }
                }
            }

            return $this->drawJpeg($sheets, $galleries, $logo);
        } finally {
            if ($logo instanceof GdImage) {
                imagedestroy($logo);
            }

            foreach ($galleries as $images) {
                foreach ($images as $image) {
                    imagedestroy($image);
                }
            }
        }
    }

    /**
     * @param  list<array{title: string, images: list<string>, details: list<array{title: string, subtitle: ?string}>}>  $sheets
     */
    private function ensureSheets(array $sheets): void
    {
        if ($sheets === []) {
            throw ValidationException::withMessages([
                'ids' => 'Select at least one product.',
            ]);
        }
    }

    private function formatPrice(mixed $amount, ?string $currency): ?string
    {
        if ($amount === null || $amount === '') {
            return null;
        }

        $grouped = $this->groupIndian((int) round((float) $amount));
        $currency = strtoupper((string) ($currency ?: 'INR'));

        return $currency === 'INR' ? '₹ '.$grouped : $currency.' '.$grouped;
    }

    private function groupIndian(int $amount): string
    {
        $negative = $amount < 0;
        $digits = (string) abs($amount);

        if (strlen($digits) <= 3) {
            return ($negative ? '-' : '').$digits;
        }

        $head = substr($digits, 0, -3);
        $tail = substr($digits, -3);
        $head = preg_replace('/\B(?=(\d{2})+(?!\d))/', ',', $head) ?? $head;

        return ($negative ? '-' : '').$head.','.$tail;
    }

    private function dataUri(string $src, int $maxSize): ?string
    {
        $image = $this->loadPublicImage($src, $maxSize);

        if (! $image instanceof GdImage) {
            return null;
        }

        ob_start();
        imagejpeg($image, null, 88);
        $jpeg = (string) ob_get_clean();
        imagedestroy($image);

        if ($jpeg === '') {
            return null;
        }

        return 'data:image/jpeg;base64,'.base64_encode($jpeg);
    }

    private function pngDataUri(string $src, int $maxSize): ?string
    {
        $image = $this->loadPublicImage($src, $maxSize, true);

        if (! $image instanceof GdImage) {
            return null;
        }

        ob_start();
        imagepng($image);
        $png = (string) ob_get_clean();
        imagedestroy($image);

        if ($png === '') {
            return null;
        }

        return 'data:image/png;base64,'.base64_encode($png);
    }

    private function loadPublicImage(string $src, int $maxSize = 1200, bool $preserveAlpha = false): ?GdImage
    {
        $path = $this->absolutePath($src);

        if ($path === null) {
            return null;
        }

        $source = match (mime_content_type($path)) {
            'image/png' => @imagecreatefrompng($path),
            'image/jpeg' => @imagecreatefromjpeg($path),
            'image/gif' => @imagecreatefromgif($path),
            'image/webp' => function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($path) : false,
            default => false,
        };

        if (! $source instanceof GdImage) {
            return null;
        }

        $width = imagesx($source);
        $height = imagesy($source);
        $scale = min(1, $maxSize / max($width, $height, 1));
        $targetWidth = max(1, (int) round($width * $scale));
        $targetHeight = max(1, (int) round($height * $scale));
        $flat = imagecreatetruecolor($targetWidth, $targetHeight);

        if ($preserveAlpha) {
            imagealphablending($flat, false);
            imagesavealpha($flat, true);
            imagefilledrectangle($flat, 0, 0, $targetWidth, $targetHeight, imagecolorallocatealpha($flat, 0, 0, 0, 127));
            imagecopyresampled($flat, $source, 0, 0, 0, 0, $targetWidth, $targetHeight, $width, $height);
            imagealphablending($flat, false);
            imagesavealpha($flat, true);
        } else {
            imagefill($flat, 0, 0, imagecolorallocate($flat, 255, 255, 255));
            imagecopyresampled($flat, $source, 0, 0, 0, 0, $targetWidth, $targetHeight, $width, $height);
        }

        imagedestroy($source);

        return $flat;
    }

    private function absolutePath(string $src): ?string
    {
        if (Str::startsWith($src, ['http://', 'https://', 'data:'])) {
            return null;
        }

        $path = public_path(ltrim($src, '/'));

        return is_file($path) ? $path : null;
    }

    /**
     * @param  list<array{title: string, images: list<string>, details: list<array{title: string, subtitle: ?string}>, price: ?string}>  $sheets
     * @param  list<list<GdImage>>  $galleries
     */
    private function drawJpeg(array $sheets, array $galleries, ?GdImage $logo): string
    {
        $canvas = imagecreatetruecolor(self::PAGE_WIDTH, self::PAGE_HEIGHT * count($sheets));

        try {
            $regular = $this->font(false);
            $bold = $this->font(true);

            foreach ($sheets as $index => $sheet) {
                $this->paintPage(
                    $canvas,
                    $index * self::PAGE_HEIGHT,
                    $sheet,
                    $galleries[$index] ?? [],
                    $logo,
                    $bold,
                    $regular,
                );
            }

            ob_start();
            imagejpeg($canvas, null, 90);

            return (string) ob_get_clean();
        } finally {
            imagedestroy($canvas);
        }
    }

    /**
     * @param  array{title: string, images: list<string>, details: list<array{title: string, subtitle: ?string}>, price: ?string}  $sheet
     * @param  list<GdImage>  $images
     */
    private function paintPage(
        GdImage $canvas,
        int $top,
        array $sheet,
        array $images,
        ?GdImage $logo,
        string $bold,
        string $regular,
    ): void {
        $width = self::PAGE_WIDTH;
        $height = self::PAGE_HEIGHT;
        $cream = imagecolorallocate($canvas, 246, 241, 233);
        $ink = imagecolorallocate($canvas, 48, 44, 40);
        $muted = imagecolorallocate($canvas, 92, 86, 78);
        $line = imagecolorallocate($canvas, 196, 186, 172);
        $border = imagecolorallocate($canvas, 214, 204, 190);

        imagefilledrectangle($canvas, 0, $top, $width, $top + $height, $cream);
        imagerectangle($canvas, 34, $top + 34, $width - 34, $top + $height - 34, $border);

        $contentX = 86;
        $contentW = $width - 172;
        $y = $top + 72;

        if ($logo instanceof GdImage) {
            $logoBox = $this->logoBox($logo);
            imagealphablending($canvas, true);
            imagecopyresampled(
                $canvas,
                $logo,
                (int) (($width - $logoBox['width']) / 2),
                $y,
                0,
                0,
                $logoBox['width'],
                $logoBox['height'],
                imagesx($logo),
                imagesy($logo),
            );
            $y += $logoBox['height'] + 36;
        }

        $titleLines = $this->wrap(mb_strtoupper($sheet['title']), $regular, 22, $contentW);
        if ($titleLines === []) {
            $titleLines = [mb_strtoupper($sheet['title'])];
        }

        foreach ($titleLines as $titleLine) {
            $this->drawTracked($canvas, $titleLine, $regular, 22, (int) ($width / 2), $y + 22, $ink, 3.2);
            $y += 36;
        }

        $y += 14;
        $ruleWidth = 88;
        imageline($canvas, (int) (($width - $ruleWidth) / 2), $y, (int) (($width + $ruleWidth) / 2), $y, $ink);
        $y += 42;

        $main = $images[0] ?? null;
        $side = $images[1] ?? null;
        $photoTop = $y;
        $photoHeight = 690;

        if ($main instanceof GdImage && $side instanceof GdImage) {
            $mainWidth = (int) ($contentW * 0.64);
            $sideWidth = (int) ($contentW * 0.26);
            $gap = $contentW - $mainWidth - $sideWidth;
            $this->drawContained($canvas, $main, $contentX, $photoTop, $mainWidth, $photoHeight);
            $dividerX = $contentX + $mainWidth + (int) ($gap / 2);
            imageline($canvas, $dividerX, $photoTop + 70, $dividerX, $photoTop + $photoHeight - 50, $line);
            $sideHeight = (int) ($photoHeight * 0.68);
            $sideY = $photoTop + (int) (($photoHeight - $sideHeight) / 2);
            $this->drawContained($canvas, $side, $contentX + $mainWidth + $gap, $sideY, $sideWidth, $sideHeight);
        } elseif ($main instanceof GdImage) {
            $mainWidth = (int) ($contentW * 0.72);
            $this->drawContained(
                $canvas,
                $main,
                $contentX + (int) (($contentW - $mainWidth) / 2),
                $photoTop,
                $mainWidth,
                $photoHeight,
            );
        }

        $y = $photoTop + ($main instanceof GdImage ? $photoHeight + 56 : 24);
        $detailsWidth = (int) ($contentW * 0.62);
        $dividerX = $contentX + (int) ($contentW * 0.68);
        $priceX = $dividerX + 28;
        $priceWidth = $contentX + $contentW - $priceX;

        $detailRows = [];
        foreach ($sheet['details'] as $detail) {
            $labelLines = $this->wrap(mb_strtoupper((string) $detail['title']), $regular, 14, (int) ($detailsWidth * 0.58));
            $valueLines = $this->wrap((string) ($detail['subtitle'] ?? ''), $regular, 14, (int) ($detailsWidth * 0.38));
            if ($labelLines === []) {
                $labelLines = [mb_strtoupper((string) $detail['title'])];
            }
            $detailRows[] = [
                'label' => $labelLines,
                'value' => $valueLines,
                'height' => max(count($labelLines), count($valueLines), 1) * 24 + 14,
            ];
        }

        $detailsHeight = 28 + array_sum(array_column($detailRows, 'height'));
        if ($sheet['price']) {
            imageline($canvas, $dividerX, $y + 8, $dividerX, $y + max($detailsHeight, 90), $line);
            $priceBlock = 58;
            $priceTop = $y + (int) ((max($detailsHeight, 90) - $priceBlock) / 2);
            $this->drawTracked($canvas, 'PRICE', $regular, 14, $priceX + (int) ($priceWidth / 2), $priceTop + 16, $ink, 2.2);
            $this->drawPriceAmount($canvas, (string) $sheet['price'], $regular, 26, $priceX, $priceTop + 52, $ink, $priceWidth);
        }

        if ($detailRows !== []) {
            $headingWidth = $this->trackedWidth('PRODUCT DETAILS', $regular, 13, 1.8);
            $this->drawTracked($canvas, 'PRODUCT DETAILS', $regular, 13, $contentX + (int) ($headingWidth / 2), $y + 16, $ink, 1.8);
            $rowY = $y + 36;

            foreach ($detailRows as $index => $row) {
                if ($index > 0) {
                    imageline($canvas, $contentX, $rowY, $contentX + $detailsWidth, $rowY, $line);
                }

                $labelY = $rowY + 8;
                foreach ($row['label'] as $labelLine) {
                    $this->drawText($canvas, $labelLine, $regular, 14, $contentX, $labelY + 14, $ink, 'left', (int) ($detailsWidth * 0.58));
                    $labelY += 24;
                }

                $valueY = $rowY + 8;
                $valueX = $contentX + $detailsWidth - (int) ($detailsWidth * 0.4);
                foreach ($row['value'] as $valueLine) {
                    $this->drawText($canvas, $valueLine, $regular, 14, $valueX, $valueY + 14, $muted, 'right', (int) ($detailsWidth * 0.4));
                    $valueY += 24;
                }

                $rowY += $row['height'];
            }
        }
    }

    /**
     * @return array{width: int, height: int}
     */
    private function logoBox(GdImage $logo): array
    {
        $sourceWidth = max(1, imagesx($logo));
        $sourceHeight = max(1, imagesy($logo));
        $height = 128;
        $width = (int) round($sourceWidth * ($height / $sourceHeight));

        if ($width > 240) {
            $width = 240;
            $height = (int) round($sourceHeight * ($width / $sourceWidth));
        }

        return ['width' => max(1, $width), 'height' => max(1, $height)];
    }

    private function drawContained(GdImage $canvas, GdImage $source, int $x, int $y, int $boxWidth, int $boxHeight): void
    {
        $sourceWidth = max(1, imagesx($source));
        $sourceHeight = max(1, imagesy($source));
        $scale = min($boxWidth / $sourceWidth, $boxHeight / $sourceHeight);
        $width = max(1, (int) round($sourceWidth * $scale));
        $height = max(1, (int) round($sourceHeight * $scale));
        $dx = $x + (int) (($boxWidth - $width) / 2);
        $dy = $y + (int) (($boxHeight - $height) / 2);

        imagecopyresampled($canvas, $source, $dx, $dy, 0, 0, $width, $height, $sourceWidth, $sourceHeight);
    }

    private function drawTracked(
        GdImage $canvas,
        string $text,
        string $font,
        float $size,
        int $centerX,
        int $baseline,
        int $color,
        float $tracking,
    ): void {
        $chars = preg_split('//u', $text, -1, PREG_SPLIT_NO_EMPTY) ?: [];
        $widths = [];
        $total = 0;

        foreach ($chars as $index => $char) {
            $charWidth = $this->textWidth($char === ' ' ? ' ' : $char, $font, $size);
            $widths[] = $charWidth;
            $total += $charWidth;

            if ($index < count($chars) - 1) {
                $total += $tracking;
            }
        }

        $x = $centerX - (int) ($total / 2);

        foreach ($chars as $index => $char) {
            if ($char !== ' ') {
                imagettftext($canvas, $size, 0, (int) $x, $baseline, $color, $font, $char);
            }

            $x += $widths[$index] + $tracking;
        }
    }

    private function trackedWidth(string $text, string $font, float $size, float $tracking): float
    {
        $chars = preg_split('//u', $text, -1, PREG_SPLIT_NO_EMPTY) ?: [];
        $total = 0;

        foreach ($chars as $char) {
            $total += $this->textWidth($char, $font, $size);
        }

        return $total + max(0, count($chars) - 1) * $tracking;
    }

    private function drawText(
        GdImage $canvas,
        string $text,
        string $font,
        float $size,
        int $x,
        int $baseline,
        int $color,
        string $align,
        int $boxWidth,
    ): void {
        $textWidth = $this->textWidth($text, $font, $size);
        $drawX = match ($align) {
            'center' => $x + (int) (($boxWidth - $textWidth) / 2),
            'right' => $x + $boxWidth - $textWidth,
            default => $x,
        };

        imagettftext($canvas, $size, 0, $drawX, $baseline, $color, $font, $text);
    }

    private function drawPriceAmount(
        GdImage $canvas,
        string $text,
        string $font,
        float $size,
        int $x,
        int $baseline,
        int $color,
        int $boxWidth,
    ): void {
        if (! str_starts_with($text, '₹')) {
            $this->drawText($canvas, $text, $font, $size, $x, $baseline, $color, 'center', $boxWidth);

            return;
        }

        $amount = ltrim(substr($text, strlen('₹')));
        $symbolFont = $this->dejavu();
        $gap = (int) round($size * 0.28);
        $symbolWidth = $this->textWidth('₹', $symbolFont, $size);
        $amountWidth = $this->textWidth($amount, $font, $size);
        $drawX = $x + (int) (($boxWidth - ($symbolWidth + $gap + $amountWidth)) / 2);

        imagettftext($canvas, $size, 0, $drawX, $baseline, $color, $symbolFont, '₹');
        imagettftext($canvas, $size, 0, $drawX + $symbolWidth + $gap, $baseline, $color, $font, $amount);
    }

    /**
     * @return list<string>
     */
    private function wrap(string $text, string $font, float $size, int $maxWidth): array
    {
        $text = trim((string) preg_replace('/\s+/', ' ', $text));

        if ($text === '') {
            return [];
        }

        $lines = [];
        $current = '';

        foreach (explode(' ', $text) as $word) {
            $candidate = $current === '' ? $word : $current.' '.$word;

            if ($this->textWidth($candidate, $font, $size) <= $maxWidth || $current === '') {
                $current = $candidate;

                continue;
            }

            $lines[] = $current;
            $current = $word;
        }

        if ($current !== '') {
            $lines[] = $current;
        }

        return $lines;
    }

    private function textWidth(string $text, string $font, float $size): int
    {
        $box = imagettfbbox($size, 0, $font, $text === '' ? ' ' : $text);

        if ($box === false) {
            return 0;
        }

        return (int) abs($box[2] - $box[0]);
    }

    private function ensureFontDirectory(): void
    {
        $directory = storage_path('fonts');

        if (! is_dir($directory)) {
            mkdir($directory, 0755, true);
        }
    }

    private function font(bool $bold): string
    {
        return resource_path('fonts/BodoniModa-Regular.ttf');
    }

    private function dejavu(): string
    {
        return base_path('vendor/dompdf/dompdf/lib/fonts/DejaVuSans.ttf');
    }
}
