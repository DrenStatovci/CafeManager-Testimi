<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;


class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', Category::Class);
        $query = Category::query();
        $categories = $query->paginate(10)->onEachSide(1);
        // dd($categories);
        return inertia('Admin/Category/Index', [
                'categories' => CategoryResource::collection($categories),
                'success' => session('success')    
        ]);
        
    }

    /*
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Category::class);
        return inertia('Admin/Category/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoryRequest $request)
    {
        $this->authorize('create', Category::class);
        $data = $request->validated();
        Category::create($data);

        return to_route('category.index')->with('success', 'Project was created');;
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        $this->authorize('update', $category);
        return inertia('Admin/Category/Edit', [
                'category' => new CategoryResource($category),
                ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $this->authorize('update', $category);
        $data = $request->validated();
        $category->update($data);

        return to_route('category.index')->with('success', 'Project was updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        $this->authorize('delete', $category);

        $name = $category->name;
        $category->delete();
        return to_route('category.index')->with('success', "Project \"$name\" was deleted");
    }
}
