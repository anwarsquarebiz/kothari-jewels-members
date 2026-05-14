<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAdminUserRequest;
use App\Http\Requests\Admin\SyncAdminUserProductAccessRequest;
use App\Http\Requests\Admin\UpdateAdminUserPasswordRequest;
use App\Http\Requests\Admin\UpdateAdminUserRequest;
use App\Models\Product;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        $actor = $request->user();
        $query = User::query()->with('roles')->orderBy('name');

        if ($actor->isManager() && ! $actor->isAdmin()) {
            $query->whereDoesntHave('roles', function ($q): void {
                $q->whereIn('slug', ['admin', 'manager']);
            });
        }

        if ($request->filled('search')) {
            $term = $request->string('search');
            $query->where(function ($q) use ($term): void {
                $q->where('name', 'like', "%{$term}%")
                    ->orWhere('email', 'like', "%{$term}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('is_active', $request->string('status') === 'active');
        }

        $users = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => [
                'search' => $request->string('search')->toString(),
                'status' => $request->string('status')->toString(),
            ],
            'actor_is_admin' => $actor->isAdmin(),
        ]);
    }

    public function create(Request $request)
    {
        $roleOptions = Role::query()
            ->where('is_active', true)
            ->when(! $request->user()->isAdmin(), fn ($q) => $q->where('slug', 'user'))
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        return Inertia::render('Admin/Users/Create', [
            'roleOptions' => $roleOptions,
        ]);
    }

    public function store(StoreAdminUserRequest $request)
    {
        try {
            DB::beginTransaction();

            $user = User::create([
                'name' => $request->validated('name'),
                'email' => $request->validated('email'),
                'password' => Hash::make($request->validated('password')),
                'is_active' => true,
                'email_verified_at' => now(),
            ]);

            $user->roles()->sync($request->validated('role_ids'));

            DB::commit();

            return redirect()->route('users.show', $user)
                ->with('success', 'User created successfully.');
        } catch (\Throwable $e) {
            DB::rollBack();

            return back()->withInput()->with('error', 'Could not create user: '.$e->getMessage());
        }
    }

    public function show(Request $request, User $user)
    {
        $this->assertCanManage($request->user(), $user);

        $user->load('roles');

        $productQuery = Product::query()
            ->with(['categories:id,name'])
            ->select(['id', 'title', 'slug', 'sku', 'currency', 'price'])
            ->orderBy('title');

        if ($request->filled('product_search')) {
            $term = $request->string('product_search');
            $productQuery->where(function ($q) use ($term): void {
                $q->where('title', 'like', "%{$term}%")
                    ->orWhere('sku', 'like', "%{$term}%")
                    ->orWhere('slug', 'like', "%{$term}%");
            });
        }

        $products = $productQuery->paginate(20)->withQueryString();

        $products->getCollection()->transform(function (Product $product) {
            return [
                'id' => $product->id,
                'title' => $product->title,
                'slug' => $product->slug,
                'sku' => $product->sku,
                'formatted_price' => $product->formatted_price,
                'categories' => $product->categories,
            ];
        });

        $roleOptions = Role::query()
            ->where('is_active', true)
            ->when(! $request->user()->isAdmin(), fn ($q) => $q->where('slug', 'user'))
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        $accessibleProductIds = $user->accessibleProducts()->pluck('id')->values();

        return Inertia::render('Admin/Users/Show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_active' => $user->is_active,
                'email_verified_at' => $user->email_verified_at?->toIso8601String(),
                'created_at' => $user->created_at?->toIso8601String(),
                'updated_at' => $user->updated_at?->toIso8601String(),
                'roles' => $user->roles,
            ],
            'roleOptions' => $roleOptions,
            'products' => $products,
            'accessible_product_ids' => $accessibleProductIds,
            'product_filters' => [
                'search' => $request->string('product_search')->toString(),
            ],
            'actor_is_admin' => $request->user()->isAdmin(),
            'is_self' => $request->user()->id === $user->id,
        ]);
    }

    public function update(UpdateAdminUserRequest $request, User $user)
    {
        $this->assertCanManage($request->user(), $user);

        try {
            DB::beginTransaction();

            $user->update([
                'name' => $request->validated('name'),
                'email' => $request->validated('email'),
                'is_active' => $request->boolean('is_active'),
            ]);

            $user->roles()->sync($request->validated('role_ids'));

            DB::commit();

            return redirect()->route('users.show', $user)
                ->with('success', 'User updated successfully.');
        } catch (\Throwable $e) {
            DB::rollBack();

            return back()->withInput()->with('error', 'Could not update user: '.$e->getMessage());
        }
    }

    public function updatePassword(UpdateAdminUserPasswordRequest $request, User $user)
    {
        $this->assertCanManage($request->user(), $user);

        try {
            $user->update([
                'password' => Hash::make($request->validated('password')),
            ]);

            return back()->with('success', 'Password updated successfully.');
        } catch (\Throwable $e) {
            return back()->with('error', 'Could not update password: '.$e->getMessage());
        }
    }

    public function syncProductAccess(SyncAdminUserProductAccessRequest $request, User $user)
    {
        $this->assertCanManage($request->user(), $user);

        try {
            $user->accessibleProducts()->sync($request->validated('product_ids'));

            return back()->with('success', 'Product access updated successfully.');
        } catch (\Throwable $e) {
            return back()->with('error', 'Could not update product access: '.$e->getMessage());
        }
    }

    private function assertCanManage(User $actor, User $target): void
    {
        if ($actor->isManager() && ! $actor->isAdmin()) {
            $targetIsStaff = $target->roles()->whereIn('slug', ['admin', 'manager'])->exists();
            if ($targetIsStaff) {
                abort(403, 'You do not have permission to manage this account.');
            }
        }
    }
}
