<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductsController extends Controller
{
    /**
     * Display a listing of products accessible to the authenticated user.
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        
        // Get products the user has access to
        $query = $user->accessibleProducts()
            ->with(['images', 'categories', 'primaryImage'])
            ->withCount('images')
            ->orderBy('created_at', 'desc');

        // Filter by category if provided
        if ($request->filled('category')) {
            $query->whereHas('categories', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        // Search functionality
        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'like', "%{$searchTerm}%")
                  ->orWhere('short_description', 'like', "%{$searchTerm}%")
                  ->orWhere('long_description', 'like', "%{$searchTerm}%");
            });
        }

        // Price range filter
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        $products = $query->paginate(12)->withQueryString();

        // Get categories for filter
        $categories = Category::active()
            ->whereHas('products', function ($q) use ($user) {
                $q->whereHas('usersWithAccess', function ($userQuery) use ($user) {
                    $userQuery->where('user_id', $user->id);
                });
            })
            ->orderBy('name')
            ->get();


        return Inertia::render('Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => [
                'category' => $request->category,
                'search' => $request->search,
                'min_price' => $request->min_price,
                'max_price' => $request->max_price,
            ],
        ]);
    }

    /**
     * Display the specified product.
     */
    public function show(Request $request, $categorySlug, $productSlug)
    {
        $user = auth()->user();

        // Find the product by slug
        $product = Product::where('slug', $productSlug)
            ->with(['images', 'categories', 'details', 'activeDetails'])
            ->firstOrFail();

        // Check if user has access to this product
        if (!$user->hasProductAccess($product)) {
            abort(403, 'You do not have access to this product.');
        }

        // Verify the category slug matches
        $category = $product->categories()
            ->where('slug', $categorySlug)
            ->firstOrFail();

        // Get related products (same category, accessible to user)
        $relatedProducts = $user->accessibleProducts()
            ->whereHas('categories', function ($q) use ($category) {
                $q->where('categories.id', $category->id);
            })
            ->where('products.id', '!=', $product->id)
            ->with(['images', 'categories'])
            ->limit(4)
            ->get();

        return Inertia::render('Products/Show', [
            'product' => $product,
            'category' => $category,
            'relatedProducts' => $relatedProducts,
        ]);
    }
}
