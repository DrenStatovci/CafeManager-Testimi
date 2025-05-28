<?php

namespace App\Http\Controllers;

use App\Http\Resources\ReservationResource;
use App\Models\Reservation;
use App\Models\Table;
use App\Http\Requests\StoreReservationRequest;
use App\Http\Requests\UpdateReservationRequest;

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Reservation::query();

        if(request('status')){
            $query->where('status', request('status'));
        }

        $reservations = $query->with('table')
            ->orderBy('created_at', 'desc')
            ->paginate()
            ->withQueryString();
        
            return inertia('Reservation/Index', [
                'reservations' => ReservationResource::collection($reservations),
                'queryParams'=> request()->query()?: null,
                'success'=> session('success')
            ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('Reservation/Create', [
            'tables' => Table::where('status', 'free')->get()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReservationRequest $request)
    {
        $data = $request->validated();

        \DB::transaction(function () use ($data, &$reservation) {
        $reservation = Reservation::create($data);
        $reservation->table()->update(['status' => 'occupied']);
        });

        return to_route('reservation.index')->with('success', 'Reservation was created');

    }

    /**
     * Display the specified resource.
     */
    public function show(Reservation $reservation)
    {
        $reservation->load('table');

        return inertia('Reservation/Show', [
            'reservation' => new ReservationResource($reservation)
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Reservation $reservation)
    {
        $tables = Table::where('status', 'free')
                    ->orWhere('id', $reservation->table_id)
                    ->get();
        $reservation->load('table');

        return inertia('Reservation/Edit', [
            'reservation' => new ReservationResource($reservation),
            'tables' => $tables,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReservationRequest $request, Reservation $reservation)
    {
        $data = $request->validated();

        $oldTableId = $reservation->table_id;
        $newTableId = $data['table_id'];

        if($newTableId !== $oldTableId){
            Table::where('table_id', $oldTableId)->update(['status' => 'free']);
            Table::where('table_id',$newTableId)->update(['status' => 'occupied']);
        }

        $reservation->update($data);

        return to_route('reservation.index')->where()->with('success', 'Reservation was updated');
       
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reservation $reservation)
    {
        $reservation->table()->update(['status' => 'free']);
        $reservation->delete();

        return to_route('reservation.index')->with('success', 'Reservation was deleted');
    }
}
