<?php

use App\Models\Role;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

test('authenticated users without admin or manager role cannot visit the admin dashboard', function () {
    $this->actingAs(User::factory()->create());

    $this->get(route('dashboard'))->assertForbidden();
});

test('authenticated admin or manager can visit the dashboard', function () {
    $role = Role::query()->firstOrCreate(
        ['slug' => 'admin'],
        [
            'name' => 'Admin',
            'description' => null,
            'permissions' => null,
            'is_active' => true,
        ],
    );

    $user = User::factory()->create();
    $user->roles()->attach($role);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Dashboard')
            ->has('stats')
            ->has('recent_products')
            ->has('top_categories')
            ->has('recent_members')
            ->has('products_needing_images'));
});
