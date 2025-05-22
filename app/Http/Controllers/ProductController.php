<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use Illuminate\Support\Str;
use Storage;


class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Product::query();
        $sortField = request('sort_field', "created_at");
        $sortDirection = request('sort_direction', "desc");

        if(request('name')) {
            $query->where('name', 'like', '%' . request('name') . '%');
        }
        if(request('category_id')) {
            $query->where('category_id', request('category_id'));
        }

        $products = $query
                ->orderBy($sortField, $sortDirection)
                ->paginate(10)
                ->onEachSide(1);

        return inertia('Product/Index', [
            'products' => ProductResource::collection($products),
            'queryParams'=> request()->query()?: null,
            'success'=> session('success')
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Product::class);

        $categories = Category::query()->orderBy('name', 'asc')->get();
        return inertia('Product/Create', [
            'categories' => $categories
        ]);
    }

    /**
     * Store a newly created resource in storage.
     * Run: php artisan storage:link for the public/storage to be linked to the storage/app/public folder
     */
    public function store(StoreProductRequest $request)
    {
        $data = $request->validated();
        /** @var $image Illuminate\Http\UploadedFile     */

        $image = $data['image'] ?? null;

        if($image){
            $data['image_path'] = $image->store('product/'. Str::random() ,'public');
        }

        Product::create($data);
        return to_route('product.index')->with('success', 'Product created successfully');

    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        $this->authorize('update', $product);
        $categories = Category::query()->orderBy('name', 'asc')->get();
        return inertia('Product/Edit', [
            'product' => $product,
            'categories' => $categories
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        $this->authorize('update', $product);

        $data = $request->validated();
        $image = $data['image'] ?? null;

        if($image){
            if($product->image_path){
                Storage::disk('public')->deleteDirectory(dirname($product->image_path));
            }
            $data['image_path'] = $image->store('product/'. Str::random() ,'public');
        }

        $product->update($data);
        return to_route('product.index')->with('success', 'Product updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $this->authorize('delete', $product);
        $product->delete();
        if($product->image_path){
            Storage::disk('public')->deleteDirectory(dirname($product->image_path));
        }

        return to_route('product.index')->with('success', 'Product deleted successfully');
    }
}
