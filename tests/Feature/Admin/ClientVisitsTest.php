<?php

use App\Enums\BuyingIntent;
use App\Models\Category;
use App\Models\ClientVisit;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function (): void {
    $this->seed(\Database\Seeders\RoleSeeder::class);

    $this->admin = User::factory()->create(['is_active' => true]);
    $this->admin->assignRole('admin');

    $this->manager = User::factory()->create(['is_active' => true]);
    $this->manager->assignRole('manager');

    $this->member = User::factory()->create(['is_active' => true]);
    $this->member->assignRole('user');
});

function visitPayload(array $overrides = []): array
{
    return array_merge([
        'client_name' => 'Anjali Mehta',
        'client_phone' => '+91 98200 00000',
        'client_email' => 'anjali@example.com',
        'visit_date' => '2026-10-12',
        'attended_by' => 'Rohan',
        'source' => 'referral',
        'source_details' => 'Referred by Mrs. Shah',
        'purpose' => 'occasion',
        'occasion_details' => 'Wedding, Feb 2027',
        'buying_intent' => 'serious',
        'product_preference' => 'both',
        'budget' => 'Rs. 10-20 lakh',
        'summary' => 'Loved the emerald pieces.',
        'next_steps' => 'Send estimate.',
        'follow_up_date' => '2026-10-20',
        'follow_up_by' => 'Rohan',
        'items' => [],
    ], $overrides);
}

function makeProduct(string $sku, string $title, ?Category $category = null): Product
{
    $product = Product::create([
        'title' => $title,
        'sku' => $sku,
        'currency' => 'INR',
        'price' => 150000,
    ]);

    if ($category) {
        $product->categories()->attach($category->id, ['position' => 0]);
    }

    return $product;
}

test('admin and manager can access client visits', function (): void {
    foreach ([$this->admin, $this->manager] as $user) {
        $this->actingAs($user)
            ->get(route('client-visits.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/ClientVisits/Index')
                ->has('visits.data')
                ->has('options.sources', 8));

        $this->actingAs($user)
            ->get(route('client-visits.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/ClientVisits/Create')
                ->where('defaults.attended_by', $user->name));
    }
});

test('members and guests cannot access client visits', function (): void {
    $this->actingAs($this->member)->get(route('client-visits.index'))->assertForbidden();
    $this->actingAs($this->member)->post(route('client-visits.store'), visitPayload())->assertForbidden();
    $this->actingAs($this->member)->getJson(route('client-visits.product-search', ['q' => 'ring']))->assertForbidden();

    auth()->logout();
    $this->get(route('client-visits.index'))->assertRedirect(route('login'));
});

test('staff can record a visit with catalogue and manual pieces', function (): void {
    $product = makeProduct('KJ-RING-01', 'Emerald Ring');

    $response = $this->actingAs($this->manager)->post(route('client-visits.store'), visitPayload([
        'items' => [
            ['product_id' => $product->id, 'stock_code' => null, 'notes' => 'Size 12'],
            ['product_id' => null, 'stock_code' => ' TAG-778 ', 'notes' => null],
        ],
    ]));

    $visit = ClientVisit::first();
    $response->assertRedirect(route('client-visits.show', $visit));

    expect($visit->client_name)->toBe('Anjali Mehta')
        ->and($visit->buying_intent)->toBe(BuyingIntent::Serious)
        ->and($visit->created_by)->toBe($this->manager->id)
        ->and($visit->items)->toHaveCount(2);

    expect($visit->items[0]->product_id)->toBe($product->id)
        ->and($visit->items[0]->stock_code)->toBe('KJ-RING-01')
        ->and($visit->items[0]->notes)->toBe('Size 12')
        ->and($visit->items[1]->product_id)->toBeNull()
        ->and($visit->items[1]->stock_code)->toBe('TAG-778');
});

test('validation rejects invalid choices and empty pieces', function (): void {
    $this->actingAs($this->admin)
        ->post(route('client-visits.store'), visitPayload([
            'client_name' => '',
            'source' => 'carrier-pigeon',
            'buying_intent' => 'maybe',
            'items' => [['product_id' => null, 'stock_code' => '', 'notes' => null]],
        ]))
        ->assertSessionHasErrors(['client_name', 'source', 'buying_intent', 'items.0.stock_code']);

    expect(ClientVisit::count())->toBe(0);
});

test('updating a visit replaces its pieces', function (): void {
    $first = makeProduct('KJ-001', 'Pearl Necklace');
    $second = makeProduct('KJ-002', 'Diamond Bangle');

    $this->actingAs($this->admin)->post(route('client-visits.store'), visitPayload([
        'items' => [['product_id' => $first->id]],
    ]));
    $visit = ClientVisit::first();

    $this->actingAs($this->admin)
        ->put(route('client-visits.update', $visit), visitPayload([
            'buying_intent' => 'exploring',
            'items' => [
                ['product_id' => $second->id],
                ['stock_code' => 'MANUAL-1'],
            ],
        ]))
        ->assertRedirect(route('client-visits.show', $visit));

    $visit->refresh()->load('items');
    expect($visit->buying_intent)->toBe(BuyingIntent::Exploring)
        ->and($visit->items->pluck('product_id')->all())->toBe([$second->id, null])
        ->and($visit->items->pluck('stock_code')->all())->toBe(['KJ-002', 'MANUAL-1']);
});

test('admin can delete a visit', function (): void {
    $this->actingAs($this->admin)->post(route('client-visits.store'), visitPayload());
    $visit = ClientVisit::first();

    $this->actingAs($this->admin)
        ->delete(route('client-visits.destroy', $visit))
        ->assertRedirect(route('client-visits.index'));

    $this->assertSoftDeleted('client_visits', ['id' => $visit->id]);
});

test('product search matches sku, title and category', function (): void {
    $necklaces = Category::create(['name' => 'Necklaces', 'slug' => 'necklaces', 'is_active' => true]);
    makeProduct('KJ-EMR-100', 'Emerald Drop Earrings');
    makeProduct('KJ-PRL-200', 'Pearl Choker', $necklaces);
    makeProduct('KJ-DIA-300', 'Solitaire Ring');

    $search = fn (string $q) => $this->actingAs($this->admin)
        ->getJson(route('client-visits.product-search', ['q' => $q]))
        ->assertOk()
        ->json('data');

    expect(collect($search('EMR-100'))->pluck('sku')->all())->toBe(['KJ-EMR-100'])
        ->and(collect($search('solitaire'))->pluck('sku')->all())->toBe(['KJ-DIA-300'])
        ->and(collect($search('necklace'))->pluck('sku')->all())->toBe(['KJ-PRL-200'])
        ->and($search(''))->toBe([]);

    expect($search('necklace')[0])->toHaveKeys(['id', 'sku', 'title', 'image', 'categories', 'price']);
});

test('manual pieces can store, keep, and remove an uploaded image', function (): void {
    $file = UploadedFile::fake()->image('bangle.jpg', 40, 40);

    $this->actingAs($this->admin)->post(route('client-visits.store'), visitPayload([
        'items' => [
            ['product_id' => null, 'stock_code' => 'TAG-IMG', 'notes' => null, 'image' => $file],
        ],
    ]))->assertRedirect();

    $visit = ClientVisit::first();
    $image = $visit->items->first()->image;
    $path = public_path(ltrim((string) $image, '/'));

    expect($image)->toStartWith('/media/uploads/client-visits/')
        ->and(is_file($path))->toBeTrue();

    $this->actingAs($this->admin)->put(route('client-visits.update', $visit), visitPayload([
        'items' => [
            ['stock_code' => 'TAG-IMG', 'existing_image' => $image, 'remove_image' => 0],
        ],
    ]))->assertRedirect();

    $visit->refresh()->load('items');
    expect($visit->items->first()->image)->toBe($image)
        ->and(is_file($path))->toBeTrue();

    $this->actingAs($this->admin)->put(route('client-visits.update', $visit), visitPayload([
        'items' => [
            ['stock_code' => 'TAG-IMG', 'remove_image' => 1],
        ],
    ]))->assertRedirect();

    $visit->refresh()->load('items');
    expect($visit->items->first()->image)->toBeNull()
        ->and(is_file($path))->toBeFalse();
});

test('visit can be exported as pdf', function (): void {
    $product = makeProduct('KJ-PDF-01', 'Ruby Pendant');
    $this->actingAs($this->admin)->post(route('client-visits.store'), visitPayload([
        'items' => [['product_id' => $product->id], ['stock_code' => 'TAG-9']],
    ]));
    $visit = ClientVisit::first();

    $response = $this->actingAs($this->admin)->get(route('client-visits.pdf', $visit));

    $response->assertOk();
    expect($response->headers->get('content-type'))->toContain('application/pdf')
        ->and($response->headers->get('content-disposition'))->toContain('client-visit-'.$visit->id.'-anjali-mehta-2026-10-12.pdf')
        ->and(substr($response->getContent(), 0, 4))->toBe('%PDF');
});

test('dashboard includes client visit widgets', function (): void {
    $this->actingAs($this->admin)->post(route('client-visits.store'), visitPayload([
        'follow_up_date' => now()->subDay()->toDateString(),
    ]));

    $this->actingAs($this->admin)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('stats.follow_ups_due', 1)
            ->has('recent_visits', 1)
            ->has('follow_ups_due', 1));
});
