<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Beverages', 'description' => 'Soft drinks, coffees, teas, beers, and ales'],
            ['name' => 'Alcohol', 'description' => 'Wines, beers, spirits, and other alcoholic beverages'],
            ['name' => 'Coffee', 'description' => 'Coffees from around the world, including dark roast, medium roast, and light roast'],
            ['name' => 'Tea', 'description' => 'Teas from around the world, including green tea, black tea, and herbal teas'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
