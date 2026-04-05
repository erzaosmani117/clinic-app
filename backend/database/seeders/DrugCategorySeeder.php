<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DrugCategory;

class DrugCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Antibiotics',       'icon' => 'antibiotics'],
            ['name' => 'Respiratory',        'icon' => 'respiratory'],
            ['name' => 'Fever & Pain',       'icon' => 'fever'],
            ['name' => 'Gastrointestinal',   'icon' => 'gastro'],
            ['name' => 'Ear & Eye',          'icon' => 'ear_eye'],
            ['name' => 'Vitamins',           'icon' => 'vitamins'],
        ];

        foreach ($categories as $category) {
            DrugCategory::create($category);
        }
    }
}