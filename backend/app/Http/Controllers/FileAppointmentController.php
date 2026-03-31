<?php

namespace App\Http\Controllers;

use App\Services\AppointmentService;
use App\Repositories\FileRepository;
use Illuminate\Http\Request;

class FileAppointmentController extends Controller
{
    protected AppointmentService $service;

    public function __construct()
    {
        $this->service = new AppointmentService(new FileRepository());
    }

    public function index(Request $request)
    {
        $status = $request->query('status');
        return response()->json($this->service->list($status));
    }

    public function show($id)
    {
        $result = $this->service->findById($id);
        if (!$result) {
            return response()->json(['message' => 'Not found'], 404);
        }
        return response()->json($result);
    }

    public function store(Request $request)
    {
        $result = $this->service->add($request->all());
        if (is_string($result)) {
            return response()->json(['message' => $result], 422);
        }
        return response()->json($result, 201);
    }

    public function update(Request $request, $id)
    {
        $result = $this->service->update($id, $request->all());
        if (is_string($result)) {
            return response()->json(['message' => $result], 422);
        }
        return response()->json(['message' => 'Updated successfully']);
    }

    public function destroy($id)
    {
        $result = $this->service->delete($id);
        if (is_string($result)) {
            return response()->json(['message' => $result], 404);
        }
        return response()->json(['message' => 'Deleted successfully']);
    }
}