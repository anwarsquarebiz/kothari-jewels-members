<?php

namespace App\Http\Controllers\Admin;

use App\Enums\BuyingIntent;
use App\Enums\ProductPreference;
use App\Enums\VisitPurpose;
use App\Enums\VisitSource;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ClientVisitRequest;
use App\Models\Category;
use App\Models\ClientVisit;
use App\Models\ClientVisitItem;
use App\Models\Product;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminClientVisitController extends Controller
{
    public function index(Request $request)
    {
        $query = ClientVisit::query()->withCount('items');

        if ($request->filled('search')) {
            $term = $request->string('search')->toString();
            $query->where(function ($q) use ($term) {
                $q->where('client_name', 'like', "%{$term}%")
                    ->orWhere('client_phone', 'like', "%{$term}%")
                    ->orWhere('client_email', 'like', "%{$term}%")
                    ->orWhere('attended_by', 'like', "%{$term}%");
            });
        }

        if ($request->filled('date_from')) {
            $query->whereDate('visit_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('visit_date', '<=', $request->date_to);
        }
        if ($request->filled('source')) {
            $query->where('source', $request->source);
        }
        if ($request->filled('buying_intent')) {
            $query->where('buying_intent', $request->buying_intent);
        }
        if ($request->input('follow_up') === 'due') {
            $query->followUpDue();
        } elseif ($request->input('follow_up') === 'upcoming') {
            $query->followUpUpcoming();
        }

        $visits = $query->orderByDesc('visit_date')
            ->orderByDesc('id')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (ClientVisit $visit) => [
                'id' => $visit->id,
                'client_name' => $visit->client_name,
                'client_phone' => $visit->client_phone,
                'visit_date' => $visit->visit_date?->toDateString(),
                'attended_by' => $visit->attended_by,
                'source' => $visit->source?->value,
                'source_label' => $visit->source?->label(),
                'buying_intent' => $visit->buying_intent?->value,
                'buying_intent_label' => $visit->buying_intent?->label(),
                'budget' => $visit->budget,
                'follow_up_date' => $visit->follow_up_date?->toDateString(),
                'follow_up_by' => $visit->follow_up_by,
                'items_count' => $visit->items_count,
            ]);

        return Inertia::render('Admin/ClientVisits/Index', [
            'visits' => $visits,
            'filters' => $request->only(['search', 'date_from', 'date_to', 'source', 'buying_intent', 'follow_up']),
            'options' => $this->options(),
            'stats' => [
                'total' => ClientVisit::count(),
                'this_month' => ClientVisit::query()
                    ->whereDate('visit_date', '>=', now()->startOfMonth()->toDateString())
                    ->count(),
                'serious' => ClientVisit::query()->where('buying_intent', BuyingIntent::Serious)->count(),
                'follow_ups_due' => ClientVisit::query()->followUpDue()->count(),
            ],
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('Admin/ClientVisits/Create', [
            'options' => $this->options(),
            'defaults' => [
                'attended_by' => $request->user()->name,
                'visit_date' => now()->toDateString(),
            ],
        ]);
    }

    public function store(ClientVisitRequest $request)
    {
        $visit = DB::transaction(function () use ($request) {
            $visit = ClientVisit::create([
                ...$request->safe()->except('items'),
                'created_by' => $request->user()->id,
            ]);
            $this->syncItems($visit, $request->validated('items') ?? []);

            return $visit;
        });

        return redirect()->route('client-visits.show', $visit)
            ->with('success', 'Client visit recorded successfully.');
    }

    public function show(ClientVisit $clientVisit)
    {
        return Inertia::render('Admin/ClientVisits/Show', [
            'visit' => $this->serializeVisit($clientVisit),
        ]);
    }

    public function edit(ClientVisit $clientVisit)
    {
        return Inertia::render('Admin/ClientVisits/Edit', [
            'visit' => $this->serializeVisit($clientVisit),
            'options' => $this->options(),
        ]);
    }

    public function update(ClientVisitRequest $request, ClientVisit $clientVisit)
    {
        DB::transaction(function () use ($request, $clientVisit) {
            $clientVisit->update($request->safe()->except('items'));
            $this->syncItems($clientVisit, $request->validated('items') ?? []);
        });

        return redirect()->route('client-visits.show', $clientVisit)
            ->with('success', 'Client visit updated successfully.');
    }

    public function destroy(ClientVisit $clientVisit)
    {
        $clientVisit->delete();

        return redirect()->route('client-visits.index')
            ->with('success', 'Client visit deleted successfully.');
    }

    public function productSearch(Request $request): JsonResponse
    {
        $term = trim($request->string('q')->toString());

        if ($term === '') {
            return response()->json(['data' => []]);
        }

        $products = Product::query()
            ->with(['images', 'categories'])
            ->where(function ($q) use ($term) {
                $q->where('sku', 'like', "%{$term}%")
                    ->orWhere('title', 'like', "%{$term}%")
                    ->orWhereHas('categories', fn ($c) => $c->where('name', 'like', "%{$term}%"));
            })
            ->orderByRaw('CASE WHEN sku = ? THEN 0 WHEN sku LIKE ? THEN 1 ELSE 2 END', [$term, "{$term}%"])
            ->orderBy('title')
            ->limit(20)
            ->get()
            ->map(fn (Product $product) => $this->serializeProduct($product));

        return response()->json(['data' => $products]);
    }

    public function pdf(Request $request, ClientVisit $clientVisit)
    {
        $clientVisit->load(['items.product.images', 'items.product.categories', 'creator']);

        $items = $clientVisit->items->map(function (ClientVisitItem $item) {
            $product = $item->product;
            $image = $product ? $this->primaryImageSrc($product) : null;

            return [
                'sku' => $product?->sku ?? $item->stock_code,
                'title' => $product?->title,
                'categories' => $product?->categories->pluck('name')->implode(', '),
                'price' => $product ? $this->formatInr($product->price) : null,
                'notes' => $item->notes,
                'image' => $image ? $this->localImageDataUri($image, 240) : null,
            ];
        });

        $pdf = Pdf::loadView('pdf.client-visit', [
            'visit' => $clientVisit,
            'items' => $items,
            'logo' => $this->localImageDataUri('/media/kothari-1937-logo.png'),
            'options' => $this->options(),
        ])->setPaper('a4');

        $filename = sprintf(
            'client-visit-%d-%s-%s.pdf',
            $clientVisit->id,
            Str::slug($clientVisit->client_name) ?: 'client',
            $clientVisit->visit_date?->format('Y-m-d') ?? 'undated',
        );

        return $request->boolean('inline') ? $pdf->stream($filename) : $pdf->download($filename);
    }

    /**
     * @param  array<int, array<string, mixed>>  $items
     */
    private function syncItems(ClientVisit $visit, array $items): void
    {
        $visit->items()->delete();

        $skus = Product::query()
            ->whereIn('id', array_filter(array_column($items, 'product_id')))
            ->pluck('sku', 'id');

        foreach (array_values($items) as $position => $item) {
            $productId = $item['product_id'] ?? null;
            $stockCode = $productId
                ? $skus[$productId] ?? null
                : (filled($item['stock_code'] ?? null) ? trim($item['stock_code']) : null);

            $visit->items()->create([
                'product_id' => $productId,
                'stock_code' => $stockCode,
                'notes' => $item['notes'] ?? null,
                'position' => $position,
            ]);
        }
    }

    /**
     * @return array<string, mixed>
     */
    private function serializeVisit(ClientVisit $visit): array
    {
        $visit->loadMissing(['items.product.images', 'items.product.categories', 'creator']);

        return [
            'id' => $visit->id,
            'client_name' => $visit->client_name,
            'client_phone' => $visit->client_phone,
            'client_email' => $visit->client_email,
            'visit_date' => $visit->visit_date?->toDateString(),
            'attended_by' => $visit->attended_by,
            'source' => $visit->source?->value,
            'source_label' => $visit->source?->label(),
            'source_details' => $visit->source_details,
            'purpose' => $visit->purpose?->value,
            'purpose_label' => $visit->purpose?->label(),
            'occasion_details' => $visit->occasion_details,
            'buying_intent' => $visit->buying_intent?->value,
            'buying_intent_label' => $visit->buying_intent?->label(),
            'product_preference' => $visit->product_preference?->value,
            'product_preference_label' => $visit->product_preference?->label(),
            'budget' => $visit->budget,
            'summary' => $visit->summary,
            'next_steps' => $visit->next_steps,
            'follow_up_date' => $visit->follow_up_date?->toDateString(),
            'follow_up_by' => $visit->follow_up_by,
            'created_by' => $visit->creator?->name,
            'created_at' => $visit->created_at?->toIso8601String(),
            'updated_at' => $visit->updated_at?->toIso8601String(),
            'items' => $visit->items->map(fn (ClientVisitItem $item) => [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'stock_code' => $item->stock_code,
                'notes' => $item->notes,
                'product' => $item->product ? $this->serializeProduct($item->product) : null,
            ])->values(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function serializeProduct(Product $product): array
    {
        return [
            'id' => $product->id,
            'sku' => $product->sku,
            'title' => $product->title,
            'image' => $this->primaryImageSrc($product),
            'categories' => $product->categories->map(fn (Category $c) => [
                'id' => $c->id,
                'name' => $c->name,
            ])->values(),
            'price' => $this->formatInr($product->price),
        ];
    }

    private function primaryImageSrc(Product $product): ?string
    {
        $images = $product->images;

        return ($images->firstWhere('is_primary', true) ?? $images->first())?->src;
    }

    private function formatInr(mixed $amount): ?string
    {
        if ($amount === null) {
            return null;
        }

        return 'Rs. '.number_format((float) $amount, 0);
    }

    /**
     * Inline local images as downscaled JPEG data URIs. dompdf decodes alpha PNGs pixel by
     * pixel, which exhausts memory on large logos and product photos.
     */
    private function localImageDataUri(string $src, int $maxSize = 360): ?string
    {
        if (Str::startsWith($src, ['http://', 'https://', 'data:'])) {
            return null;
        }

        $path = public_path(ltrim($src, '/'));
        if (! is_file($path)) {
            return null;
        }

        $source = match (mime_content_type($path)) {
            'image/png' => @imagecreatefrompng($path),
            'image/jpeg' => @imagecreatefromjpeg($path),
            'image/gif' => @imagecreatefromgif($path),
            'image/webp' => function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($path) : false,
            default => false,
        };

        if (! $source) {
            return null;
        }

        $width = imagesx($source);
        $height = imagesy($source);
        $scale = min(1, $maxSize / max($width, $height));
        $targetWidth = max(1, (int) round($width * $scale));
        $targetHeight = max(1, (int) round($height * $scale));

        $canvas = imagecreatetruecolor($targetWidth, $targetHeight);
        imagefill($canvas, 0, 0, imagecolorallocate($canvas, 255, 255, 255));
        imagecopyresampled($canvas, $source, 0, 0, 0, 0, $targetWidth, $targetHeight, $width, $height);

        ob_start();
        imagejpeg($canvas, null, 88);
        $jpeg = (string) ob_get_clean();

        imagedestroy($source);
        imagedestroy($canvas);

        return 'data:image/jpeg;base64,'.base64_encode($jpeg);
    }

    /**
     * @return array<string, array<int, array{value: string, label: string}>>
     */
    private function options(): array
    {
        return [
            'sources' => VisitSource::options(),
            'purposes' => VisitPurpose::options(),
            'buying_intents' => BuyingIntent::options(),
            'product_preferences' => ProductPreference::options(),
        ];
    }
}
