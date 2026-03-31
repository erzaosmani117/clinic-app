<?php

namespace App\Services;

use App\Repositories\FileRepository;

class AppointmentService
{
    protected FileRepository $repository;

    public function __construct(FileRepository $repository)
    {
        $this->repository = $repository;
    }

    // List with optional filtering by status
    public function list(?string $status = null): array
    {
        $all = $this->repository->getAll();

        if ($status) {
            $all = array_filter(
                $all,
                fn($row) => $row['status'] === $status
            );
        }

        return array_values($all);
    }

    // Add with validation
    public function add(array $data): array|string
    {
        if (empty($data['patient_name'])) {
            return 'Patient name cannot be empty.';
        }

        if (empty($data['doctor_name'])) {
            return 'Doctor name cannot be empty.';
        }

        if (empty($data['date'])) {
            return 'Date cannot be empty.';
        }

        $data['status'] = 'confirmed';
        return $this->repository->add($data);
    }

    // Find by id
    public function findById($id): ?array
    {
        return $this->repository->getById($id);
    }

    // Update appointment
    public function update($id, array $data): bool|string
    {
        $existing = $this->repository->getById($id);

        if (!$existing) {
            return 'Appointment not found.';
        }

        $updated = array_merge($existing, $data, ['id' => $id]);
        return $this->repository->save($updated);
    }

    // Delete appointment
    public function delete($id): bool|string
    {
        $existing = $this->repository->getById($id);

        if (!$existing) {
            return 'Appointment not found.';
        }

        return $this->repository->delete($id);
    }
}