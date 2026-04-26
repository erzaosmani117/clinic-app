<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

   protected $fillable = [
    'name',
    'email',
    'password',
    'role',
    'specialty',
    'age_months',
    'weight_kg',
    'allergies',
    'bio',
];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'patient_id');
    }

    public function doctorAppointments()
    {
        return $this->hasMany(Appointment::class, 'doctor_id');
    }

    public function dosageHistory()
    {
        return $this->hasMany(DosageHistory::class, 'doctor_id');
    }

    public function notifications()
    {
        return $this->hasMany(UserNotification::class)->orderByDesc('created_at');
    }
}