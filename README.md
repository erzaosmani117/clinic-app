# Pediatric Clinic Management System

A full-stack web application for managing a pediatric clinic, 
including patient registration, appointment booking, and a 
clinical dosage support module for doctors.

## What the application does
- Patients can register, log in, and book appointments with doctors
- Doctors can view their scheduled appointments
- Doctors can calculate safe pediatric drug dosages based on 
  patient age and weight
- The system displays contraindication warnings before prescribing
- Dosage calculation history is saved per doctor

## Technologies
- **Frontend:** React 19, Vite 6, Tailwind CSS, React Router, Axios
- **Backend:** Laravel (PHP), Laravel Sanctum
- **Database:** MySQL

## Database Schema
- users (patients and doctors)
- appointments
- drug_categories
- drugs
- dosage_history
