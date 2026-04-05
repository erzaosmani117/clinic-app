<?php

namespace App\Http\Controllers;

use App\Models\DrugCategory;
use App\Models\Drug;

class DrugController extends Controller
{
    public function categories()
    {
        $categories = DrugCategory::all();
        return response()->json($categories);
    }

    public function drugsByCategory($categoryId)
    {
        $category = DrugCategory::with('drugs')->findOrFail($categoryId);
        return response()->json($category);
    }

    public function show($drugId)
    {
        $drug = Drug::with('category')->findOrFail($drugId);
        return response()->json($drug);
    }
}