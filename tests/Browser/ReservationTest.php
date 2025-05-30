<?php

namespace Tests\Browser;

use App\Models\User;
use App\Models\Table;
use App\Models\Reservation;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;
use Illuminate\Foundation\Testing\DatabaseMigrations;

class ReservationTest extends DuskTestCase
{
    use DatabaseMigrations;

    protected function uniqueCustomerName($prefix = 'Customer')
    {
        return $prefix . rand(10000, 99999);
    }

    /** @test */
    public function admin_can_create_reservation()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('admin1234')
        ]);

        $table = Table::factory()->create();

        $customerName = $this->uniqueCustomerName();

        $this->browse(function (Browser $browser) use ($admin, $table, $customerName) {
            $browser
                ->loginAs($admin)
                ->visit('/reservation/create')
                ->waitFor('@costumer_name')
                ->type('@costumer_name', $customerName)
                ->type('@costumer_phone', '+123456789')
                ->type('@reservation_date', now()->addDay()->format('Y-m-d\TH:i'. 'AM'))
                ->type('@guest_number', 4)
                ->select('@table_id', $table->id)
                ->press('Create')
                ->waitFor('@reservation-table')
                ->assertPathIs('/reservation')
                ->assertSee($customerName)
                ->screenshot('reservation-create-success');
        });
    }

    /** @test */
    public function admin_can_edit_reservation()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('admin1234')
        ]);
        $table = Table::factory()->create();
        $reservation = Reservation::factory()->create([
            'table_id' => $table->id
        ]);
        $newName = $this->uniqueCustomerName('Edited');

        $this->browse(function (Browser $browser) use ($admin, $reservation, $table, $newName) {
            $browser
                ->loginAs($admin)
                ->visit("/reservation/{$reservation->id}/edit")
                ->waitFor('@costumer_name')
                ->type('@costumer_name', $newName)
                ->type('@costumer_phone', '987654321')
                ->type('@guest_number', '6')
                ->select('@table_id', $table->id)
                ->select('@status', 'confirmed')
                ->press('Update')
                ->waitFor('@reservation-table')
                ->assertPathIs('/reservation')
                ->assertSee($newName)
                ->screenshot('reservation-edit-success');
        });
    }

    /** @test */
    public function admin_can_delete_reservation()
    {
         $admin = User::factory()->create([
            'role' => 'admin',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('admin1234')
        ]);
        $table = Table::factory()->create();
        $reservation = Reservation::factory()->create([
            'table_id' => $table->id
        ]);

        $this->browse(function (Browser $browser) use ($admin, $reservation) {
            $browser
                ->loginAs($admin)
                ->visit('/reservation')
                ->waitFor("@delete-reservation-{$reservation->id}")
                ->press("@delete-reservation-{$reservation->id}")
                ->acceptDialog()
                ->pause(1500)
                ->assertDontSee($reservation->costumer_name)
                ->screenshot('reservation-delete-success');
        });
        
    }
}
