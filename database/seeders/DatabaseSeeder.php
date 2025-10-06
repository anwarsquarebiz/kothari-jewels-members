<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed roles first
        $this->call([
            RoleSeeder::class,
            ProductSeeder::class,
        ]);

        // Delete any existing users (handle foreign key constraints)
        User::query()->delete();

        // Create the 3 required users
        $users = [
            [
                'name' => 'Admin User',
                'email' => 'admin@kotharifinejewels.com',
                'role' => 'admin',
            ],
            [
                'name' => 'Manager User',
                'email' => 'manager@kotharifinejewels.com',
                'role' => 'manager',
            ],
            [
                'name' => 'Regular User',
                'email' => 'user@kotharifinejewels.com',
                'role' => 'user',
            ],
        ];

        foreach ($users as $userData) {
            $user = User::create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]);

            // Assign the appropriate role
            $user->assignRole($userData['role']);
        }

        $this->command->info('Users created successfully!');
        $this->command->info('Admin: admin@kotharifinejewels.com');
        $this->command->info('Manager: manager@kotharifinejewels.com');
        $this->command->info('User: user@kotharifinejewels.com');
        $this->command->info('Password for all users: password');
    }
}
