<?php

use App\Models\User;
use Illuminate\Support\Facades\Route;

Route::get('/', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

Route::prefix('admin')->middleware(['auth', 'verified', 'role:admin,manager'])->group(function () {
    Route::get('dashboard', App\Http\Controllers\Admin\AdminDashboardController::class)->name('dashboard');

    Route::patch('users/{user}/password', [App\Http\Controllers\Admin\AdminUserController::class, 'updatePassword'])->name('users.password.update');
    Route::patch('users/{user}/product-access', [App\Http\Controllers\Admin\AdminUserController::class, 'syncProductAccess'])->name('users.product-access.update');
    Route::resource('users', App\Http\Controllers\Admin\AdminUserController::class)->except(['edit', 'destroy']);

    // Categories CRUD
    Route::resource('categories', App\Http\Controllers\Admin\AdminCategoryController::class);
    Route::patch('categories/{category}/toggle-status', [App\Http\Controllers\Admin\AdminCategoryController::class, 'toggleStatus'])->name('admin.categories.toggle-status');

    // Landing Page Showcase curation (Rail & Jewellery page)
    Route::get('landing-showcase', [App\Http\Controllers\Admin\AdminLandingShowcaseController::class, 'index'])->name('admin.landing-showcase.index');
    Route::post('landing-showcase/rail', [App\Http\Controllers\Admin\AdminLandingShowcaseController::class, 'updateRail'])->name('admin.landing-showcase.rail.update');
    Route::post('landing-showcase/jewellery', [App\Http\Controllers\Admin\AdminLandingShowcaseController::class, 'updateJewellery'])->name('admin.landing-showcase.jewellery.update');
    Route::post('landing-showcase/products/{product}/toggle-rail', [App\Http\Controllers\Admin\AdminLandingShowcaseController::class, 'toggleRail'])->name('admin.landing-showcase.toggle-rail');
    Route::post('landing-showcase/products/{product}/toggle-jewellery', [App\Http\Controllers\Admin\AdminLandingShowcaseController::class, 'toggleJewellery'])->name('admin.landing-showcase.toggle-jewellery');
    Route::patch('landing-showcase/products/{product}', [App\Http\Controllers\Admin\AdminLandingShowcaseController::class, 'updateProductSettings'])->name('admin.landing-showcase.product.update');

    // Products bulk import/export (before resource so "import" is not a product id)
    Route::get('products/import', [App\Http\Controllers\Admin\AdminProductImportController::class, 'create'])->name('admin.products.import');
    Route::post('products/import', [App\Http\Controllers\Admin\AdminProductImportController::class, 'store'])->name('admin.products.import.store');
    Route::get('products/import/template', [App\Http\Controllers\Admin\AdminProductImportController::class, 'template'])->name('admin.products.import.template');
    Route::get('products/export', [App\Http\Controllers\Admin\AdminProductImportController::class, 'export'])->name('admin.products.export');
    Route::post('products/share-export', App\Http\Controllers\Admin\ProductShareExportController::class)->name('admin.products.share-export');

    // Products CRUD
    Route::resource('products', App\Http\Controllers\Admin\AdminProductController::class)->names('admin.products');
    Route::get('products/{product}/images', [App\Http\Controllers\Admin\AdminProductController::class, 'manageImages'])->name('admin.products.images');
    Route::post('products/{product}/images', [App\Http\Controllers\Admin\AdminProductController::class, 'storeImage'])->name('admin.products.images.store');
    Route::delete('products/{product}/images/{image}', [App\Http\Controllers\Admin\AdminProductController::class, 'deleteImage'])->name('admin.products.images.delete');
    Route::patch('products/{product}/images/{image}/primary', [App\Http\Controllers\Admin\AdminProductController::class, 'setPrimaryImage'])->name('admin.products.images.primary');
    Route::patch('products/{product}/images/{image}/tag', [App\Http\Controllers\Admin\AdminProductController::class, 'updateImageTag'])->name('admin.products.images.tag');

    Route::get('products/{product}/details', [App\Http\Controllers\Admin\AdminProductController::class, 'manageDetails'])->name('admin.products.details');
    Route::post('products/{product}/details', [App\Http\Controllers\Admin\AdminProductController::class, 'storeDetail'])->name('admin.products.details.store');
    Route::put('products/{product}/details/{detail}', [App\Http\Controllers\Admin\AdminProductController::class, 'updateDetail'])->name('admin.products.details.update');
    Route::delete('products/{product}/details/{detail}', [App\Http\Controllers\Admin\AdminProductController::class, 'deleteDetail'])->name('admin.products.details.delete');

    // Client visit summaries (in-store leads)
    Route::get('client-visits/product-search', [App\Http\Controllers\Admin\AdminClientVisitController::class, 'productSearch'])->name('client-visits.product-search');
    Route::get('client-visits/{client_visit}/pdf', [App\Http\Controllers\Admin\AdminClientVisitController::class, 'pdf'])->name('client-visits.pdf');
    Route::resource('client-visits', App\Http\Controllers\Admin\AdminClientVisitController::class);
});

// E-commerce routes for all authenticated users
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/products', [App\Http\Controllers\ProductsController::class, 'index'])->name('products.index');
    Route::get('/products/{categorySlug}/{productSlug}', [App\Http\Controllers\ProductsController::class, 'show'])->name('products.show');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
