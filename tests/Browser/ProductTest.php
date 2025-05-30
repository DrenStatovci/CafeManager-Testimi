<?php

namespace Tests\Browser;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use function Laravel\Prompts\pause;

class ProductTest extends DuskTestCase
{
    use DatabaseMigrations;

    protected function uniqueProductName($prefix = 'Produkt')
    {
        return $prefix . rand(10000, 99999);
    }

    /** @test */
    public function admin_can_create_product()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('admin1234')
        ]);
        $category = Category::factory()->create();

        $productName = $this->uniqueProductName();

        $this->browse(function (Browser $browser) use ($admin, $category, $productName) {
            $browser
                ->loginAs($admin)
                ->visit('/product/create')
                ->waitFor('@name')
                ->type('@name', $productName)
                ->type('@description', 'Pije freskuese')
                ->type('@price', '1.99')
                ->select('@category_id', $category->id)
                ->attach('@image', __DIR__.'/screenshots/produkt1.png')
                ->press('Create')
                ->waitFor('@product-table')
                ->assertPathIs('/product')
                ->assertSee($productName)
                ->screenshot('product-create-success');
        });
    }

    /** @test */
    public function admin_can_edit_product()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('admin1234')
        ]);
        $category = Category::factory()->create();
        $product = Product::factory()->create([
            'category_id' => $category->id
        ]);
        $newName = $this->uniqueProductName('Edituar');

        $this->browse(function (Browser $browser) use ($admin, $product, $category, $newName) {
            $browser
                ->loginAs($admin)
                ->visit("/product/{$product->id}/edit")
                ->waitFor('@name')
                ->type('@name', $newName)
                ->type('@price', '2.49')
                ->select('@category_id', $category->id)
                ->press('Update')
                ->waitFor('@product-table')
                ->assertPathIs('/product')
                ->assertSee($newName)
                ->screenshot('product-edit-success');
        });
    }

    /** @test */
    public function admin_can_delete_product()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('admin1234')
        ]);
        $category = Category::factory()->create();
        $product = Product::factory()->create([
            'name' => $this->uniqueProductName('DeleteMe'),
            'category_id' => $category->id
        ]);

        $this->browse(function (Browser $browser) use ($admin, $product) {
            $browser
                ->loginAs($admin)
                ->visit('/product')
                ->waitFor("@delete-product-{$product->id}")
                ->press("@delete-product-{$product->id}")
                ->acceptDialog()
                ->pause(1500)
                ->assertDontSee($product->name)
                ->screenshot('product-delete-success');
        });
    }
} 
