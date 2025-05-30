<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Table;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Reservation>
 */
class ReservationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'costumer_name' => $this->faker->name,
            'costumer_phone' => $this->faker->phoneNumber,
            'reservation_date' => $this->faker->dateTimeBetween('+1 days', '+1 month'),
            'guest_number' => $this->faker->numberBetween(1, 12),
            'status' => $this->faker->randomElement([
                'pending',
                'confirmed',
                'seated',
                'completed',
                'canceled'
            ]),
            'table_id' => Table::factory(),
        ];
    }
}
