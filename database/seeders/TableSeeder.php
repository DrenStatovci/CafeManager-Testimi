<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Table;

class TableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for($i =1 ; $i <= 15; $i++){
            Table::create([
                'number' => $i,
                'status' => 'free'
            ]);
        }
    }
}
