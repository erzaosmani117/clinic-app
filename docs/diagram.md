# MediCore — Class Diagram

## Backend Classes

### User
**Layer:** Data (Model)

**File:** backend/app/Models/User.php
| Attributes | Type |
|------------|------|
| id | integer |
| name | string |
| email | string |
| password | string (hashed) |
| role | enum: patient, doctor |
| created_at | timestamp |

| Methods | Description |
|---------|-------------|
| appointments() | returns all appointments linked to this user |
| dosageHistories() | returns all dosage calculations by this doctor |
| tokens() | Sanctum relationship — returns all active tokens |

---

### Appointment
**Layer:** Data (Model)
**File:** backend/app/Models/Appointment.php

| Attributes | Type |
|------------|------|
| id | integer |
| patient_id | integer (FK → User) |
| doctor_id | integer (FK → User) |
| appointment_date | date |
| status | enum: pending, confirmed, cancelled |
| created_at | timestamp |

| Methods | Description |
|---------|-------------|
| patient() | returns the patient who booked this appointment |
| doctor()  | returns the doctor assigned to this appointment |

---

### DrugCategory
**Layer:** Data (Model)
**File:** backend/app/Models/DrugCategory.php

| Attributes | Type |
|------------|------|
| id | integer |
| name | string |
| icon | string |

| Methods | Description |
|---------|-------------|
| drugs() | returns all drugs belonging to this category |

---

### Drug
**Layer:** Data (Model)
**File:** backend/app/Models/Drug.php

| Attributes | Type |
|------------|------|
| id | integer |
| category_id | integer (FK → DrugCategory) |
| name | string |
| mg_per_kg | decimal |
| max_single_dose | decimal |
| contraindications | text |

| Methods | Description |
|---------|-------------|
| category() | returns the category this drug belongs to |
| dosageHistories() | returns all calculations performed for this drug |

---

### DosageHistory
**Layer:** Data (Model)
**File:** backend/app/Models/DosageHistory.php

| Attributes | Type |
|------------|------|
| id | integer |
| doctor_id | integer (FK → User) |
| drug_id | integer (FK → Drug) |
| patient_age | integer |
| patient_weight | decimal |
| calculated_dose | decimal |
| was_capped | boolean |
| created_at | timestamp |

| Methods | Description |
|---------|-------------|
| doctor() | returns the doctor who performed this calculation |
| drug() | returns the drug that was calculated |

---

### DosageCalculatorService
**Layer:** Service
**File:** backend/app/Services/DosageCalculatorService.php

| Attributes | Type |
|------------|------|
| — | no stored state |

| Methods | Description |
|---------|-------------|
| calculate(drug, weight, age) | applies mg/kg formula and returns the safe dose |
| applyMaxCap(dose, maxDose) | caps the result if it exceeds the allowed maximum |
| checkAgeRestriction(drug, age) | validates whether the drug is safe for the patient's age |

---

### RoleMiddleware
**Layer:** Security (Middleware)
**File:** backend/app/Http/Middleware/RoleMiddleware.php

| Attributes | Type |
|------------|------|
| — | no stored state |

| Methods | Description |
|---------|-------------|
| handle(request, next, role) | reads token, resolves user, checks role, allows or blocks |

---

## Relationships Summary
```
User (patient) ──< Appointment >── User (doctor)
User (doctor)  ──< DosageHistory >── Drug
Drug           >── DrugCategory
DosageHistory uses DosageCalculatorService (dependency)
RoleMiddleware guards all protected routes
```

---

## Frontend Structure

| File | Layer | Responsibility |
|------|-------|----------------|
| AuthContext.jsx | Context | stores token and role globally |
| ProtectedRoute.jsx | Routing | blocks unauthorized role access |
| axios.js | API | single configured HTTP client |
| Login.jsx / Register.jsx | Pages | authentication screens |
| PatientDashboard.jsx | Pages | patient appointment overview |
| BookAppointment.jsx | Pages | appointment booking form |
| DoctorDashboard.jsx | Pages | doctor appointment list |
| DosageHome.jsx | Pages | drug category selection screen |
| DosageDrugList.jsx | Pages | drugs within a selected category |
| DosageCalculator.jsx | Pages | dosage form and result display |
| DosageHistory.jsx | Pages | past calculations for this doctor |
| Navbar.jsx | Component | navigation across all pages |
| AppointmentCard.jsx | Component | single appointment display block |
| DrugCategoryCard.jsx | Component | single category display block |
| DrugCard.jsx | Component | single drug display block |