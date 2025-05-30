<?php

namespace Tests\Browser;

use App\Models\User;
use App\Models\Table;
use App\Models\Product;
use App\Models\Category;
use App\Models\Order;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use function Laravel\Prompts\pause;

class OrderTest extends DuskTestCase
{
    use DatabaseMigrations;

/** @test */
// public function admin_can_create_order_with_multiple_items()
// {
//     $admin = User::factory()->create([
//         'role' => 'admin',
//         'email' => 'admin@gmail.com',
//         'password' => bcrypt('admin1234')
//     ]);
//     $table = Table::factory()->create();
//      $category = Category::factory()->create();
//     $products = Product::factory()->count(2)->create([
//         'category_id' => $category->id]);

//     $this->browse(function (Browser $browser) use ($admin, $table, $products) {
//         $browser
//             ->loginAs($admin)
//             ->visit('/order/create')
//             ->waitFor('@table_id')
//             ->select('@table_id', $table->id)
//             ->waitFor('@product_id_0')
//             ->select('@product_id_0', $products[0]->id)
//             ->type('@quantity_0', value: 2)
//             ->press('@add-item')
//             ->pause(500)
//             ->select('@product_id_1', $products[1]->id)
//             ->type('@quantity_1', 1)
//             ->press('Create Order')
//             ->waitForLocation('/order') 
//             ->assertSee($table->number)
//             ->assertSee($products[0]->name)
//             ->assertSee($products[1]->name)
//             ->screenshot('order-create-success');
//     });
// }

  /** @test */
    public function admin_can_edit_order_with_multiple_items()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('admin1234')
        ]);
        $table = Table::factory()->create();
        $category = Category::factory()->create();
        $products = Product::factory()->count(2)->create([
            'category_id' => $category->id
        ]);
        // Create the order with items
        $order = Order::factory()->create([
            'table_id' => $table->id,
            'user_id' => $admin->id
        ]);
        // You may have to manually create order items, depending on your schema
        $order->items()->createMany([
            ['product_id' => $products[0]->id, 'quantity' => 2, 'unit_price' => $products[0]->price],
            ['product_id' => $products[1]->id, 'quantity' => 1, 'unit_price' => $products[1]->price],
        ]);

        $this->browse(function (Browser $browser) use ($admin, $order, $table, $products) {
            $browser
                ->loginAs($admin)
                ->visit("/order/{$order->id}/edit")
                ->waitFor('@table_id')
                ->select('@table_id', $table->id)
                ->waitFor('@product_id_0')
                ->select('@product_id_0', $products[1]->id)
                ->type('@quantity_0', 3)
                ->press('@remove-item-1')
                ->press('Update')
                ->waitFor("@order-table")
                ->assertPathIs('/order')
                ->assertSee($table->number)
                ->assertSee($admin->name)
                ->screenshot('order-edit-success');
        });
    }

}
