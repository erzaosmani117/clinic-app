<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\FileAppointmentController;
use App\Http\Controllers\DrugController;
use App\Http\Controllers\DosageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);


// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::patch('/profile', [ProfileController::class, 'update']);
    
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/file-appointments', [FileAppointmentController::class, 'index']);
    Route::get('/file-appointments/{id}', [FileAppointmentController::class, 'show']);
    Route::post('/file-appointments', [FileAppointmentController::class, 'store']);
    Route::put('/file-appointments/{id}', [FileAppointmentController::class, 'update']);
    Route::delete('/file-appointments/{id}', [FileAppointmentController::class, 'destroy']);

    // Patient only routes
   Route::middleware('role:patient')->group(function () {
    Route::get('/doctors', [DoctorController::class, 'index']);
    Route::get('/doctors/specialties', [DoctorController::class, 'specialties']);
    Route::post('/appointments', [AppointmentController::class, 'store']);
    Route::get('/my-appointments', [AppointmentController::class, 'patientAppointments']);
    
});
    // Doctor only routes
    Route::middleware('role:doctor')->group(function () {
    Route::get('/doctor-appointments', [AppointmentController::class, 'doctorAppointments']);
    Route::patch('/appointments/{id}/status', [AppointmentController::class, 'updateStatus']);

    // Dosage module
    Route::get('/drug-categories', [DrugController::class, 'categories']);
    Route::get('/drug-categories/{id}/drugs', [DrugController::class, 'drugsByCategory']);
    Route::get('/drugs/{id}', [DrugController::class, 'show']);
    Route::post('/dosage/calculate', [DosageController::class, 'calculate']);
    Route::get('/dosage/history', [DosageController::class, 'history']);
});

// Admin only routes
Route::middleware('role:admin')->group(function () {
    Route::get('/admin/stats', [AdminController::class, 'stats']);
    Route::get('/admin/users', [AdminController::class, 'users']);
    Route::post('/admin/doctors', [AdminController::class, 'addDoctor']);
    Route::delete('/admin/users/{id}', [AdminController::class, 'deleteUser']);
    Route::get('/admin/appointments', [AdminController::class, 'appointments']);
    Route::get('/admin/drug-categories', [AdminController::class, 'drugCategories']);
    Route::post('/admin/drugs', [AdminController::class, 'addDrug']);
    Route::delete('/admin/drugs/{id}', [AdminController::class, 'deleteDrug']);
});

});