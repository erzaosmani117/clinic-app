<?php

namespace App\Services;

use App\Models\Drug;

class DosageCalculatorService
{
    public function calculate(Drug $drug, float $weightKg, int $ageMonths): array
    {
        $wasCapped = false;
        $ageWarning = null;

        // Calculate dose
        if ($drug->dose_per_kg > 0) {
            $calculatedDose = $drug->dose_per_kg * $weightKg;
        } else {
            $calculatedDose = $drug->max_single_dose;
        }

        // Cap at max single dose
        if ($drug->max_single_dose > 0 && $calculatedDose > $drug->max_single_dose) {
            $calculatedDose = $drug->max_single_dose;
            $wasCapped = true;
        }

        // Age warning
        if ($drug->min_age_months && $ageMonths < $drug->min_age_months) {
            $years = floor($drug->min_age_months / 12);
            $months = $drug->min_age_months % 12;
            $ageWarning = $years > 0
                ? "Not recommended for children under {$years} years"
                : "Not recommended for children under {$drug->min_age_months} months";
        }

        return [
            'drug_name'          => $drug->name,
            'calculated_dose_mg' => round($calculatedDose, 2),
            'was_capped'         => $wasCapped,
            'age_warning'        => $ageWarning,
            'contraindications'  => $drug->contraindications,
            'contraindication_severity' => $drug->contraindication_severity,
        ];
    }
}