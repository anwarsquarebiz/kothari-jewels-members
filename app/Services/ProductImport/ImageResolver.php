<?php

namespace App\Services\ProductImport;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use RuntimeException;

class ImageResolver
{
    public const MAX_BYTES = 5_242_880;

    /**
     * @var array<string, string>
     */
    private const MIME_EXTENSIONS = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
        'image/gif' => 'gif',
    ];

    /**
     * @var array<string, string>
     */
    private array $localFiles = [];

    private string $importsDirectory;

    public function __construct()
    {
        $this->importsDirectory = public_path('media/imports');
    }

    /**
     * @param  array<string, string>  $localFiles
     */
    public function setLocalFiles(array $localFiles): void
    {
        $this->localFiles = $localFiles;
    }

    /**
     * Resolve a URL, filename, or existing public media path into a stored public path.
     *
     * @throws RuntimeException
     */
    public function resolve(string $source, int $productId, string $kind = 'products'): string
    {
        $source = trim($source);

        if ($source === '') {
            throw new RuntimeException('Image path is empty.');
        }

        if ($this->looksLikeUrl($source)) {
            return $this->storeContents(
                $this->downloadUrl($source),
                $productId,
                $kind,
                $this->extensionFromPath($source)
            );
        }

        $existing = $this->existingPublicMediaPath($source);
        if ($existing !== null) {
            return $existing;
        }

        $absolute = $this->findLocalFile($source);
        $contents = file_get_contents($absolute);

        if ($contents === false) {
            throw new RuntimeException("Could not read image file [{$source}].");
        }

        return $this->storeContents($contents, $productId, $kind, $this->extensionFromPath($absolute));
    }

    public function deleteUploadedPath(?string $path): void
    {
        if (! $path) {
            return;
        }

        $normalized = '/'.ltrim($path, '/');

        if (! str_starts_with($normalized, '/media/uploads/')) {
            return;
        }

        $fullPath = public_path(ltrim($normalized, '/'));

        if (is_file($fullPath)) {
            unlink($fullPath);
        }
    }

    private function looksLikeUrl(string $source): bool
    {
        return (bool) preg_match('#^https?://#i', $source);
    }

    private function downloadUrl(string $url): string
    {
        $parts = parse_url($url);

        if ($parts === false || empty($parts['scheme']) || empty($parts['host'])) {
            throw new RuntimeException("Invalid image URL [{$url}].");
        }

        $scheme = strtolower((string) $parts['scheme']);
        if (! in_array($scheme, ['http', 'https'], true)) {
            throw new RuntimeException("Image URL must use http or https [{$url}].");
        }

        $host = strtolower((string) $parts['host']);
        $this->assertHostIsPublic($host);

        $response = Http::timeout(20)
            ->withOptions(['allow_redirects' => false])
            ->get($url);

        if (! $response->successful()) {
            throw new RuntimeException("Could not download image from [{$url}] (HTTP {$response->status()}).");
        }

        $contents = $response->body();

        if (strlen($contents) > self::MAX_BYTES) {
            throw new RuntimeException('Downloaded image exceeds the 5MB limit.');
        }

        return $contents;
    }

    private function assertHostIsPublic(string $host): void
    {
        $blockedHosts = ['localhost', 'metadata.google.internal'];

        if (in_array($host, $blockedHosts, true) || str_ends_with($host, '.localhost')) {
            throw new RuntimeException("Image URL host is not allowed [{$host}].");
        }

        if (filter_var($host, FILTER_VALIDATE_IP) && $this->isBlockedIp($host)) {
            throw new RuntimeException("Image URL points to a private address [{$host}].");
        }

        if (app()->environment('testing') || filter_var($host, FILTER_VALIDATE_IP)) {
            return;
        }

        $ips = gethostbynamel($host) ?: [];

        if ($ips === []) {
            throw new RuntimeException("Could not resolve image URL host [{$host}].");
        }

        foreach ($ips as $ip) {
            if ($this->isBlockedIp($ip)) {
                throw new RuntimeException("Image URL resolves to a private address [{$host}].");
            }
        }
    }

    private function isBlockedIp(string $ip): bool
    {
        $flags = FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE;

        if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
            return filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4 | $flags) === false;
        }

        if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6)) {
            return filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6 | $flags) === false;
        }

        return true;
    }

    private function existingPublicMediaPath(string $source): ?string
    {
        $normalized = '/'.ltrim(str_replace('\\', '/', $source), '/');

        if (! str_starts_with($normalized, '/media/')) {
            return null;
        }

        if (str_contains($normalized, '..')) {
            return null;
        }

        $fullPath = public_path(ltrim($normalized, '/'));

        return is_file($fullPath) ? $normalized : null;
    }

    private function findLocalFile(string $source): string
    {
        $basename = basename(str_replace('\\', '/', $source));

        if ($basename === '' || $basename === '.' || $basename === '..' || str_contains($basename, '..')) {
            throw new RuntimeException("Invalid image filename [{$source}].");
        }

        $lookup = strtolower($basename);

        if (isset($this->localFiles[$lookup]) && is_file($this->localFiles[$lookup])) {
            return $this->localFiles[$lookup];
        }

        $importsPath = rtrim($this->importsDirectory, DIRECTORY_SEPARATOR).DIRECTORY_SEPARATOR.$basename;

        if (is_file($importsPath)) {
            return $importsPath;
        }

        throw new RuntimeException("Image file [{$basename}] was not found in the upload zip or media/imports folder.");
    }

    private function storeContents(string $contents, int $productId, string $kind, ?string $fallbackExtension): string
    {
        if (strlen($contents) > self::MAX_BYTES) {
            throw new RuntimeException('Image exceeds the 5MB limit.');
        }

        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->buffer($contents) ?: '';

        if (! isset(self::MIME_EXTENSIONS[$mime])) {
            throw new RuntimeException("Unsupported image type [{$mime}]. Use jpg, png, webp, or gif.");
        }

        $extension = self::MIME_EXTENSIONS[$mime];
        if ($fallbackExtension && isset(self::MIME_EXTENSIONS['image/'.$fallbackExtension])) {
            $extension = $fallbackExtension === 'jpeg' ? 'jpg' : $fallbackExtension;
        }

        $directory = "media/uploads/{$kind}/{$productId}";
        $absoluteDir = public_path($directory);

        if (! is_dir($absoluteDir) && ! mkdir($absoluteDir, 0755, true) && ! is_dir($absoluteDir)) {
            throw new RuntimeException("Could not create image directory [{$directory}].");
        }

        $filename = Str::uuid()->toString().'.'.$extension;
        $absolutePath = $absoluteDir.DIRECTORY_SEPARATOR.$filename;

        if (file_put_contents($absolutePath, $contents) === false) {
            throw new RuntimeException('Could not save image file.');
        }

        return '/'.$directory.'/'.$filename;
    }

    private function extensionFromPath(string $path): ?string
    {
        $extension = strtolower(pathinfo(parse_url($path, PHP_URL_PATH) ?: $path, PATHINFO_EXTENSION));

        return in_array($extension, ['jpg', 'jpeg', 'png', 'webp', 'gif'], true)
            ? ($extension === 'jpeg' ? 'jpg' : $extension)
            : null;
    }
}
