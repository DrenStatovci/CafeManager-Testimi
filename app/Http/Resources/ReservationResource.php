<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReservationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'costumer_name' => $this->costumer_name,
            'costumer_phone' => $this->costumer_phone,
            'reservation_date' => $this->reservation_date->toDateTimeString(),
            'guest_number' => $this->guest_number,
            'status' => $this->status,
            'table' => [
                'id' => $this->table->id,
                'number' => $this->table->number,
            ],
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
            
        ];
    }
}
