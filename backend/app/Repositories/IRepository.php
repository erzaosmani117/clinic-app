<?php

namespace App\Repositories;

interface IRepository
{
    public function getAll();
    public function getById($id);
    public function add(array $data);
    public function save($model);
}