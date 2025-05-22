<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        User::create([
            'name'=> 'Dren Statovci',
            'phone_number'=> '049743873',
            'email'=> 'dren@gmail.com',
            'password'=> bcrypt('12345678'),
            'role'=> 'admin'
        ]);

        $this->call([
            CategorySeeder::class,
            TableSeeder::class
        ]);
    }
}
