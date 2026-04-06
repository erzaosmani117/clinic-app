<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        return response()->json($request->user());
    }

    public function update(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'patient') {
            $request->validate([
                'name'       => 'sometimes|string|max:255',
                'age_months' => 'sometimes|integer|min:0|max:216',
                'weight_kg'  => 'sometimes|numeric|min:0.5|max:150',
                'allergies'  => 'sometimes|nullable|string',
            ]);

            $user->update($request->only(['name', 'age_months', 'weight_kg', 'allergies']));

        } else if ($user->role === 'doctor') {
            $request->validate([
                'name'      => 'sometimes|string|max:255',
                'specialty' => 'sometimes|string|max:255',
                'bio'       => 'sometimes|nullable|string',
            ]);

            $user->update($request->only(['name', 'specialty', 'bio']));
        }

        return response()->json([
            'message' => 'Profile updated successfully.',
            'user'    => $user,
        ]);
    }
}