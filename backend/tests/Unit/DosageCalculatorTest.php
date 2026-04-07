<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Services\DosageCalculatorService;
use App\Models\Drug;

class DosageCalculatorTest extends TestCase
{
    protected DosageCalculatorService $calculator;

    protected function setUp(): void
    {
        parent::setUp();
        $this->calculator = new DosageCalculatorService();
    }

    // Test 1 — Kalkulim normal
    public function test_calculates_correct_dose_based_on_weight()
    {
        $drug = new Drug();
        $drug->name = 'Amoxicillin';
        $drug->dose_per_kg = 25;
        $drug->max_single_dose = 500;
        $drug->min_age_months = 1;
        $drug->contraindications = null;
        $drug->contraindication_severity = null;

        $result = $this->calculator->calculate($drug, 10, 24);

        $this->assertEquals(250, $result['calculated_dose_mg']);
        $this->assertFalse($result['was_capped']);
        $this->assertNull($result['age_warning']);
    }

    // Test 2 — Doza tejkalon maksimumin, duhet të kufizohet
    public function test_dose_is_capped_at_maximum()
    {
        $drug = new Drug();
        $drug->name = 'Amoxicillin';
        $drug->dose_per_kg = 25;
        $drug->max_single_dose = 500;
        $drug->min_age_months = 1;
        $drug->contraindications = null;
        $drug->contraindication_severity = null;

        // 25kg × 25mg/kg = 625mg — mbi max 500mg
        $result = $this->calculator->calculate($drug, 25, 36);

        $this->assertEquals(500, $result['calculated_dose_mg']);
        $this->assertTrue($result['was_capped']);
    }

    // Test 3 — Mosha nën minimale, duhet të shfaqë warning
    public function test_age_warning_when_patient_too_young()
    {
        $drug = new Drug();
        $drug->name = 'Azithromycin';
        $drug->dose_per_kg = 10;
        $drug->max_single_dose = 500;
        $drug->min_age_months = 6;
        $drug->contraindications = null;
        $drug->contraindication_severity = null;

        // Mosha 3 muaj — nën minimumin 6 muaj
        $result = $this->calculator->calculate($drug, 5, 3);

        $this->assertNotNull($result['age_warning']);
        $this->assertStringContainsString('6 months', $result['age_warning']);
    }

    // Test 4 — Contraindications shfaqen korrekt
    public function test_contraindications_returned_correctly()
    {
        $drug = new Drug();
        $drug->name = 'Amoxicillin';
        $drug->dose_per_kg = 25;
        $drug->max_single_dose = 500;
        $drug->min_age_months = 1;
        $drug->contraindications = 'Penicillin allergy';
        $drug->contraindication_severity = 'high';

        $result = $this->calculator->calculate($drug, 10, 24);

        $this->assertEquals('Penicillin allergy', $result['contraindications']);
        $this->assertEquals('high', $result['contraindication_severity']);
    }

    // Test 5 — Rast kufitar: pesha shumë e vogël
    public function test_very_low_weight_calculates_small_dose()
    {
        $drug = new Drug();
        $drug->name = 'Paracetamol';
        $drug->dose_per_kg = 15;
        $drug->max_single_dose = 500;
        $drug->min_age_months = 0;
        $drug->contraindications = null;
        $drug->contraindication_severity = null;

        // 2kg × 15mg/kg = 30mg
        $result = $this->calculator->calculate($drug, 2, 3);

        $this->assertEquals(30, $result['calculated_dose_mg']);
        $this->assertFalse($result['was_capped']);
    }

    // Test 6 — Drug pa dose_per_kg, përdor max_single_dose direkt
    public function test_fixed_dose_drug_returns_max_dose()
    {
        $drug = new Drug();
        $drug->name = 'Montelukast';
        $drug->dose_per_kg = 0;
        $drug->max_single_dose = 5;
        $drug->min_age_months = 24;
        $drug->contraindications = null;
        $drug->contraindication_severity = null;

        $result = $this->calculator->calculate($drug, 15, 36);

        $this->assertEquals(5, $result['calculated_dose_mg']);
    }
}