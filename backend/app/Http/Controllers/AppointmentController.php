<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    // Patient books an appointment
    public function store(Request $request)
    {
        $request->validate([
            'doctor_id' => 'required|exists:users,id',
            'date'      => 'required|date|after:today',
        ]);

        $appointment = Appointment::create([
            'patient_id' => $request->user()->id,
            'doctor_id'  => $request->doctor_id,
            'date'       => $request->date,
            'status'     => 'pending',
        ]);

        return response()->json($appointment, 201);
    }

    // Patient views their own appointments
    public function patientAppointments(Request $request)
    {
        $appointments = Appointment::where('patient_id', $request->user()->id)
            ->with('doctor:id,name,email')
            ->orderBy('date', 'asc')
            ->get();

        return response()->json($appointments);
    }

    // Doctor views their own appointments
    public function doctorAppointments(Request $request)
    {
        $appointments = Appointment::where('doctor_id', $request->user()->id)
            ->with('patient:id,name,email')
            ->orderBy('date', 'asc')
            ->get();

        return response()->json($appointments);
    }

    public function updateStatus(Request $request, $id)
{
    $request->validate([
        'status' => 'required|in:confirmed,cancelled',
    ]);

    $appointment = Appointment::where('id', $id)
        ->where('doctor_id', $request->user()->id)
        ->first();

    if (!$appointment) {
        return response()->json([
            'message' => 'Appointment not found or unauthorized.'
        ], 404);
    }

    $appointment->status = $request->status;
    $appointment->save();

    return response()->json([
        'message' => 'Appointment status updated successfully.',
        'appointment' => $appointment,
    ]);
}
}