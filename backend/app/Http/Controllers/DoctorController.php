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
    }
}