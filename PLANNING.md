# Project Planning

## Build Order
1. Database migrations and seeders
2. Authentication (register, login, logout)
3. Role middleware (protect routes by role)
4. Patient flow (book appointment, view appointments)
5. Doctor flow (view appointments)
6. Dosage module (categories, drugs, calculator, history)

## API Endpoints Plan
### Auth
- POST /api/register
- POST /api/login
- POST /api/logout

### Appointments
- POST /api/appointments
- GET /api/appointments

### Doctors
- GET /api/doctors

### Drugs
- GET /api/drug-categories
- GET /api/drug-categories/{id}/drugs
- POST /api/dosage/calculate
- GET /api/dosage/history