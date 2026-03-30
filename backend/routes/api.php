<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\DoctorController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Patient only routes
    Route::middleware('role:patient')->group(function () {
        Route::get('/doctors', [DoctorController::class, 'index']);
        Route::post('/appointments', [AppointmentController::class, 'store']);
        Route::get('/my-appointments', [AppointmentController::class, 'patientAppointments']);
    });

    // Doctor only routes
    Route::middleware('role:doctor')->group(function () {
        Route::get('/doctor-appointments', [AppointmentController::class, 'doctorAppointments']);
    });
});