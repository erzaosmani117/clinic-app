<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Appointment;
use App\Models\Drug;
use App\Models\DrugCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function stats()
    {
        return response()->json([
            'users' => [
                'total' => User::count(),
                'patients' => User::where('role', 'patient')->count(),
                'doctors' => User::where('role', 'doctor')->count(),
                'admins' => User::where('role', 'admin')->count(),
            ],
            'appointments' => [
                'total' => Appointment::count(),
                'pending' => Appointment::where('status', 'pending')->count(),
                'confirmed' => Appointment::where('status', 'confirmed')->count(),
                'cancelled' => Appointment::where('status', 'cancelled')->count(),
            ],
            'drugs' => [
                'categories' => DrugCategory::count(),
                'drugs' => Drug::count(),
            ],
        ]);
    }

    public function users()
    {
        $users = User::select('id', 'name', 'email', 'role', 'specialty', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($users);
    }

    public function addDoctor(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'specialty' => 'nullable|string|max:255',
            'bio' => 'nullable|string|max:2000',
        ]);

        $doctor = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => 'doctor',
            'specialty' => $data['specialty'] ?? null,
            'bio' => $data['bio'] ?? null,
        ]);

        return response()->json([
            'message' => 'Doctor created successfully.',
            'user' => $doctor,
        ], 201);
    }

    public function deleteUser($id)
    {
        $user = User::findOrFail($id);

        if ($user->role === 'admin') {
            return response()->json([
                'message' => 'Admin users cannot be deleted via this endpoint.',
            ], 403);
        }

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully.',
        ]);
    }

    public function appointments(Request $request)
    {
        $query = Appointment::with([
            'patient:id,name,email',
            'doctor:id,name,email',
        ])->orderBy('date', 'desc');

        if ($request->has('status')) {
            $request->validate([
                'status' => 'in:pending,confirmed,cancelled',
            ]);
            $query->where('status', $request->status);
        }

        return response()->json($query->get());
    }

    public function drugCategories()
    {
        $categories = DrugCategory::withCount('drugs')
            ->orderBy('name')
            ->get();

        return response()->json($categories);
    }

    public function addDrug(Request $request)
    {
        $data = $request->validate([
            'category_id' => 'required|exists:drug_categories,id',
            'name' => 'required|string|max:255',
            'dose_per_kg' => 'required|numeric|min:0',
            'max_single_dose' => 'required|numeric|min:0',
            'min_age_months' => 'nullable|integer|min:0|max:216',
            'contraindications' => 'nullable|string|max:5000',
            'contraindication_severity' => 'nullable|in:low,moderate,high',
        ]);

        $drug = Drug::create($data);

        return response()->json([
            'message' => 'Drug created successfully.',
            'drug' => $drug,
        ], 201);
    }

    public function deleteDrug($id)
    {
        $drug = Drug::findOrFail($id);
        $drug->delete();

        return response()->json([
            'message' => 'Drug deleted successfully.',
        ]);
    }
}