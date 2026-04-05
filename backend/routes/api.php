<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\FileAppointmentController;
use App\Http\Controllers\DrugController;
use App\Http\Controllers\DosageController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/file-appointments', [FileAppointmentController::class, 'index']);
    Route::get('/file-appointments/{id}', [FileAppointmentController::class, 'show']);
    Route::post('/file-appointments', [FileAppointmentController::class, 'store']);
    Route::put('/file-appointments/{id}', [FileAppointmentController::class, 'update']);
    Route::delete('/file-appointments/{id}', [FileAppointmentController::class, 'destroy']);

    // Patient only routes
    Route::middleware('role:patient')->group(function () {
        Route::get('/doctors', [DoctorController::class, 'index']);
        Route::post('/appointments', [AppointmentController::class, 'store']);
        Route::get('/my-appointments', [AppointmentController::class, 'patientAppointments']);
    });

    // Doctor only routes
    Route::middleware('role:doctor')->group(function () {
    Route::get('/doctor-appointments', [AppointmentController::class, 'doctorAppointments']);

    // Dosage module
    Route::get('/drug-categories', [DrugController::class, 'categories']);
    Route::get('/drug-categories/{id}/drugs', [DrugController::class, 'drugsByCategory']);
    Route::get('/drugs/{id}', [DrugController::class, 'show']);
    Route::post('/dosage/calculate', [DosageController::class, 'calculate']);
    Route::get('/dosage/history', [DosageController::class, 'history']);
});
});