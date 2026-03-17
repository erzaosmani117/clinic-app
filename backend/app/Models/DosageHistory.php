<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DosageHistory extends Model
{
    protected $fillable = [
        'doctor_id',
        'drug_id',
        'patient_age_months',
        'patient_weight_kg',
        'calculated_dose_mg',
        'was_capped',
    ];

    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }

    public function drug()
    {
        return $this->belongsTo(Drug::class, 'drug_id');
    }
}