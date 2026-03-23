# MediCore — Architecture Documentation
## Project Overview

MediCore is a full-stack web application built with a clear separation 
between frontend and backend responsibilities. The backend exposes a 
REST API consumed by the frontend through HTTP requests. They are 
completely decoupled — the React frontend has no knowledge of the 
database, and the Laravel backend has no knowledge of how the UI works.

---

## Project Layers
### 1. Presentation Layer — React (frontend/)

This is everything the user sees and interacts with. It is built in 
React and organized into pages, components, and context.

- **pages/** — each file represents one full screen in the application.
  A page like DosageCalculator.jsx contains the form the doctor fills 
  in and displays the result after the API responds.
- **components/** — smaller reusable UI pieces used inside pages. 
  DrugCategoryCard.jsx for example is a single card block that 
  DosageHome.jsx renders once per drug category.
- **context/AuthContext.jsx** — holds the logged-in user's token and 
  role in global state so any component can access it without passing 
  props through every level.
- **routes/ProtectedRoute.jsx** — a wrapper that checks the user's role 
  before allowing access to a route. If a patient tries to reach a 
  doctor-only page they are redirected to login.
- **api/axios.js** — a single configured Axios instance. The base URL 
  is set once here so no page hardcodes the API address.


### 2. Application Layer — Laravel Controllers (backend/app/Http/Controllers/)

Controllers are the entry point for every API request. They receive the 
request, call the appropriate service or model, and return a JSON 
response. They contain no business logic themselves — that responsibility 
belongs to the Service layer.

- **AuthController.php** — handles registration and login. On successful 
  login it creates a Sanctum token and returns it alongside the user's role.
- **AppointmentController.php** — handles booking and retrieving 
  appointments for both patients and doctors.
- **DoctorController.php** — handles doctor-specific data retrieval such 
  as the list of doctors available for booking.
- **DrugController.php** — returns drug categories and drugs, used by 
  the dosage module screens.
- **DosageController.php** — receives the dosage calculation request, 
  delegates to DosageCalculatorService, and saves the result to history.

### 3. Service Layer — backend/app/Services/

This layer holds business logic that is too complex or too important to 
live inside a controller.

- **DosageCalculatorService.php** — contains the full pediatric dosage 
  calculation logic. It applies the mg/kg formula, checks the patient's 
  age, and caps the result at the maximum allowed single dose. Keeping 
  this in a dedicated service means the logic can be tested independently 
  and reused without duplicating code across controllers.

### 4. Data Layer — Laravel Models (backend/app/Models/)

Models represent database tables and handle all data access. Laravel's 
Eloquent ORM means no raw SQL is written — models provide a clean 
interface for querying and persisting data.

- **User.php** — represents both patients and doctors. The role column 
  distinguishes between them.
- **Appointment.php** — stores appointment records with status, date, 
  and references to both the patient and doctor.
- **DrugCategory.php** — represents a category of drugs such as 
  antibiotics or analgesics.
- **Drug.php** — represents an individual drug with its dosage rules, 
  mg/kg value, and maximum single dose.
- **DosageHistory.php** — stores every completed dosage calculation, 
  linked to the doctor who performed it.

### 5. Security Layer — backend/app/Http/Middleware/

Middleware runs before a controller processes a request. It acts as a 
gate that either allows or blocks the request based on the user's 
identity and role.

- **RoleMiddleware.php** — reads the Sanctum token from the request 
  header, identifies the user it belongs to, checks their role, and 
  returns a 403 Forbidden response if they do not have the required 
  permission for that route.


## Request Flow

Every feature in MediCore follows the same path from user action to 
database and back:
```
User interacts with React page
→ Axios sends HTTP request with token in Authorization header
→ Laravel api.php matches the route
→ RoleMiddleware checks token and role
→ Controller receives the request
→ Service layer runs business logic (if needed)
→ Model queries MySQL database
→ Controller returns JSON response
→ React updates the UI
```

## Repository Pattern in Laravel

The assignment requires implementation of the Repository Pattern. In 
Laravel this pattern is implemented natively through Eloquent ORM. 
Rather than creating a redundant abstraction layer on top of Eloquent, 
the pattern's responsibilities are mapped directly to existing Laravel 
components:

| Repository Pattern | Laravel Equivalent |
|------|---|
| GetAll() | Model::all() |
| GetById() | Model::find($id) |
| Add() | Model::create($data) |
| Save() | $model->save() |

Each Model in MediCore acts as its own repository. For example, 
Appointment::where('doctor_id', $id)->get() retrieves all appointments 
for a doctor — the equivalent of a filtered GetAll() call. This is the 
idiomatic Laravel approach and is consistent with how production Laravel 
applications handle data access.

---

## Reasons for Architectural Decisions

**Why Laravel + React instead of a monolithic framework?**
Separating frontend and backend allows each to evolve independently. 
The React frontend can be redesigned without touching the API. The 
Laravel backend can serve a mobile app in the future using the same 
endpoints.

**Why a Service layer for dosage calculation?**
The mg/kg formula, age checks, and dose capping logic is the most 
critical business logic in the system. Placing it inside a controller 
would mix HTTP concerns with medical calculation logic. A dedicated 
DosageCalculatorService makes the logic testable, readable, and reusable.

**Why token-based authentication with Sanctum?**
Because the frontend and backend are on separate origins, session-based 
authentication does not work cleanly. Sanctum issues a token on login 
that React stores and attaches to every request, making authentication 
stateless and suitable for an API-driven architecture.

**Why a RoleMiddleware instead of inline checks?**
Putting role checks inside every controller method would mean duplicating 
the same logic across multiple files. A single middleware handles this 
responsibility in one place and is applied at the route level in api.php.