<?php

namespace App\Http\Controllers;

use App\Models\UserNotification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = UserNotification::where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->limit(30)
            ->get();

        return response()->json($notifications);
    }

    public function markRead(Request $request, $id)
    {
        $notification = UserNotification::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        if (!$notification->read_at) {
            $notification->read_at = now();
            $notification->save();
        }

        return response()->json([
            'message' => 'Notification marked as read.',
            'notification' => $notification,
        ]);
    }
}
