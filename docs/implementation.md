# Implementation Documentation
## Pediatric Clinic Management System

## 1. Project Overview

This project is a full-stack web application built with **React + Laravel + MySQL**.
It implements a layered architecture where every user action flows through distinct layers:

**UI (React) → Controller → Service → Repository → Data Source**

### Repository Pattern

The Repository Pattern is implemented through a shared `IRepository` interface
with two concrete implementations:
```php
interface IRepository {
    public function getAll();
    public function getById($id);
    public function add(array $data);
    public function save($model);
    public function delete($id);
}
```

**Two implementations of the same interface:**

- `AppointmentRepository` — reads and writes from MySQL database using Eloquent ORM
- `FileRepository` — reads and writes from a CSV file (`docs/appointments.csv`)

This demonstrates that the data source can be completely swapped without
changing the Service or Controller logic — which is the core purpose of
the Repository Pattern.

---

## 2. Exercise 1 — Model + Repository (30 points)

### Main Model: Appointment
```php
// Appointment model attributes:
// id, patient_id, doctor_id, date, status, created_at, updated_at
```

The Appointment model has 4+ attributes and relationships:
- `belongsTo` User as patient
- `belongsTo` User as doctor

### FileRepository

Location: `backend/app/Repositories/FileRepository.php`
Reads and writes from `docs/appointments.csv`.

**CSV file with 10 initial records:**
```
id,patient_name,doctor_name,date,status
1,"John Smith","Dr. Alice Brown",2026-04-10,cancelled
2,"Emily Johnson","Dr. Alice Brown",2026-04-11,confirmed
3,"Michael Davis","Dr. Robert Wilson",2026-04-12,confirmed
4,"Sarah Martinez","Dr. Robert Wilson",2026-04-14,confirmed
5,"Emily Doe","Dr. Alice Brown",2026-05-11,confirmed
6,"David Davis","Dr. Robert Wilson",2026-04-23,confirmed
7,"Sheldon Brown","Dr. Robert Wilson",2026-04-18,confirmed
8,"Jane Smith","Dr. Alice Brown",2026-06-12,confirmed
9,"Ary Sims","Dr. Robert Wilson",2026-04-03,confirmed
10,"Milly Cooper","Dr. Robert Wilson",2026-05-20,confirmed
```

| Method | Description |
|--------|-------------|
| `getAll()` | Opens CSV, reads all rows, returns array |
| `getById($id)` | Loops through rows, returns matching record |
| `add(array $data)` | Appends new row to CSV, auto-increments id |
| `save($model)` | Finds row by id, updates it, rewrites entire CSV |
| `delete($id)` | Filters out row by id, rewrites entire CSV |

---

## 3. Exercise 2 — Service with Logic (25 points)

Location: `backend/app/Services/AppointmentService.php`

### Dependency Injection

The Service receives the Repository as a constructor parameter:
```php
public function __construct(FileRepository $repository)
{
    $this->repository = $repository;
}
```

This means the Service never directly accesses the data source —
it only talks to the Repository interface.

### Method 1 — List with Filtering
```php
public function list(?string $status = null): array
```

Returns all appointments. Accepts an optional `$status` parameter
for filtering. Called via:
```
GET /api/file-appointments?status=confirmed
```

Example: passing `status=confirmed` returns only confirmed appointments.
This is the filtering mechanism — instead of price > 0 (generic assignment template),
this project uses **status filtering** and **date validation** which are
the equivalent business rules for a clinic management system.

### Method 2 — Add with Validation
```php
public function add(array $data): array|string
```

Validates before saving:
- `patient_name` cannot be empty
- `doctor_name` cannot be empty
- `date` cannot be empty
- `status` is automatically set to `confirmed`

Returns the created record or a validation error message.

### Method 3 — Find by ID
```php
public function findById($id): ?array
```

Returns a single appointment by id or null if not found.

### Update and Delete (bonus 10 points)
```php
public function update($id, array $data): bool|string
public function delete($id): bool|string
```

Both methods first check if the record exists before modifying.
Return error message if not found, result if successful.

---

## 4. Exercise 3 — UI Connected to Service (25 points)

### Full Flow Demonstrated
```
React UI → Laravel Controller → AppointmentService → FileRepository → CSV File
```

### API Endpoints (CSV-based)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/file-appointments` | List all appointments |
| GET | `/api/file-appointments?status=confirmed` | List filtered by status |
| GET | `/api/file-appointments/{id}` | Find by id |
| POST | `/api/file-appointments` | Add new appointment |
| PUT | `/api/file-appointments/{id}` | Update appointment |
| DELETE | `/api/file-appointments/{id}` | Delete appointment |

All endpoints are protected by `auth:sanctum` middleware —
a valid Bearer token is required in the Authorization header.

### POST Request Body Example
```json
{
    "patient_name": "Test Child",
    "doctor_name": "Dr. Test",
    "date": "2026-05-01"
}
```

### Response Example
```json
{
    "patient_name": "Test Child",
    "doctor_name": "Dr. Test",
    "date": "2026-05-01",
    "status": "confirmed",
    "id": 6
}
```

### UI — Doctor Dashboard Filter

The Doctor Dashboard in React includes a **date filter** that filters
appointments by date in real time. This demonstrates the complete
UI → Service → Repository → File flow visually.

Filter is implemented as:
```jsx
const filteredAppointments = filterDate
    ? appointments.filter(a => a.date === filterDate)
    : appointments;
```

---

## 5. What Works End to End
### Authentication Flow
- Patient registers → gets token → redirected to Patient Dashboard
- Doctor registers → gets token → redirected to Doctor Dashboard
- Wrong role trying to access protected route → redirected to login
- Logout → token deleted from database and localStorage

### Patient Flow
- Patient logs in → sees their appointments
- Patient selects a doctor from the list
- Patient picks a future date
- Appointment saved with status `confirmed`
- Appointment appears immediately in their list

### Doctor Flow
- Doctor logs in → sees all appointments booked with them
- Doctor sees patient name, email, date and status
- Doctor can filter appointments by date
- Stats show total, today's and upcoming appointments

### CSV CRUD Flow
- GET all → reads CSV → returns all 5+ records
- GET by id → reads CSV → returns matching record
- POST → validates → appends to CSV → returns new record
- PUT → finds record → updates → rewrites CSV
- DELETE → removes record → rewrites CSV


## 8. How to Run

### Backend
```bash
cd backend
php artisan serve
```
Runs at `http://127.0.0.1:8000`

### Frontend
```bash
cd frontend
npm run dev
```
Runs at `http://localhost:5173`

### Database
```bash
cd backend
php artisan migrate:fresh
```