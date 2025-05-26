<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\OrderItemResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'table'        => [
                'id'     => $this->table->id,
                'number' => $this->table->number,
            ],
            'waiter'       => [
                'id'   => $this->waiter->id,
                'name' => $this->waiter->name,
            ],
            'items'        => OrderItemResource::collection($this->whenLoaded('items')),
            'total'        => number_format($this->total, 2),
            'status'       => $this->status,
            'created_at'   => $this->created_at->toDateTimeString(),
            'updated_at'   => $this->updated_at->toDateTimeString(),
        ];
    }
}
