<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Patient only routes
    Route::middleware('role:patient')->group(function () {
        // appointments will go here
    });

    // Doctor only routes
   Route::middleware('role:doctor')->group(function () {
});
});