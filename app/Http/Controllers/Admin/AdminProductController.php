<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Http\Requests\Admin\UpdateProductRequest;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductDetail;
use App\Models\ProductImage;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Product::with(['categories', 'images', 'usersWithAccess'])
            ->withCount(['images', 'details', 'usersWithAccess']);

        // Search functionality
        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'like', "%{$searchTerm}%")
                  ->orWhere('slug', 'like', "%{$searchTerm}%")
                  ->orWhere('sku', 'like', "%{$searchTerm}%")
                  ->orWhere('short_description', 'like', "%{$searchTerm}%")
                  ->orWhere('long_description', 'like', "%{$searchTerm}%");
            });
        }

        // Filter by category
        if ($request->filled('category')) {
            $query->whereHas('categories', function ($q) use ($request) {
                $q->where('categories.id', $request->category);
            });
        }

        // Filter by price range
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        $products = $query->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        // Get categories for filter dropdown
        $categories = Category::active()
            ->whereHas('products')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => [
                'search' => $request->search,
                'category' => $request->category,
                'min_price' => $request->min_price,
                'max_price' => $request->max_price,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::active()
            ->orderBy('name')
            ->get();

        $users = User::with('roles')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Products/Create', [
            'categories' => $categories,
            'users' => $users,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        try {
            DB::beginTransaction();

            $product = Product::create([
                'title' => $request->title,
                'slug' => $request->slug ?: Str::slug($request->title),
                'short_description' => $request->short_description,
                'long_description' => $request->long_description,
                'sku' => $request->sku,
                'currency' => $request->currency ?: 'INR',
                'price' => $request->price,
            ]);

            // Attach categories
            if ($request->filled('categories')) {
                $categoryPositions = [];
                foreach ($request->categories as $index => $categoryId) {
                    $categoryPositions[$categoryId] = ['position' => $index + 1];
                }
                $product->categories()->sync($categoryPositions);
            }

            // Grant access to users
            if ($request->filled('user_access')) {
                $product->usersWithAccess()->sync($request->user_access);
            }

            DB::commit();

            return redirect()->route('admin.products.index')
                ->with('success', 'Product created successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            
            return back()->withInput()
                ->with('error', 'Failed to create product: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $product->load([
            'categories',
            'images',
            'details',
            'usersWithAccess.roles'
        ]);

        return Inertia::render('Admin/Products/Show', [
            'product' => $product,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        $product->load(['categories', 'images', 'details', 'usersWithAccess']);

        $categories = Category::active()
            ->orderBy('name')
            ->get();

        $users = User::with('roles')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Products/Edit', [
            'product' => $product,
            'categories' => $categories,
            'users' => $users,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        try {
            DB::beginTransaction();

            $product->update([
                'title' => $request->title,
                'slug' => $request->slug ?: Str::slug($request->title),
                'short_description' => $request->short_description,
                'long_description' => $request->long_description,
                'sku' => $request->sku,
                'currency' => $request->currency,
                'price' => $request->price,
            ]);

            // Update categories
            if ($request->filled('categories')) {
                $categoryPositions = [];
                foreach ($request->categories as $index => $categoryId) {
                    $categoryPositions[$categoryId] = ['position' => $index + 1];
                }
                $product->categories()->sync($categoryPositions);
            }

            // Update user access
            $product->usersWithAccess()->sync($request->user_access ?: []);

            DB::commit();

            return redirect()->route('admin.products.index')
                ->with('success', 'Product updated successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            
            return back()->withInput()
                ->with('error', 'Failed to update product: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        try {
            DB::beginTransaction();

            // Check if product has images
            if ($product->images()->count() > 0) {
                return back()->with('error', 'Cannot delete product with images. Please remove images first.');
            }

            // Check if product has details
            if ($product->details()->count() > 0) {
                return back()->with('error', 'Cannot delete product with details. Please remove details first.');
            }

            $product->delete();

            DB::commit();

            return redirect()->route('admin.products.index')
                ->with('success', 'Product deleted successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            
            return back()->with('error', 'Failed to delete product: ' . $e->getMessage());
        }
    }

    /**
     * Manage product images.
     */
    public function manageImages(Product $product)
    {
        $product->load('images');

        return Inertia::render('Admin/Products/ManageImages', [
            'product' => $product,
        ]);
    }

    /**
     * Store product image.
     */
    public function storeImage(Request $request, Product $product)
    {
        $request->validate([
            'src' => 'required|string|max:255',
            'is_primary' => 'boolean',
            'position' => 'integer|min:0',
        ]);

        try {
            $isPrimary = $request->boolean('is_primary', false);

            // If this is set as primary, unset other primary images
            if ($isPrimary) {
                $product->images()->update(['is_primary' => false]);
            }

            ProductImage::create([
                'product_id' => $product->id,
                'src' => $request->src,
                'is_primary' => $isPrimary,
                'position' => $request->position ?: $product->images()->max('position') + 1,
            ]);

            return back()->with('success', 'Image added successfully.');

        } catch (\Exception $e) {
            return back()->with('error', 'Failed to add image: ' . $e->getMessage());
        }
    }

    /**
     * Delete product image.
     */
    public function deleteImage(Product $product, ProductImage $image)
    {
        try {
            $image->delete();

            return back()->with('success', 'Image deleted successfully.');

        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete image: ' . $e->getMessage());
        }
    }

    /**
     * Set primary image.
     */
    public function setPrimaryImage(Product $product, ProductImage $image)
    {
        try {
            // Unset other primary images
            $product->images()->update(['is_primary' => false]);

            // Set this image as primary
            $image->update(['is_primary' => true]);

            return back()->with('success', 'Primary image updated successfully.');

        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update primary image: ' . $e->getMessage());
        }
    }
}
