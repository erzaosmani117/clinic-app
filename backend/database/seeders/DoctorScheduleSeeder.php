<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DoctorSchedule;

class DoctorScheduleSeeder extends Seeder
{
  public function run(): void
{
    $workdays = [1, 2, 3, 4, 5]; // E hënë deri e premte

    // Merr të gjithë doktorët
    $doctors = \App\Models\User::where('role', 'doctor')->get();

    foreach ($doctors as $doctor) {
        foreach ($workdays as $day) {
            DoctorSchedule::create([
                'doctor_id'    => $doctor->id,
                'day_of_week'  => $day,
                'start_time'   => '08:00',
                'end_time'     => '17:00',
                'slot_minutes' => 30,
            ]);
        }
    }
}
    
}