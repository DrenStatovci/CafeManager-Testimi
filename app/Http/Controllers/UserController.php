<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', User::Class);
        $query = User::query()->paginate(10)->onEachSide(1);
        $users = $query;

        return inertia('Admin/User/Index', [
            'users' => UserResource::collection($users),
            'success' => session('success')
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', User::Class);
        return inertia('Admin/User/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $this->authorize('create', User::class);
        $data = $request->validated();
        $data['password'] = bcrypt($data['password']);
        User::create($data);

        return to_route('user.index')->with('success', 'User was created');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        return inertia('Admin/User/Edit', [
            'user' => new UserResource($user)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $this->authorize('update', $user);

        $data = $request->validated();
        if ($request->filled('password')) {
        $data['password'] = bcrypt($data['password']);
    } else {
        unset($data['password']); 
        unset($data['password_confirmation']);
    }
        $user->update($data);
        return to_route('user.index')->with('success', 'User was updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $this->authorize('delete', $user);
        $name = $user->name;
        $user->delete();
        return to_route('user.index')->with('success', "User \"$name\" was deleted");
    }
}
