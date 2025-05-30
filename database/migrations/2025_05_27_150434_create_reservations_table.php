<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();

            $table->string('costumer_name');
            $table->string('costumer_phone');
            $table->dateTime('reservation_date');
            $table->unsignedInteger('guest_number');

            $table->enum('status', [
                'pending',
                'confirmed',
                'seated',
                'completed',
                'canceled'
            ]);

            $table->foreignId('table_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
