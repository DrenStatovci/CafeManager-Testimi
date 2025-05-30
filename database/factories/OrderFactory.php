<?php
namespace Database\Factories;

use App\Models\Order;
use App\Models\Table;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition()
    {
        return [
            'table_id' => Table::factory(),
            'user_id'  => User::factory(),
            'status'   => $this->faker->randomElement(['pending', 'completed', 'paid']),
            'total'    => $this->faker->randomFloat(2, 5, 100),
        ];
    }

    public function withItems($products = null, $count = 2)
    {
        return $this->afterCreating(function (Order $order) use ($products, $count) {
            $products = $products ?: \App\Models\Product::factory()->count($count)->create();
            foreach ($products as $product) {
                $order->items()->create([
                    'product_id' => $product->id,
                    'quantity' => $this->faker->numberBetween(1, 3),
                ]);
            }
        });
    }
}
