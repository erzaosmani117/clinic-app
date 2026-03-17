<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Drug extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'dose_per_kg',
        'max_single_dose',
        'min_age_months',
        'contraindications',
        'contraindication_severity',
    ];

    public function category()
    {
        return $this->belongsTo(DrugCategory::class, 'category_id');
    }

    public function dosageHistory()
    {
        return $this->hasMany(DosageHistory::class, 'drug_id');
    }
}