import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from '@inertiajs/react';
import { USER_ROLE_TEXT_MAP } from "@/constants";

export default function Index({auth,users, success}){
    const deleteUser= ($user) => {
        if(!window.confirm('Are you sure you want to delete this user?')) return;
        router.delete(route('user.destroy', $user.id));
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<div className="flex justify-between text-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Users</h2>
                    <Link href={route('user.create')} 
                    className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">
                        Add New
                    </Link>
                </div>}
        >

        <Head title="Users" />

        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                {success && 
                    (<div className="bg-emerald-500 py-2 px-4 text-white rounded ,mb-4">
                        {success}
                    </div>
                )}  
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                        <div className="overflow-auto">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500
                                            dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50
                                                dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                    <tr className="text-nowrap">
                                        <th className="px-3 py-2">ID</th>
                                        <th className="px-3 py-2">Name</th>
                                        <th className="px-3 py-2">Email</th>
                                        <th className="px-3 py-2">Phone Number</th>
                                        <th className="px-3 py-2">Role</th>
                                        <th className="px-3 py-2">Actions</th>
                                    </tr>
                                </thead>
    
                                {/* <thead className="text-xs text-gray-700 uppercase bg-gray-50
                                                dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                    <tr className="text-nowrap">
                                        <th className="px-3 py-2"></th>
                                        <th className="px-3 py-2"></th>
                                        <th className="px-3 py-2">
                                            <TextInput 
                                                className="w-full"
                                                defaultValue={queryParams.name}
                                                placeholder="Project Name"
                                                onBlur={e=> searchFieldChanged('name', e.target.value)}
                                                onKeyPress={e=> onKeyPress('name', e)} 
                                            />
                                        </th>
                                        <th className="px-3 py-2">
                                            <SelectInput className="w-full"
                                                onChange={e=> searchFieldChanged('status', e.target.value )}
                                                defaultValue={queryParams.status}>
                                                <option value="">Select Status</option>
                                                <option value="pending">Pending</option>
                                                <option value="in_progress">In Progress</option>
                                                <option value=" completed">Completed</option>
                                            </SelectInput>
                                        </th>
                                        <th className="px-3 py-2"></th>
                                        <th className="px-3 py-2"></th>
                                        <th className="px-3 py-2"></th>
                                        <th className="px-3 py-2"></th>
                                    </tr>
                                </thead> */}
                                <tbody>
                                    {users.data.map((user)=>
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={user.id}>
                                        <td className="px-3 py-2">{user.id}</td>
                                        <td className="px-3 py-2 text-white text-nowrap hover:underline">
                                           <Link href={route('user.show', user.id)}>{user.name}</Link> 
                                        </td>
                                        <td className="px-3 py-2">{user.email}</td>
                                        <td className="px-3 py-2">{user.phone_number}</td>
                                        <td className="px-3 py-2">
                                            <span>
                                                {USER_ROLE_TEXT_MAP[user.role]}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 text-nowrap">
                                            <Link
                                                href={route('user.edit', user.id)}
                                                className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1" >
                                                    Edit
                                            </Link>
                                            {user.role !== 'admin' &&
                                                <button
                                                onClick={(e)=> deleteUser(user)}
                                                className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1" >
                                                    Delete  
                                            </button>}
                                        </td>
                                    </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <Pagination links={users.meta.links} />
                    </div>
                </div>
            </div>
        </div>
        </AuthenticatedLayout>
    );
}