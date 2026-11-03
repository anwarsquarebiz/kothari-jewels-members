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
    private const WIDTH = 1600;

    private const PADDING = 56;

    private const PRICE_BREAK_UP = 'price-break-up';

    /**
     * Customer share sheets in the requested product order.
     * Gallery images tagged as a price break-up are omitted.
     *
     * @param  list<int>  $ids
     * @return list<array{title: string, images: list<string>, details: list<array{title: string, subtitle: ?string}>}>
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

            $sheets[] = [
                'title' => $product->title,
                'images' => $product->images
                    ->reject(fn (ProductImage $image): bool => $image->tag === self::PRICE_BREAK_UP)
                    ->map(fn (ProductImage $image): string => $image->src)
                    ->values()
                    ->all(),
                'details' => $product->activeDetails
                    ->map(fn (ProductDetail $detail): array => [
                        'title' => $detail->title,
                        'subtitle' => $detail->subtitle,
                    ])
                    ->values()
                    ->all(),
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
                fn (string $src): ?string => $this->dataUri($src, 900),
                $sheet['images'],
            )));

            return [
                'title' => $sheet['title'],
                'fit' => $this->fit(count($images)),
                'image_rows' => array_chunk($images, 4),
                'details' => $sheet['details'],
            ];
        }, $sheets);

        return Pdf::loadView('pdf.product-share', [
            'logo' => $this->dataUri('/media/kothari-1937-logo.png', 480),
            'products' => $products,
        ])->setPaper('a4', 'landscape');
    }

    /**
     * @param  list<int>  $ids
     */
    public function jpeg(array $ids): string
    {
        $sheets = $this->sheets($ids);
        $this->ensureSheets($sheets);

        $logo = $this->loadPublicImage('/media/kothari-1937-logo.png', 480);
        $galleries = [];

        try {
            foreach ($sheets as $index => $sheet) {
                $galleries[$index] = [];

                foreach ($sheet['images'] as $src) {
                    $image = $this->loadPublicImage($src, 900);

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

    private function fit(int $count): string
    {
        if ($count > 4 || $count === 0) {
            return 'quad';
        }

        return match ($count) {
            1 => 'single',
            2 => 'pair',
            3 => 'triple',
            default => 'quad',
        };
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

    private function loadPublicImage(string $src, int $maxSize = 1200): ?GdImage
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
        imagefill($flat, 0, 0, imagecolorallocate($flat, 255, 255, 255));
        imagecopyresampled($flat, $source, 0, 0, 0, 0, $targetWidth, $targetHeight, $width, $height);
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
     * @param  list<array{title: string, images: list<string>, details: list<array{title: string, subtitle: ?string}>}>  $sheets
     * @param  list<list<GdImage>>  $galleries
     */
    private function drawJpeg(array $sheets, array $galleries, ?GdImage $logo): string
    {
        $width = self::WIDTH;
        $pad = self::PADDING;
        $content = $width - ($pad * 2);
        $regular = $this->font(false);
        $bold = $this->font(true);
        $logoBox = $logo instanceof GdImage ? $this->logoBox($logo) : null;
        $cursor = $pad + ($logoBox === null ? 0 : $logoBox['height'] + 36);
        $layouts = [];

        foreach ($sheets as $index => $sheet) {
            $layout = $this->layoutProduct(
                $sheet,
                $galleries[$index] ?? [],
                $cursor,
                $pad,
                $content,
                $bold,
                $regular,
            );
            $layouts[] = $layout;
            $cursor = $layout['bottom'] + ($index < count($sheets) - 1 ? 36 : 0);
        }

        $canvas = imagecreatetruecolor($width, max($cursor + $pad, 200));

        try {
            $white = imagecolorallocate($canvas, 255, 255, 255);
            $ink = imagecolorallocate($canvas, 43, 41, 38);
            $muted = imagecolorallocate($canvas, 110, 103, 93);
            $line = imagecolorallocate($canvas, 217, 210, 197);
            imagefill($canvas, 0, 0, $white);

            if ($logo instanceof GdImage && $logoBox !== null) {
                imagecopyresampled(
                    $canvas,
                    $logo,
                    (int) (($width - $logoBox['width']) / 2),
                    $pad,
                    0,
                    0,
                    $logoBox['width'],
                    $logoBox['height'],
                    imagesx($logo),
                    imagesy($logo),
                );
            }

            foreach ($layouts as $index => $layout) {
                $this->paintProduct($canvas, $layout, $bold, $regular, $ink, $muted, $line, $pad, $content);

                if ($index < count($layouts) - 1) {
                    $y = $layout['bottom'] + 18;
                    imageline($canvas, $pad, $y, $width - $pad, $y, $line);
                }
            }

            ob_start();
            imagejpeg($canvas, null, 88);

            return (string) ob_get_clean();
        } finally {
            imagedestroy($canvas);
        }
    }

    /**
     * @param  array{title: string, images: list<string>, details: list<array{title: string, subtitle: ?string}>}  $sheet
     * @param  list<GdImage>  $images
     * @return array<string, mixed>
     */
    private function layoutProduct(array $sheet, array $images, int $top, int $pad, int $content, string $bold, string $regular): array
    {
        $y = $top;
        $titleLines = $this->wrap($sheet['title'], $bold, 32, $content);
        if ($titleLines === []) {
            $titleLines = [$sheet['title']];
        }
        $titleY = $y;
        $y += count($titleLines) * 44 + 20;

        $rows = [];
        foreach (array_chunk($images, 4) as $chunk) {
            $box = $this->imageBox(count($images) > 4 ? 4 : count($chunk), $content);
            $groupWidth = $box['width'] * count($chunk) + $box['gap'] * max(count($chunk) - 1, 0);
            $x = $pad + (int) (($content - $groupWidth) / 2);
            $cells = [];

            foreach ($chunk as $image) {
                $cells[] = [
                    'image' => $image,
                    'x' => $x,
                    'y' => $y,
                    'width' => $box['width'],
                    'height' => $box['height'],
                ];
                $x += $box['width'] + $box['gap'];
            }

            $rows[] = $cells;
            $y += $box['height'] + 18;
        }

        if ($rows !== []) {
            $y += 10;
        }

        $details = [];
        $headingY = null;

        if ($sheet['details'] !== []) {
            $headingY = $y;
            $y += 36;
            $labelWidth = (int) floor($content * 0.38);
            $valueWidth = $content - $labelWidth - 24;

            foreach ($sheet['details'] as $detail) {
                $labelLines = $this->wrap(mb_strtoupper((string) $detail['title']), $bold, 15, $labelWidth);
                $valueLines = $this->wrap((string) ($detail['subtitle'] ?? ''), $regular, 15, $valueWidth);
                if ($labelLines === []) {
                    $labelLines = [mb_strtoupper((string) $detail['title'])];
                }
                $lineCount = max(count($labelLines), count($valueLines), 1);
                $height = $lineCount * 24 + 16;
                $details[] = [
                    'y' => $y,
                    'label' => $labelLines,
                    'value' => $valueLines,
                    'labelWidth' => $labelWidth,
                    'valueWidth' => $valueWidth,
                ];
                $y += $height;
            }

            $y += 8;
        }

        return [
            'bottom' => $y + 12,
            'title' => $titleLines,
            'titleY' => $titleY,
            'rows' => $rows,
            'headingY' => $headingY,
            'details' => $details,
        ];
    }

    /**
     * @param  array<string, mixed>  $layout
     */
    private function paintProduct(
        GdImage $canvas,
        array $layout,
        string $bold,
        string $regular,
        int $ink,
        int $muted,
        int $line,
        int $pad,
        int $content,
    ): void {
        $y = $layout['titleY'];

        foreach ($layout['title'] as $titleLine) {
            $this->drawText($canvas, $titleLine, $bold, 32, $pad, $y + 32, $ink, 'center', $content);
            $y += 44;
        }

        foreach ($layout['rows'] as $row) {
            foreach ($row as $cell) {
                $this->drawContained(
                    $canvas,
                    $cell['image'],
                    $cell['x'] + 8,
                    $cell['y'] + 8,
                    $cell['width'] - 16,
                    $cell['height'] - 16,
                );
                imagerectangle(
                    $canvas,
                    $cell['x'],
                    $cell['y'],
                    $cell['x'] + $cell['width'],
                    $cell['y'] + $cell['height'],
                    $line,
                );
            }
        }

        if ($layout['headingY'] === null) {
            return;
        }

        $this->drawText($canvas, 'PRODUCT DETAILS', $bold, 14, $pad, $layout['headingY'] + 16, $ink, 'left', $content);

        foreach ($layout['details'] as $detail) {
            imageline($canvas, $pad, $detail['y'], $pad + $content, $detail['y'], $line);
            $labelY = $detail['y'] + 8;

            foreach ($detail['label'] as $labelLine) {
                $this->drawText($canvas, $labelLine, $bold, 15, $pad, $labelY + 15, $ink, 'left', $detail['labelWidth']);
                $labelY += 24;
            }

            $valueY = $detail['y'] + 8;
            $valueX = $pad + $content - $detail['valueWidth'];

            foreach ($detail['value'] as $valueLine) {
                $this->drawText($canvas, $valueLine, $regular, 15, $valueX, $valueY + 15, $muted, 'right', $detail['valueWidth']);
                $valueY += 24;
            }
        }
    }

    /**
     * @return array{width: int, height: int, gap: int}
     */
    private function imageBox(int $count, int $contentWidth): array
    {
        $count = max(1, min(4, $count));
        $gap = 20;
        $height = match ($count) {
            1 => 560,
            2 => 500,
            3 => 440,
            default => 380,
        };
        $width = $count === 1
            ? min(780, $contentWidth)
            : (int) floor(($contentWidth - $gap * ($count - 1)) / $count);

        return ['width' => $width, 'height' => $height, 'gap' => $gap];
    }

    /**
     * @return array{width: int, height: int}
     */
    private function logoBox(GdImage $logo): array
    {
        $sourceWidth = max(1, imagesx($logo));
        $sourceHeight = max(1, imagesy($logo));
        $height = 150;
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

    private function font(bool $bold): string
    {
        $file = $bold ? 'DejaVuSans-Bold.ttf' : 'DejaVuSans.ttf';

        return base_path('vendor/dompdf/dompdf/lib/fonts/'.$file);
    }
}
