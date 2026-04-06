<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class DoctorController extends Controller
{
    public function index()
    {
        $doctors = User::where('role', 'doctor')
            ->select('id', 'name', 'email')
            ->get();

        return response()->json($doctors);

         $specialty = $request->query('specialty');

    $query = User::where('role', 'doctor')
        ->select('id', 'name', 'email', 'specialty', 'bio');

    if ($specialty) {
        $query->where('specialty', 'like', "%{$specialty}%");
    }

    return response()->json($query->get());

    }

    public function specialties()
{
    $specialties = User::where('role', 'doctor')
        ->whereNotNull('specialty')
        ->distinct()
        ->pluck('specialty');

    return response()->json($specialties);
}
}