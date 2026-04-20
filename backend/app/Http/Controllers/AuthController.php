<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'role'     => 'in:patient,doctor',
        ]);

        //What does create do:
//  1. Take your input array
// 2. Create a User object internally
// 3. INSERT into database (users table)
// 4. Get the inserted row (with ID)
// 5. Return the User object (now synced with DB)
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => $request->role ?? 'patient',
        ]);
         //API token represents the logged-in user
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user'  => $user,
            'token' => $token,
        ], 201);

//         1. Login/Register
// Laravel:
//   → creates token
//   → sends { user, token }

// React:
//   → stores token
// 2. User makes request (e.g. appointments)
// React:
//   → sends request with token

// Laravel:
//   → reads token
//   → finds matching user
//   → sets auth()->user()

// - If token valid → request continues
// - If token invalid → 401 Unauthorized

// Login:
//   → get token

// Every request:
//   → send token

// Laravel:
//   → verify token
//   → identify user
//   → allow or deny access

// One user can have many tokens:
// Token 1 → Chrome
// Token 2 → Mobile app
// Token 3 → Firefox
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user'  => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }
}