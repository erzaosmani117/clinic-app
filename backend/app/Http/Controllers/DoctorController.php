<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Appointment;
use App\Models\DoctorSchedule;
use Carbon\Carbon;  // PHP library that Laravel uses for working with dates and times. It extends PHP's built-in DateTime class and makes date operations much easier.
use Illuminate\Http\Request;

class DoctorController extends Controller
{
    public function index(Request $request)
{
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


public function availableSlots(Request $request, $id)
{
    $date      = $request->query('date');
    $dayOfWeek = Carbon::parse($date)->dayOfWeekIso;

    $schedule = DoctorSchedule::where('doctor_id', $id)
                    ->where('day_of_week', $dayOfWeek)
                    ->first();

    if (!$schedule) {
        return response()->json(['slots' => []]);
    }

    $slots  = [];
    $cursor = Carbon::parse($schedule->start_time);
    $end    = Carbon::parse($schedule->end_time);

    while ($cursor < $end) {
        $slots[] = $cursor->format('H:i');
        $cursor->addMinutes($schedule->slot_minutes);
    }

    $booked = Appointment::where('doctor_id', $id)
                ->where('date', $date)
                ->pluck('time')
                ->map(fn($t) => substr($t, 0, 5))
                ->toArray();

    $available = array_values(array_diff($slots, $booked));

    return response()->json(['slots' => $available]);
}
}