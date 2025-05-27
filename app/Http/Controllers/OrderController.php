<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Http\Resources\OrderResource;  
use App\Models\Table;
use App\Models\Product;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();

        $query = Order::query();
        $sortField = request('sort_field', "created_at");
        $sortDirection = request('sort_direction', "desc");

        if(request('status')) {
            $query->where('status', request('status'));
        }

        if($user->role === "bartender"){
            $query->where('status','pending');
        }

        if($user->role === "waiter"){
            $query->where('user_id', $user->id);
        }

        $orders = $query->with(['waiter', 'table', 'items.product'])
                    ->orderBy($sortField, $sortDirection)
                    ->paginate(10)
                    ->onEachSide(1);

        return inertia('Order/Index', [
            'orders' => OrderResource::collection($orders),
            'queryParams'=> request()->query()?: null,
            'success'=> session('success')
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('Order/Create', [
            'tables' => Table::where('status', 'free')->get(),
            'products' => Product::all()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrderRequest $request)
    {
        $data = $request->validated();
        \DB::transaction(function () use ($data) {
            $order = Order::create([
                'user_id' => auth()->user()->id,
                'table_id' => $data['table_id'],
                'total' => 0
            ]);

            $total = 0;

            foreach($data['items'] as $i){
                $product = Product::findOrFail($i['product_id']);
                $lineTotal = $product->price * $i['quantity'];
                $order->items()->create([
                    'product_id' => $product->id,
                    'quantity' => $i['quantity'],
                    'unit_price' => $product->price,
                ]);
                $total += $lineTotal;
            }
            $order->update(['total' => $total]);
            $order->table()->update(['status' => 'occupied']);
        });

        return to_route('order.index')->with('success', 'Order was created');
    }

    public function complete(Order $order){
        $order->update(['status' => 'completed']);

        return to_route('order.index')->with('success', 'Order was completed');
    }

    public function pay(Order $order){
        $order->update(['status' => 'paid']);
        $order->table->update(['status' => 'free']);

        return to_route('order.index')->with('success', 'Order was paid');
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        $order->load(['waiter', 'table', 'items.product']);
        // dd($order->table->name);

        return inertia('Order/Show', [
            'order' => new OrderResource($order)
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order $order)
    {
        $order->load(['items.product']);

        return inertia('Order/Edit', [
            'order' => new OrderResource($order),
            'tables' => Table::where('status', 'free')
                ->orWhere('id', $order->table_id)
                ->get(),
            'products' => Product::all()
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrderRequest $request, Order $order)
    {
        $data = $request->validated();

        \DB::transaction(function () use ($data, $order){
            $oldTableId = $order->table_id;
            $newTableId = $data['table_id'];

            $order->update([
                'table_id' => $data['table_id'],
                'status' => $data['status']
            ]);

            if($oldTableId !== $newTableId){
                Table::where('id', $oldTableId)->update(['status' => 'free']);
                Table::where('id', $newTableId)->update(['status' => 'occupied']);
            }

            $incomingIds = collect($data['items'])
                ->pluck('id')
                ->filter()
                ->all();

            $order->items()
                ->whereNotIn('id', $incomingIds)
                ->delete();

            foreach($data['items'] as $itemData){
                $unitPrice = Product::findOrFail($itemData['product_id'])->price;

                if(!empty($itemData['id'])){
                    $order->items()
                        ->where('id', $itemData['id'])
                        ->update([
                            'product_id'=> $itemData['product_id'],
                            'quantity' => $itemData['quantity'],
                            'unit_price' => $unitPrice
                        ]);
                }else{
                    $order->items()->create([
                        'product_id' => $itemData['product_id'],
                        'quantity' => $itemData['quantity'],
                        'unit_price' => $unitPrice
                    ]);
                }
            }
            
            
            $total = $order->items()
                ->get()
                ->sum(fn($i) => $i->quantity * $i->unit_price);

            $order->update(['total' => $total]);
            

        });

        return to_route('order.index')->with('success', 'Order was updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        //
    }
}
