<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'costumer_name',
        'costumer_phone',
        'guest_number',
        'reservation_date',
        'status',
        'table_id'
    ];

     protected $casts = [
        'reservation_date' => 'datetime',
    ];

    public function table(){
        return  $this->belongsTo(Table::class);
    }
}
