<?php

namespace App\Repositories;

class FileRepository implements IRepository
{
    protected string $filePath;

    public function __construct()
    {
        $this->filePath = base_path('docs/appointments.csv');
    }

    public function getAll(): array
    {
        $rows = [];
        if (!file_exists($this->filePath)) {
            return $rows;
        }

        $handle = fopen($this->filePath, 'r');
        $header = fgetcsv($handle);

        while (($row = fgetcsv($handle)) !== false) {
            $rows[] = array_combine($header, $row);
        }

        fclose($handle);
        return $rows;
    }

    public function getById($id): ?array
    {
        foreach ($this->getAll() as $row) {
            if ((int)$row['id'] === (int)$id) {
                return $row;
            }
        }
        return null;
    }

    public function add(array $data): array
    {
        $all = $this->getAll();
        $data['id'] = count($all) > 0
            ? max(array_column($all, 'id')) + 1
            : 1;

        $handle = fopen($this->filePath, 'a');
        fputcsv($handle, $data);
        fclose($handle);

        return $data;
    }

    public function save($model): bool
    {
        $all = $this->getAll();
        $updated = false;

        foreach ($all as &$row) {
            if ((int)$row['id'] === (int)$model['id']) {
                $row = array_merge($row, $model);
                $updated = true;
                break;
            }
        }

        if ($updated) {
            $this->writeAll($all);
        }

        return $updated;
    }

    public function delete($id): bool
    {
        $all = $this->getAll();
        $filtered = array_filter($all, fn($row) => (int)$row['id'] !== (int)$id);

        if (count($filtered) === count($all)) {
            return false;
        }

        $this->writeAll(array_values($filtered));
        return true;
    }

    private function writeAll(array $rows): void
    {
        if (empty($rows)) {
            return;
        }

        $handle = fopen($this->filePath, 'w');
        fputcsv($handle, array_keys($rows[0]));

        foreach ($rows as $row) {
            fputcsv($handle, $row);
        }

        fclose($handle);
    }
}