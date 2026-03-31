<?php

namespace App\Repositories;

use App\Models\User;

class UserRepository implements IRepository
{
    public function getAll()
    {
        return User::all();
    }

    public function getById($id)
    {
        return User::find($id);
    }

    public function add(array $data)
    {
        return User::create($data);
    }

    public function save($model)
    {
        return $model->save();
    }

    public function delete($id)
    {
        $model = $this->getById($id);
        if ($model) {
            return $model->delete();
        }
        return false;
    }
}