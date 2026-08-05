<?php

use Illuminate\Support\Facades\Route;

Route::get('/', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
Route::get('/about', [App\Http\Controllers\AboutController::class, 'index'])->name('about');
Route::get('/contact', [App\Http\Controllers\ContactController::class, 'index'])->name('contact');
Route::post('/contact', [App\Http\Controllers\ContactController::class, 'store'])->name('contact.store');

Route::prefix('admin')->middleware(['auth', 'verified', 'role:admin,manager'])->group(function () {
    Route::get('dashboard', App\Http\Controllers\Admin\AdminDashboardController::class)->name('dashboard');

    Route::patch('users/{user}/password', [App\Http\Controllers\Admin\AdminUserController::class, 'updatePassword'])->name('users.password.update');
    Route::patch('users/{user}/product-access', [App\Http\Controllers\Admin\AdminUserController::class, 'syncProductAccess'])->name('users.product-access.update');
    Route::resource('users', App\Http\Controllers\Admin\AdminUserController::class)->except(['edit', 'destroy']);

    // Categories CRUD
    Route::resource('categories', App\Http\Controllers\Admin\AdminCategoryController::class);
    Route::patch('categories/{category}/toggle-status', [App\Http\Controllers\Admin\AdminCategoryController::class, 'toggleStatus'])->name('admin.categories.toggle-status');

    // Products CRUD
    Route::resource('products', App\Http\Controllers\Admin\AdminProductController::class);
    Route::get('products/{product}/images', [App\Http\Controllers\Admin\AdminProductController::class, 'manageImages'])->name('admin.products.images');
    Route::post('products/{product}/images', [App\Http\Controllers\Admin\AdminProductController::class, 'storeImage'])->name('admin.products.images.store');
    Route::delete('products/{product}/images/{image}', [App\Http\Controllers\Admin\AdminProductController::class, 'deleteImage'])->name('admin.products.images.delete');
    Route::patch('products/{product}/images/{image}/primary', [App\Http\Controllers\Admin\AdminProductController::class, 'setPrimaryImage'])->name('admin.products.images.primary');

    Route::get('products/{product}/details', [App\Http\Controllers\Admin\AdminProductController::class, 'manageDetails'])->name('admin.products.details');
    Route::post('products/{product}/details', [App\Http\Controllers\Admin\AdminProductController::class, 'storeDetail'])->name('admin.products.details.store');
    Route::put('products/{product}/details/{detail}', [App\Http\Controllers\Admin\AdminProductController::class, 'updateDetail'])->name('admin.products.details.update');
    Route::delete('products/{product}/details/{detail}', [App\Http\Controllers\Admin\AdminProductController::class, 'deleteDetail'])->name('admin.products.details.delete');
});

// E-commerce routes for all authenticated users
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/products', [App\Http\Controllers\ProductsController::class, 'index'])->name('products.index');
    Route::get('/products/{categorySlug}/{productSlug}', [App\Http\Controllers\ProductsController::class, 'show'])->name('products.show');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
