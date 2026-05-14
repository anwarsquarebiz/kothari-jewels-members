<?php

use App\Models\Product;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    $this->seed(\Database\Seeders\RoleSeeder::class);
});

function actingAdmin(): User
{
    $admin = User::factory()->create(['is_active' => true]);
    $admin->assignRole('admin');

    return $admin;
}

test('admin can view users index', function (): void {
    $this->actingAs(actingAdmin())
        ->get(route('users.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('Admin/Users/Index'));
});

test('admin can create a member user', function (): void {
    $userRole = Role::where('slug', 'user')->firstOrFail();

    $this->actingAs(actingAdmin())
        ->post(route('users.store'), [
            'name' => 'New Member',
            'email' => 'member@example.com',
            'password' => 'Password1!',
            'password_confirmation' => 'Password1!',
            'role_ids' => [$userRole->id],
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('users', [
        'email' => 'member@example.com',
        'is_active' => true,
    ]);

    $created = User::where('email', 'member@example.com')->firstOrFail();
    expect($created->hasRole('user'))->toBeTrue();
});

test('admin can update product access for a user', function (): void {
    $admin = actingAdmin();
    $member = User::factory()->create(['is_active' => true]);
    $member->assignRole('user');

    $product = Product::create([
        'title' => 'Test Product',
        'slug' => 'test-product',
        'sku' => 'SKU-TEST-1',
        'currency' => 'INR',
        'price' => 99,
    ]);

    $this->actingAs($admin)
        ->patch(route('users.product-access.update', $member), [
            'product_ids' => [$product->id],
        ])
        ->assertRedirect();

    expect($member->fresh()->hasProductAccess($product))->toBeTrue();
});

test('manager cannot manage an admin user profile', function (): void {
    $manager = User::factory()->create(['is_active' => true]);
    $manager->assignRole('manager');

    $adminUser = User::factory()->create(['is_active' => true]);
    $adminUser->assignRole('admin');

    $userRoleId = Role::where('slug', 'user')->value('id');

    $this->actingAs($manager)
        ->patch(route('users.update', $adminUser), [
            'name' => $adminUser->name,
            'email' => $adminUser->email,
            'role_ids' => [$userRoleId],
            'is_active' => true,
        ])
        ->assertForbidden();
});

test('inactive user cannot log in', function (): void {
    $user = User::factory()->create([
        'email' => 'locked@example.com',
        'is_active' => false,
    ]);
    $user->assignRole('user');

    $this->post(route('login.store'), [
        'email' => 'locked@example.com',
        'password' => 'password',
    ])->assertSessionHasErrors('email');

    $this->assertGuest();
});
