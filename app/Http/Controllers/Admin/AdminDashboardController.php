<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    /**
     * Admin overview: catalog counts, member snapshot, and items needing attention.
     */
    public function __invoke()
    {
        $productsCount = Product::count();
        $categoriesCount = Category::count();
        $activeCategoriesCount = Category::query()->where('is_active', true)->count();
        $inactiveCategoriesCount = Category::query()->where('is_active', false)->count();

        $membersBase = User::query()->whereHas('roles', fn ($q) => $q->where('slug', 'user'));
        $membersCount = (clone $membersBase)->count();
        $membersPendingVerification = (clone $membersBase)->whereNull('email_verified_at')->count();

        $productAccessAssignments = DB::table('user_products')->count();
        $productsWithoutImages = Product::query()->whereDoesntHave('images')->count();

        $recentProducts = Product::query()
            ->with(['categories' => fn ($q) => $q->orderByPivot('position')])
            ->withCount('images')
            ->latest()
            ->limit(6)
            ->get()
            ->map(fn (Product $product) => [
                'id' => $product->id,
                'title' => $product->title,
                'slug' => $product->slug,
                'sku' => $product->sku,
                'formatted_price' => $product->formatted_price,
                'images_count' => $product->images_count,
                'categories' => $product->categories->take(3)->map(fn (Category $c) => [
                    'id' => $c->id,
                    'name' => $c->name,
                    'slug' => $c->slug,
                ])->values(),
                'created_at' => $product->created_at?->toIso8601String(),
            ]);

        $topCategories = Category::query()
            ->withCount('products')
            ->orderByDesc('products_count')
            ->orderBy('name')
            ->limit(8)
            ->get(['id', 'name', 'slug', 'is_active'])
            ->map(fn (Category $category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'is_active' => $category->is_active,
                'products_count' => $category->products_count,
            ]);

        $recentMembers = User::query()
            ->whereHas('roles', fn ($q) => $q->where('slug', 'user'))
            ->latest()
            ->limit(5)
            ->get(['id', 'name', 'email', 'email_verified_at', 'created_at'])
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at?->toIso8601String(),
                'created_at' => $user->created_at?->toIso8601String(),
            ]);

        $productsNeedingImages = Product::query()
            ->whereDoesntHave('images')
            ->latest()
            ->limit(6)
            ->get(['id', 'title', 'slug', 'sku'])
            ->map(fn (Product $product) => [
                'id' => $product->id,
                'title' => $product->title,
                'slug' => $product->slug,
                'sku' => $product->sku,
            ]);

        $staffCount = User::query()
            ->whereHas('roles', fn ($q) => $q->whereIn('slug', ['admin', 'manager']))
            ->count();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'products' => $productsCount,
                'categories' => $categoriesCount,
                'active_categories' => $activeCategoriesCount,
                'inactive_categories' => $inactiveCategoriesCount,
                'members' => $membersCount,
                'members_pending_verification' => $membersPendingVerification,
                'staff_admin_or_manager' => $staffCount,
                'product_access_assignments' => $productAccessAssignments,
                'products_without_images' => $productsWithoutImages,
            ],
            'recent_products' => $recentProducts,
            'top_categories' => $topCategories,
            'recent_members' => $recentMembers,
            'products_needing_images' => $productsNeedingImages,
        ]);
    }
}
