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
    // Stats overview
    public function stats()
    {
        return response()->json([
            'total_patients'     => User::where('role', 'patient')->count(),
            'total_doctors'      => User::where('role', 'doctor')->count(),
            'total_appointments' => Appointment::count(),
            'pending_appointments' => Appointment::where('status', 'pending')->count(),
            'total_drugs'        => Drug::count(),
        ]);
    }

    // Get all users
    public function users(Request $request)
    {
        $role = $request->query('role');
        $query = User::select('id', 'name', 'email', 'role', 'specialty', 'created_at');

        if ($role) {
            $query->where('role', $role);
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    // Add new doctor
    public function addDoctor(Request $request)
    {
        $request->validate([
            'name'      => 'required|string|max:255',
            'email'     => 'required|email|unique:users',
            'password'  => 'required|string|min:6',
            'specialty' => 'required|string|max:255',
            'bio'       => 'nullable|string',
        ]);

        $doctor = User::create([
            'name'      => $request->name,
            'email'     => $request->email,
            'password'  => Hash::make($request->password),
            'role'      => 'doctor',
            'specialty' => $request->specialty,
            'bio'       => $request->bio,
        ]);

        return response()->json([
            'message' => 'Doctor added successfully.',
            'doctor'  => $doctor,
        ], 201);
    }

    // Delete user
    public function deleteUser($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        if ($user->role === 'admin') {
            return response()->json(['message' => 'Cannot delete admin account.'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully.']);
    }

    // Get all appointments
    public function appointments(Request $request)
    {
        $status = $request->query('status');
        $query = Appointment::with(['patient:id,name,email', 'doctor:id,name,specialty'])
            ->orderBy('date', 'desc');

        if ($status) {
            $query->where('status', $status);
        }

        return response()->json($query->get());
    }

    // Get all drug categories
    public function drugCategories()
    {
        return response()->json(DrugCategory::withCount('drugs')->get());
    }

    // Add new drug
    public function addDrug(Request $request)
    {
        $request->validate([
            'category_id'               => 'required|exists:drug_categories,id',
            'name'                      => 'required|string|max:255',
            'dose_per_kg'               => 'required|numeric|min:0',
            'max_single_dose'           => 'required|numeric|min:0',
            'min_age_months'            => 'nullable|integer|min:0',
            'contraindications'         => 'nullable|string',
            'contraindication_severity' => 'nullable|in:low,moderate,high',
        ]);

        $drug = Drug::create($request->all());

        return response()->json([
            'message' => 'Drug added successfully.',
            'drug'    => $drug,
        ], 201);
    }

    // Delete drug
    public function deleteDrug($id)
    {
        $drug = Drug::find($id);

        if (!$drug) {
            return response()->json(['message' => 'Drug not found.'], 404);
        }

        $drug->delete();

        return response()->json(['message' => 'Drug deleted successfully.']);
    }
}