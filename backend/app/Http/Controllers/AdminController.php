<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Appointment;
use App\Models\Drug;
use App\Models\DrugCategory;
use App\Models\UserNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

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
        // Optional filters for admin UI (safe additive change)
        // - role: patient|doctor|admin
        // - q: search by name/email
        $usersQuery = User::query()
            ->select('id', 'name', 'email', 'role', 'specialty', 'created_at')
            ->orderBy('created_at', 'desc');

        $role = request()->query('role');
        if ($role) {
            request()->validate([
                'role' => 'in:patient,doctor,admin',
            ]);
            $usersQuery->where('role', $role);
        }

        $q = trim((string) request()->query('q', ''));
        if ($q !== '') {
            $usersQuery->where(function ($sub) use ($q) {
                $sub->where('name', 'like', "%{$q}%")
                    ->orWhere('email', 'like', "%{$q}%");
            });
        }

        $users = $usersQuery->get();

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

        if ($request->filled('doctor_id')) {
            $request->validate([
                'doctor_id' => [
                    'integer',
                    Rule::exists('users', 'id')->where(fn ($q) => $q->where('role', 'doctor')),
                ],
            ]);
            $query->where('doctor_id', (int) $request->doctor_id);
        }

        if ($request->filled('date_from') || $request->filled('date_to')) {
            $request->validate([
                'date_from' => 'nullable|date',
                'date_to' => 'nullable|date|after_or_equal:date_from',
            ]);
            if ($request->filled('date_from')) {
                $query->whereDate('date', '>=', $request->date_from);
            }
            if ($request->filled('date_to')) {
                $query->whereDate('date', '<=', $request->date_to);
            }
        }

        $search = trim((string) $request->query('q', ''));
        if ($search !== '') {
            $query->where(function ($sub) use ($search) {
                $sub->whereHas('patient', function ($p) use ($search) {
                    $p->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                })->orWhereHas('doctor', function ($d) use ($search) {
                    $d->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            });
        }

        return response()->json($query->get());
    }

    public function updateAppointment(Request $request, $id)
    {
        $data = $request->validate([
            'status' => 'sometimes|in:pending,confirmed,cancelled',
            'date' => 'sometimes|date|after_or_equal:today',
            'doctor_id' => [
                'sometimes',
                'integer',
                Rule::exists('users', 'id')->where(fn ($q) => $q->where('role', 'doctor')),
            ],
        ]);

        if (empty($data)) {
            return response()->json([
                'message' => 'No changes provided.',
            ], 422);
        }

        $appointment = Appointment::with([
            'patient:id,name,email',
            'doctor:id,name,email',
        ])->findOrFail($id);

        $oldDoctorId = (int) $appointment->doctor_id;
        $oldDoctorName = $appointment->doctor?->name;
        $oldDate = $appointment->date;
        $oldStatus = $appointment->status;

        $appointment->fill($data);

        if (!$appointment->isDirty()) {
            return response()->json([
                'message' => 'No changes detected.',
            ], 422);
        }

        $appointment->save();

        // Refresh relations in case doctor_id changed
        $appointment->load([
            'patient:id,name,email',
            'doctor:id,name,email',
        ]);

        $dateChanged = array_key_exists('date', $data) && $oldDate !== $appointment->date;
        $doctorChanged = array_key_exists('doctor_id', $data) && $oldDoctorId !== (int) $appointment->doctor_id;
        $statusChanged = array_key_exists('status', $data) && $oldStatus !== $appointment->status;

        if ($dateChanged || $doctorChanged || $statusChanged) {
            $this->createAppointmentChangeNotifications(
                $appointment,
                $oldDoctorId,
                $oldDoctorName,
                $oldDate,
                $oldStatus,
                $dateChanged,
                $doctorChanged,
                $statusChanged
            );
        }

        return response()->json([
            'message' => 'Appointment updated successfully.',
            'appointment' => $appointment,
        ]);
    }

    private function createAppointmentChangeNotifications(
        Appointment $appointment,
        int $oldDoctorId,
        ?string $oldDoctorName,
        ?string $oldDate,
        string $oldStatus,
        bool $dateChanged,
        bool $doctorChanged,
        bool $statusChanged
    ): void {
        $patientId = $appointment->patient_id;
        $newDoctorId = (int) $appointment->doctor_id;
        $newDoctorName = $appointment->doctor?->name;
        $patientName = $appointment->patient?->name ?? 'the patient';
        $oldDateLabel = $oldDate ?: 'the previous date';
        $newDateLabel = $appointment->date ?: 'the updated date';

        $patientParts = [];
        if ($doctorChanged) {
            $patientParts[] = "doctor changed from Dr. {$oldDoctorName} to Dr. {$newDoctorName}";
        }
        if ($dateChanged) {
            $patientParts[] = "date changed from {$oldDateLabel} to {$newDateLabel}";
        }
        if ($statusChanged) {
            $patientParts[] = "status changed from {$oldStatus} to {$appointment->status}";
        }

        UserNotification::create([
            'user_id' => $patientId,
            'title' => 'Appointment updated',
            'message' => 'Your appointment was updated: ' . implode('; ', $patientParts) . '.',
            'type' => 'appointment_update',
            'data' => [
                'appointment_id' => $appointment->id,
                'doctor_changed' => $doctorChanged,
                'date_changed' => $dateChanged,
                'status_changed' => $statusChanged,
            ],
        ]);

        if ($doctorChanged && $oldDoctorId > 0 && $oldDoctorId !== $newDoctorId) {
            UserNotification::create([
                'user_id' => $oldDoctorId,
                'title' => 'Appointment reassigned',
                'message' => "Appointment with {$patientName} on {$newDateLabel} was reassigned to Dr. {$newDoctorName}.",
                'type' => 'appointment_reassigned_from',
                'data' => [
                    'appointment_id' => $appointment->id,
                    'patient_id' => $patientId,
                    'new_doctor_id' => $newDoctorId,
                ],
            ]);
        }

        $newDoctorParts = [];
        if ($doctorChanged) {
            $newDoctorParts[] = "assigned to you from Dr. {$oldDoctorName}";
        }
        if ($dateChanged) {
            $newDoctorParts[] = "date changed from {$oldDateLabel} to {$newDateLabel}";
        }
        if ($statusChanged) {
            $newDoctorParts[] = "status changed from {$oldStatus} to {$appointment->status}";
        }

        UserNotification::create([
            'user_id' => $newDoctorId,
            'title' => 'Appointment updated',
            'message' => "Appointment with {$patientName} was updated: " . implode('; ', $newDoctorParts) . '.',
            'type' => $doctorChanged ? 'appointment_assigned' : 'appointment_update',
            'data' => [
                'appointment_id' => $appointment->id,
                'patient_id' => $patientId,
                'doctor_changed' => $doctorChanged,
                'date_changed' => $dateChanged,
                'status_changed' => $statusChanged,
            ],
        ]);
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