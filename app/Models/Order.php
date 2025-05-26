<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    public $fillable = [
        'table_id',
        'user_id',
        'status',
        'total',
    ];

    public function waiter(){
        return $this->belongsTo(User::class, 'user_id');
    }

    public function table(){
        return $this->belongsTo(Table::class);   
    }

    public function items(){
        return $this->hasMany(OrderItem::class);
    }
}
