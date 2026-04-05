<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Drug;

class DrugSeeder extends Seeder
{
    public function run(): void
    {
        $drugs = [
            // Antibiotics (category_id: 1)
            ['category_id' => 1, 'name' => 'Amoxicillin',      'dose_per_kg' => 25,  'max_single_dose' => 500,  'min_age_months' => 1,  'contraindications' => 'Penicillin allergy',          'contraindication_severity' => 'high'],
            ['category_id' => 1, 'name' => 'Azithromycin',     'dose_per_kg' => 10,  'max_single_dose' => 500,  'min_age_months' => 6,  'contraindications' => 'Macrolide allergy',           'contraindication_severity' => 'high'],
            ['category_id' => 1, 'name' => 'Cefalexin',        'dose_per_kg' => 25,  'max_single_dose' => 500,  'min_age_months' => 1,  'contraindications' => 'Cephalosporin allergy',       'contraindication_severity' => 'high'],
            ['category_id' => 1, 'name' => 'Trimethoprim',     'dose_per_kg' => 4,   'max_single_dose' => 200,  'min_age_months' => 6,  'contraindications' => 'Sulfonamide allergy',         'contraindication_severity' => 'moderate'],
            ['category_id' => 1, 'name' => 'Clarithromycin',   'dose_per_kg' => 7.5, 'max_single_dose' => 250,  'min_age_months' => 6,  'contraindications' => 'Macrolide allergy',           'contraindication_severity' => 'high'],
            ['category_id' => 1, 'name' => 'Metronidazole',    'dose_per_kg' => 7.5, 'max_single_dose' => 400,  'min_age_months' => 1,  'contraindications' => 'Blood disorders',             'contraindication_severity' => 'moderate'],

            // Respiratory (category_id: 2)
            ['category_id' => 2, 'name' => 'Salbutamol',       'dose_per_kg' => 0.1, 'max_single_dose' => 2.5,  'min_age_months' => 0,  'contraindications' => 'Hypersensitivity to salbutamol', 'contraindication_severity' => 'high'],
            ['category_id' => 2, 'name' => 'Prednisolone',     'dose_per_kg' => 1,   'max_single_dose' => 40,   'min_age_months' => 1,  'contraindications' => 'Active infections, live vaccines', 'contraindication_severity' => 'moderate'],
            ['category_id' => 2, 'name' => 'Montelukast',      'dose_per_kg' => 0,   'max_single_dose' => 5,    'min_age_months' => 24, 'contraindications' => 'Phenylketonuria',             'contraindication_severity' => 'low'],
            ['category_id' => 2, 'name' => 'Budesonide',       'dose_per_kg' => 0,   'max_single_dose' => 0.5,  'min_age_months' => 6,  'contraindications' => 'Fungal respiratory infections', 'contraindication_severity' => 'moderate'],
            ['category_id' => 2, 'name' => 'Ipratropium',      'dose_per_kg' => 0,   'max_single_dose' => 0.25, 'min_age_months' => 0,  'contraindications' => 'Atropine allergy',            'contraindication_severity' => 'moderate'],

            // Fever & Pain (category_id: 3)
            ['category_id' => 3, 'name' => 'Paracetamol',      'dose_per_kg' => 15,  'max_single_dose' => 500,  'min_age_months' => 0,  'contraindications' => 'Severe liver disease',        'contraindication_severity' => 'high'],
            ['category_id' => 3, 'name' => 'Ibuprofen',        'dose_per_kg' => 10,  'max_single_dose' => 400,  'min_age_months' => 3,  'contraindications' => 'Renal impairment, asthma',    'contraindication_severity' => 'moderate'],
            ['category_id' => 3, 'name' => 'Diclofenac',       'dose_per_kg' => 1,   'max_single_dose' => 50,   'min_age_months' => 12, 'contraindications' => 'GI ulcers, renal disease',    'contraindication_severity' => 'moderate'],

            // Gastrointestinal (category_id: 4)
            ['category_id' => 4, 'name' => 'Ondansetron',      'dose_per_kg' => 0.15,'max_single_dose' => 4,    'min_age_months' => 6,  'contraindications' => 'QT prolongation',             'contraindication_severity' => 'high'],
            ['category_id' => 4, 'name' => 'Domperidone',      'dose_per_kg' => 0.25,'max_single_dose' => 10,   'min_age_months' => 0,  'contraindications' => 'GI bleeding, prolactinoma',   'contraindication_severity' => 'high'],
            ['category_id' => 4, 'name' => 'Omeprazole',       'dose_per_kg' => 0.7, 'max_single_dose' => 20,   'min_age_months' => 12, 'contraindications' => 'Hypersensitivity',            'contraindication_severity' => 'low'],
            ['category_id' => 4, 'name' => 'Lactulose',        'dose_per_kg' => 0.5, 'max_single_dose' => 10,   'min_age_months' => 0,  'contraindications' => 'Galactosaemia',               'contraindication_severity' => 'moderate'],
            ['category_id' => 4, 'name' => 'Oral Rehydration', 'dose_per_kg' => 0,   'max_single_dose' => 200,  'min_age_months' => 0,  'contraindications' => null,                          'contraindication_severity' => null],

            // Ear & Eye (category_id: 5)
            ['category_id' => 5, 'name' => 'Ciprofloxacin Ear','dose_per_kg' => 0,   'max_single_dose' => 0,    'min_age_months' => 1,  'contraindications' => 'Perforated eardrum',          'contraindication_severity' => 'high'],
            ['category_id' => 5, 'name' => 'Chloramphenicol',  'dose_per_kg' => 0,   'max_single_dose' => 0,    'min_age_months' => 0,  'contraindications' => 'Bone marrow depression',      'contraindication_severity' => 'high'],
            ['category_id' => 5, 'name' => 'Gentamicin Eye',   'dose_per_kg' => 0,   'max_single_dose' => 0,    'min_age_months' => 0,  'contraindications' => 'Aminoglycoside allergy',      'contraindication_severity' => 'moderate'],

            // Vitamins (category_id: 6)
            ['category_id' => 6, 'name' => 'Vitamin D3',       'dose_per_kg' => 0,   'max_single_dose' => 400,  'min_age_months' => 0,  'contraindications' => 'Hypercalcaemia',              'contraindication_severity' => 'low'],
            ['category_id' => 6, 'name' => 'Vitamin C',        'dose_per_kg' => 0,   'max_single_dose' => 250,  'min_age_months' => 0,  'contraindications' => null,                          'contraindication_severity' => null],
            ['category_id' => 6, 'name' => 'Iron Syrup',       'dose_per_kg' => 3,   'max_single_dose' => 60,   'min_age_months' => 4,  'contraindications' => 'Iron overload disorders',     'contraindication_severity' => 'moderate'],
            ['category_id' => 6, 'name' => 'Zinc',             'dose_per_kg' => 0,   'max_single_dose' => 10,   'min_age_months' => 6,  'contraindications' => null,                          'contraindication_severity' => null],
        ];

        foreach ($drugs as $drug) {
            Drug::create($drug);
        }
    }
}