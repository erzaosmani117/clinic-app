<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AppointmentBookingAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    private function makeUser(string $role): User
    {
        return User::create([
            'name' => ucfirst($role).' User',
            'email' => $role.'@example.com',
            'password' => Hash::make('password'),
            'role' => $role,
        ]);
    }

    public function test_patient_can_book_only_with_doctor_id(): void
    {
        $patient = $this->makeUser('patient');
        $doctor = $this->makeUser('doctor');

        Sanctum::actingAs($patient);

        $ok = $this->postJson('/api/appointments', [
            'doctor_id' => $doctor->id,
            'date' => now()->addDays(2)->toDateString(),
        ]);

        $ok->assertStatus(201);

        $badPatientTarget = $this->postJson('/api/appointments', [
            'doctor_id' => $patient->id,
            'date' => now()->addDays(3)->toDateString(),
        ]);
        $badPatientTarget->assertStatus(422);
        $badPatientTarget->assertJsonValidationErrors(['doctor_id']);

        $admin = $this->makeUser('admin');
        $badAdminTarget = $this->postJson('/api/appointments', [
            'doctor_id' => $admin->id,
            'date' => now()->addDays(4)->toDateString(),
        ]);
        $badAdminTarget->assertStatus(422);
        $badAdminTarget->assertJsonValidationErrors(['doctor_id']);
    }
}

