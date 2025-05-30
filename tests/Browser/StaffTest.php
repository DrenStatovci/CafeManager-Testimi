<?php

namespace Tests\Browser;

use App\Models\User;
use Illuminate\Support\Sleep;
use Laravel\Dusk\Browser;
use Monolog\Handler\SlackHandler;
use Tests\DuskTestCase;
use Illuminate\Foundation\Testing\DatabaseMigrations;

class StaffTest extends DuskTestCase
{
    use DatabaseMigrations;

    /** @test */
    public function admin_can_create_staff()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('admin1234')
        ]);

        $this->browse(function (Browser $browser) use ($admin) {
            $browser
                ->loginAs($admin)
                ->visit('/user/create')
                ->waitFor('@name')
                ->type('@name', 'Test Staff')
                ->type('@phone_number', '+38340123456')
                ->type('@email', 'test1@gmail.com')
                ->type('@password', '12345678')
                ->type('@password_confirmation', '12345678')
                ->select('@role', 'waiter')
                ->press('Create')
                ->waitFor("@user-table")
                ->assertPathIs('/user')
                ->assertSee('Test Staff')
                ->screenshot('user-create-success');

        });
    }

     /** @test */
    public function admin_can_edit_staff()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('admin1234')
        ]);

        $staff = User::factory()->create([
            'phone_number' => '+38340123456',
            'role' => 'waiter'
        ]);

        // $newName = 'Updated Staff ' . rand(1000, 9999);

        $this->browse(function (Browser $browser) use ($admin, $staff) {
            $browser
                ->loginAs($admin)
                ->visit("/user/{$staff->id}/edit")
                ->waitFor('@name')
                ->type('@name', 'TestUpdated')
                ->select('@role', 'bartender')
                ->press('Update') // change if your button text differs
                ->waitFor('@user-table')
                ->assertPathIs('/user')
                ->pause(2000)
                ->assertSee('TestUpdated')
                ->screenshot('user-edit-success');
        });
    }

    /** @test */
    public function admin_can_delete_staff()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('admin1234')
        ]);

        $staff = User::factory()->create([
            'role' => 'waiter',
            'phone_number' => '+38340123456',
        ]);

        $this->browse(function (Browser $browser) use ($admin, $staff) {
            $browser
                ->loginAs($admin)
                ->visit('/user')
                ->waitFor("@delete-user-{$staff->id}")
                ->press("@delete-user-{$staff->id}")
                ->acceptDialog()
                ->pause(1500)
                ->assertSee($staff->name)
                ->screenshot('user-delete-success');
        });
    }
}
