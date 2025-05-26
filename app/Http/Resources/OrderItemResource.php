<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'product'     => [
                'id'    => $this->product->id,
                'name'  => $this->product->name,
                'price' => number_format($this->unit_price, 2),
            ],
            'quantity'    => $this->quantity,
            'unit_price'  => number_format($this->unit_price, 2),
            'subtotal'    => number_format($this->unit_price * $this->quantity, 2),
        ];
    }
}
