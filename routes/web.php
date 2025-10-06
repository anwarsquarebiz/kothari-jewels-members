<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::prefix('admin')->middleware(['auth', 'verified', 'role:admin,manager'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Categories CRUD
    Route::resource('categories', App\Http\Controllers\Admin\AdminCategoryController::class);
    Route::patch('categories/{category}/toggle-status', [App\Http\Controllers\Admin\AdminCategoryController::class, 'toggleStatus'])->name('admin.categories.toggle-status');

    // Products CRUD
    Route::resource('products', App\Http\Controllers\Admin\AdminProductController::class);
    Route::get('products/{product}/images', [App\Http\Controllers\Admin\AdminProductController::class, 'manageImages'])->name('admin.products.images');
    Route::post('products/{product}/images', [App\Http\Controllers\Admin\AdminProductController::class, 'storeImage'])->name('admin.products.images.store');
    Route::delete('products/{product}/images/{image}', [App\Http\Controllers\Admin\AdminProductController::class, 'deleteImage'])->name('admin.products.images.delete');
    Route::patch('products/{product}/images/{image}/primary', [App\Http\Controllers\Admin\AdminProductController::class, 'setPrimaryImage'])->name('admin.products.images.primary');
});

// E-commerce routes for all authenticated users
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/products', [App\Http\Controllers\ProductsController::class, 'index'])->name('products.index');
    Route::get('/products/{categorySlug}/{productSlug}', [App\Http\Controllers\ProductsController::class, 'show'])->name('products.show');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
