<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\ChatMessage;
use App\Models\UserNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class ChatController extends Controller
{
    public function conversations(Request $request)
    {
        $user = $request->user();

        $appointments = Appointment::query()
            ->where(function ($query) use ($user) {
                $query->where('patient_id', $user->id)
                    ->orWhere('doctor_id', $user->id);
            })
            ->with([
                'patient:id,name,email',
                'doctor:id,name,email,specialty',
                'lastChatMessage',
            ])
            ->withCount([
                'chatMessages as unread_count' => fn ($query) => $query
                    ->where('sender_id', '!=', $user->id)
                    ->whereNull('read_at'),
            ])
            ->orderByDesc('date')
            ->get()
            ->map(function ($appointment) use ($user) {
                $lastMessage = $appointment->lastChatMessage;
                $otherPerson = $user->role === 'doctor' ? $appointment->patient : $appointment->doctor;

                return [
                    'id' => $appointment->id,
                    'date' => $appointment->date,
                    'time' => $appointment->time,
                    'status' => $appointment->status,
                    'other_person' => $otherPerson,
                    'last_message' => $lastMessage,
                    'unread_count' => $appointment->unread_count,
                ];
            });

        return response()->json($appointments);
    }

    public function messages(Request $request, Appointment $appointment)
    {
        $this->authorizeParticipant($request, $appointment);

        ChatMessage::where('appointment_id', $appointment->id)
            ->where('sender_id', '!=', $request->user()->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        $messages = ChatMessage::where('appointment_id', $appointment->id)
            ->with('sender:id,name,role')
            ->orderBy('created_at')
            ->get();

        return response()->json($messages);
    }

    public function store(Request $request, Appointment $appointment)
    {
        $this->authorizeParticipant($request, $appointment);

        $validated = $request->validate([
            'message' => 'nullable|string|max:3000',
            'attachment' => 'nullable|file|max:10240|mimes:pdf,jpg,jpeg,png,doc,docx,txt',
        ]);

        if (!$request->filled('message') && !$request->hasFile('attachment')) {
            throw ValidationException::withMessages([
                'message' => 'Write a message or attach a file before sending.',
            ]);
        }

        $attachment = $request->file('attachment');
        $path = $attachment ? $attachment->store('chat-attachments') : null;

        $message = ChatMessage::create([
            'appointment_id' => $appointment->id,
            'sender_id' => $request->user()->id,
            'message' => $validated['message'] ?? null,
            'attachment_path' => $path,
            'attachment_name' => $attachment?->getClientOriginalName(),
            'attachment_mime' => $attachment?->getClientMimeType(),
            'attachment_size' => $attachment?->getSize(),
        ])->load('sender:id,name,role');

        $recipientId = $appointment->patient_id === $request->user()->id
            ? $appointment->doctor_id
            : $appointment->patient_id;

        UserNotification::create([
            'user_id' => $recipientId,
            'title' => 'New care message',
            'message' => $request->user()->name.' sent a message about your appointment on '.$appointment->date.'.',
            'type' => 'chat',
            'data' => ['appointment_id' => $appointment->id, 'message_id' => $message->id],
        ]);

        return response()->json($message, 201);
    }

    public function download(Request $request, ChatMessage $message)
    {
        $appointment = $message->appointment;
        $this->authorizeParticipant($request, $appointment);

        if (!$message->attachment_path || !Storage::exists($message->attachment_path)) {
            return response()->json(['message' => 'Attachment not found.'], 404);
        }

        return Storage::download($message->attachment_path, $message->attachment_name);
    }

    private function authorizeParticipant(Request $request, Appointment $appointment): void
    {
        $userId = $request->user()->id;

        abort_unless(
            $appointment->patient_id === $userId || $appointment->doctor_id === $userId,
            403,
            'You do not have access to this conversation.'
        );
    }
}
