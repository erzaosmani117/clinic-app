<?php

namespace App\Repositories;

use App\Models\Appointment;

class AppointmentRepository implements IRepository
{
    public function getAll()
    {
        return Appointment::all();
    }

    public function getById($id)
    {
        return Appointment::find($id);
    }

    public function add(array $data)
    {
        return Appointment::create($data);
    }

    public function save($model)
    {
        return $model->save();
    }
}