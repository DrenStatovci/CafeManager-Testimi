<?php

namespace App\Http\Resources;

use Carbon\Carbon; 
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProductResource extends JsonResource
{

    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'image_path' => $this->image_path? Storage::url($this->image_path) : null,
            'category_id' => $this->category_id,
            'category' => new CategoryResource($this->category),
            'created_at' => (new Carbon($this->created_at))->format('d-m-Y')
        ];
    }
}
