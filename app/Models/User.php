<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the roles for the user.
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class)->withTimestamps();
    }

    /**
     * Check if the user has a specific role.
     */
    public function hasRole(string $role): bool
    {
        return $this->roles()->where('slug', $role)->exists();
    }

    /**
     * Check if the user has any of the given roles.
     */
    public function hasAnyRole(array $roles): bool
    {
        return $this->roles()->whereIn('slug', $roles)->exists();
    }

    /**
     * Check if the user has all of the given roles.
     */
    public function hasAllRoles(array $roles): bool
    {
        $userRoles = $this->roles()->pluck('slug')->toArray();
        return count(array_intersect($roles, $userRoles)) === count($roles);
    }

    /**
     * Check if the user has a specific permission (through any of their roles).
     */
    public function hasPermission(string $permission): bool
    {
        return $this->roles()->get()->some(function ($role) use ($permission) {
            return $role->hasPermission($permission);
        });
    }

    /**
     * Assign a role to the user.
     */
    public function assignRole(string $role): void
    {
        $roleModel = Role::findBySlug($role);
        
        if ($roleModel && !$this->hasRole($role)) {
            $this->roles()->attach($roleModel->id);
        }
    }

    /**
     * Remove a role from the user.
     */
    public function removeRole(string $role): void
    {
        $roleModel = Role::findBySlug($role);
        
        if ($roleModel) {
            $this->roles()->detach($roleModel->id);
        }
    }

    /**
     * Sync roles for the user (replace all roles).
     */
    public function syncRoles(array $roles): void
    {
        $roleIds = Role::whereIn('slug', $roles)->pluck('id')->toArray();
        $this->roles()->sync($roleIds);
    }

    /**
     * Check if user is admin.
     */
    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    /**
     * Check if user is manager.
     */
    public function isManager(): bool
    {
        return $this->hasRole('manager');
    }

    /**
     * Check if user is regular user.
     */
    public function isUser(): bool
    {
        return $this->hasRole('user');
    }

    /**
     * Get all permissions for the user (from all roles).
     */
    public function getAllPermissions(): array
    {
        $permissions = [];
        
        foreach ($this->roles as $role) {
            if ($role->permissions) {
                $permissions = array_merge($permissions, $role->permissions);
            }
        }
        
        return array_unique($permissions);
    }

    /**
     * Get products the user has access to.
     */
    public function accessibleProducts()
    {
        return $this->belongsToMany(Product::class, 'user_products')->withTimestamps();
    }

    /**
     * Check if user has access to a specific product.
     */
    public function hasProductAccess($product): bool
    {
        if (is_numeric($product)) {
            return $this->accessibleProducts()->where('product_id', $product)->exists();
        }
        
        if ($product instanceof Product) {
            return $this->accessibleProducts()->where('product_id', $product->id)->exists();
        }
        
        return false;
    }

    /**
     * Grant access to a product.
     */
    public function grantProductAccess($product): void
    {
        if ($product instanceof Product) {
            $this->accessibleProducts()->syncWithoutDetaching([$product->id]);
        } elseif (is_numeric($product)) {
            $this->accessibleProducts()->syncWithoutDetaching([$product]);
        }
    }

    /**
     * Revoke access to a product.
     */
    public function revokeProductAccess($product): void
    {
        if ($product instanceof Product) {
            $this->accessibleProducts()->detach($product->id);
        } elseif (is_numeric($product)) {
            $this->accessibleProducts()->detach($product);
        }
    }
}
