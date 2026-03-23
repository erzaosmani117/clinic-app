# MediCore — Pediatric Clinic Management System

MediCore is a full-stack web application built to streamline the daily 
operations of a pediatric clinic. It covers patient registration, 
appointment booking, and a clinical dosage support module designed 
specifically for pediatric care — where weight-based dosing and 
contraindication awareness are critical for patient safety.

## What the Application Does

**For Patients:**
- Register an account and log in securely
- Book appointments by selecting a doctor and a date
- View and manage existing appointments

**For Doctors:**
- Log in to a dedicated doctor dashboard
- View all scheduled patient appointments
- Calculate safe drug dosages based on a child's age and weight 
  using pediatric mg/kg rules
- Receive contraindication warnings before prescribing medication
- Review a personal history of past dosage calculations

## Technologies

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite 6, Tailwind CSS, React Router |
| Backend | Laravel (PHP), Laravel Sanctum |
| Database | MySQL |
| HTTP Client | Axios |
| Authentication | Token-based via Laravel Sanctum |
| Version Control | Git + GitHub |

## Project Structure
```
MediCore/
├── backend/     ← Laravel REST API
└── frontend/    ← React single-page application
```

## Database Schema

| Table | Description |
|-------|-------------|
| users | stores both patients and doctors, distinguished by role |
| appointments | booking records linked to a patient and a doctor |
| drug_categories | groups of drugs such as antibiotics or analgesics |
| drugs | individual drugs with mg/kg rules and max dose limits |
| dosage_history | saved calculations per doctor |

## Architecture

The backend exposes a REST API that the React frontend consumes 
through Axios. They are fully decoupled — the frontend handles 
the UI, the backend handles all business logic and data access. 
Full architecture documentation is available in docs/architecture.md.

## Current Status

Core project structure is in place. Authentication, appointment 
management, and dosage calculator modules are under active development.