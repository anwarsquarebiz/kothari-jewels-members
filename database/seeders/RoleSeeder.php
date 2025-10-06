<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Admin',
                'slug' => 'admin',
                'description' => 'Full system access with all permissions',
                'permissions' => [
                    'users.create',
                    'users.read',
                    'users.update',
                    'users.delete',
                    'products.create',
                    'products.read',
                    'products.update',
                    'products.delete',
                    'categories.create',
                    'categories.read',
                    'categories.update',
                    'categories.delete',
                    'roles.create',
                    'roles.read',
                    'roles.update',
                    'roles.delete',
                    'system.settings',
                    'system.reports',
                    'system.backup',
                ],
                'is_active' => true,
            ],
            [
                'name' => 'Manager',
                'slug' => 'manager',
                'description' => 'Manage products and categories with limited user access',
                'permissions' => [
                    'users.read',
                    'products.create',
                    'products.read',
                    'products.update',
                    'products.delete',
                    'categories.create',
                    'categories.read',
                    'categories.update',
                    'categories.delete',
                    'system.reports',
                ],
                'is_active' => true,
            ],
            [
                'name' => 'User',
                'slug' => 'user',
                'description' => 'Basic user access to view products and categories',
                'permissions' => [
                    'products.read',
                    'categories.read',
                ],
                'is_active' => true,
            ],
        ];

        foreach ($roles as $roleData) {
            Role::updateOrCreate(
                ['slug' => $roleData['slug']],
                $roleData
            );
        }

        $this->command->info('Roles seeded successfully!');
    }
}
