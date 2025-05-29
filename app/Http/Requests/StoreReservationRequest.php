<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreReservationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'costumer_name' => ['required','string', 'max:255'],
            'costumer_phone' => ['nullable','string', 'max:20', 'regex:/^\+?[1-9]\d{1,14}$/'],
            'reservation_date' => ['required','date', 'after_or_equal:now'],
            'guest_number' => ['required','integer', 'min:1', 'max:10'],
            'table_id' => ['required', 'integer', 'exists:tables,id'],
            'status' => ['sometimes', Rule::in([
                            'pending',
                            'confirmed',
                            'seated',
                            'canceled'
                        ])]
        ];
    }

    public function messages(): array
    {
        return [
            'costumer_phone.regex' => 'The phone number must be in international E.164 format, e.g. +381641234567.',
        ];
    }
}
