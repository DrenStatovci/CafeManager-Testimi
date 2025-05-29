<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\User;

class StoreUserRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'string', 'email:rfc,dns,spoof', 'max:255', 'unique:'.User::class],
            'phone_number' => ['required', 'string', 'max:255', 'regex:/^\+?[1-9]\d{1,14}$/'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['required', 'in:admin,waiter,bartender'], 
        ];
    }

    public function messages(): array
    {
        return [
            'phone_number.regex' => 'The phone number must be in international E.164 format, e.g. +381641234567.',
        ];
    }
}
