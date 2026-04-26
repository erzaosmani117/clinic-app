# MediCore — Pediatric Clinic Management System

MediCore is a full-stack web application designed to streamline and digitize the daily operations of a pediatric clinic.

The platform provides a complete role-based system for **Patients**, **Doctors**, and **Administrators**, enabling efficient appointment management, real-time workflow updates, and accurate pediatric medication dosage calculations.

One of the most critical features of the system is the **Pediatric Dosage Calculator**, built to reduce human error when prescribing medication for children based on age, exact months, weight, allergies, and medication-specific safety rules.

---

## Key Features

### Patient Portal
Patients can:

- Register and log in securely
- Search doctors by **name** or **specialty**
- Book appointments by selecting a doctor and date
- View all booked appointments
- Track appointment statuses:
  - Pending
  - Confirmed
  - Cancelled
- Receive notifications when:
  - an appointment is confirmed,
  - cancelled,
  - rescheduled,
  - reassigned to another doctor
- Manage and update profile information:
  - name
  - email
  - age
  - weight
  - allergies

---

### Doctor Dashboard
Doctors can:

- Log in to a dedicated dashboard
- View total appointments
- Confirm or cancel appointments
- Search patients by name
- Filter appointments by date
- Sort appointments:
  - Newest → Oldest
  - Oldest → Newest
- Receive notifications for:
  - newly assigned appointments
  - reassigned appointments
  - appointment updates

#### Pediatric Dosage Calculator
Doctors can:

- Browse medication categories such as:
  - Antibiotics
  - Respiratory Drugs
  - Vitamins
- Select a specific medication
- Enter patient:
  - age
  - exact months
  - weight
- Automatically calculate safe dosage using pediatric rules

The system also provides:

- Allergy alerts
- High-risk medication warnings
- Side effect information
- Common dosage guidelines

#### Dosage History
Doctors can:

- View calculation history
- Search calculations by medication name
- Sort history:
  - Newest → Oldest
  - Oldest → Newest
- Export dosage history as CSV

---

### Admin Panel
Administrators can:

- View all appointments across the system
- View patient and doctor information
- Confirm or cancel appointments
- Reschedule appointments
- Reassign appointments to another doctor
- Automatically trigger notifications to:
  - the patient
  - the previous doctor
  - the new doctor
- Search and filter appointments
- Manage doctors and patients

---

## Technologies Used

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite 6, Tailwind CSS, React Router |
| Backend | Laravel (PHP), Laravel Sanctum |
| Database | MySQL |
| HTTP Client | Axios |
| Authentication | Token-based authentication via Laravel Sanctum |
| Exporting | CSV Export |
| Version Control | Git + GitHub |

---
## Architecture

MediCore follows a clean and decoupled architecture:
MediCore follows a clean and decoupled architecture:

Frontend (React SPA) handles UI/UX and state management
Backend (Laravel REST API) handles business logic and secure API endpoints
MySQL handles persistent storage
Axios is used for API communication
Laravel Sanctum handles secure authentication

This separation improves scalability, maintainability, and code organization.
---

## Main Business Flows

### Appointment Booking Flow
Patient → Search Doctor → Select Date → Book Appointment → Pending Status

### Appointment Management Flow
Doctor/Admin → Confirm / Cancel / Reschedule / Reassign

### Notification Flow
System automatically notifies patients and doctors when appointment changes occur.

### Dosage Calculation Flow
Doctor → Select Drug → Enter Age/Months/Weight → Calculate Safe Dosage → Save to History / Export CSV

## Future Improvements

- Real-time notifications using WebSockets / Pusher  
- Advanced analytics dashboard  
- Improved mobile responsiveness  
- Reporting and statistics modules  

## Project Structure

```bash
MediCore/
├── backend/     # Laravel REST API
├── frontend/    # React SPA
└── docs/        # Documentation
```



