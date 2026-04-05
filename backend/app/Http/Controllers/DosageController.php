<?php

namespace App\Http\Controllers;

use App\Models\Drug;
use App\Models\DosageHistory;
use App\Services\DosageCalculatorService;
use Illuminate\Http\Request;

class DosageController extends Controller
{
    protected DosageCalculatorService $calculator;

    public function __construct(DosageCalculatorService $calculator)
    {
        $this->calculator = $calculator;
    }

    public function calculate(Request $request)
    {
        $request->validate([
            'drug_id'       => 'required|exists:drugs,id',
            'weight_kg'     => 'required|numeric|min:0.5|max:150',
            'age_months'    => 'required|integer|min:0|max:216',
        ]);

        $drug = Drug::findOrFail($request->drug_id);
        $result = $this->calculator->calculate(
            $drug,
            $request->weight_kg,
            $request->age_months
        );

        // Save to history
        DosageHistory::create([
            'doctor_id'          => $request->user()->id,
            'drug_id'            => $drug->id,
            'patient_age_months' => $request->age_months,
            'patient_weight_kg'  => $request->weight_kg,
            'calculated_dose_mg' => $result['calculated_dose_mg'],
            'was_capped'         => $result['was_capped'],
        ]);

        return response()->json($result);
    }

    public function history(Request $request)
    {
        $history = DosageHistory::where('doctor_id', $request->user()->id)
            ->with('drug:id,name')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($history);
    }
}