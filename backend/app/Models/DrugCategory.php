<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DrugCategory extends Model
{
    protected $fillable = ['name', 'icon'];

    public function drugs()
    {
        return $this->hasMany(Drug::class, 'category_id');
    }
}