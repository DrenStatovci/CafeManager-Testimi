import Pagination from "@/Components/Pagination";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from '@inertiajs/react';
import TableHeading from "@/Components/TableHeading";

export default function Index({auth,products, queryParams = null, success}){
    queryParams = queryParams || {};
    const searchFieldChanged = (name, value) => {
        if(value){
            queryParams[name] = value;
        }else{
            delete queryParams[name];
        }

        router.get(route('product.index'), queryParams)
    }
    const onKeyPress = (name, e) =>{
        if(e.key !== 'Enter')return;
        searchFieldChanged(name, e.target.value);
    }

    const sortChanged = (name) => {
        if(name === queryParams.sort_field){
            if(queryParams.sort_direction === 'asc'){
                queryParams.sort_direction = 'desc'
            }else{
                queryParams.sort_direction = 'asc'
            }
        }else{
            queryParams.sort_field = name;
            queryParams.sort_direction = 'asc'
        }

        router.get(route('product.index', queryParams));
    }

    const deleteProduct = (product) => {
        if(!window.confirm('Are you sure you want delete this product?')){
            return;
        }
            router.delete(route('product.destroy', product.id))
    }

    return(
        <AuthenticatedLayout
         user={auth.user}
         header={<div className="flex justify-between text-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Products</h2>
                    <Link href={route('product.create')} 
                    className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">
                        Add New
                    </Link>
                </div>}>

            <Head title="Products"/>

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
                                            <TableHeading 
                                                name="id" 
                                                sort_field={queryParams.sort_field}
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                            >
                                                ID
                                            </TableHeading>
                                            <th className="px-3 py-2">Image</th>
                                            <TableHeading 
                                                name="name" 
                                                sort_field={queryParams.sort_field}
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                            >
                                                Name
                                            </TableHeading>
                                           
                                            <TableHeading 
                                                name="category_id" 
                                                sort_field={queryParams.sort_field}
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                            >
                                                Category
                                            </TableHeading>
                                            <th className="px-3 py-2">Price</th>
                                            
                                            <TableHeading 
                                                name="created_at" 
                                                sort_field={queryParams.sort_field}
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                            >
                                                Created At
                                            </TableHeading>
                                            <th className="px-3 py-2">Actions</th>
                                        </tr>
                                    </thead>

                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50
                                                    dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                        <tr className="text-nowrap">
                                            <th className="px-3 py-2"></th>
                                            <th className="px-3 py-2"></th>
                                            <th className="px-3 py-2">
                                                <TextInput 
                                                    className="w-full"
                                                    defaultValue={queryParams.name}
                                                    placeholder="Product Name"
                                                    onBlur={e=> searchFieldChanged('name', e.target.value)}
                                                    onKeyPress={e=> onKeyPress('name', e)} 
                                                />
                                            </th>
                                            <th className="px-3 py-2"></th>
                                            <th className="px-3 py-2"></th>
                                            <th className="px-3 py-2"></th>
                                            <th className="px-3 py-2"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.data.map((product)=>
                                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={product.id}>
                                            <td className="px-3 py-2">{product.id}</td>
                                            <td className="px-3 py-2">
                                                <img src={product.image_path}  alt="" className="w-24 h-16" />
                                            </td>
                                            <td className="px-3 py-2 text-white text-nowrap hover:underline">
                                               <Link href={route('product.show', product.id)}>{product.name}</Link> 
                                            </td>
                                            
                                            
                                            <td className="px-3 py-2">{product.category.name}</td>
                                            <td className="px-3 py-2">{product.price}€</td>
                                            <td className="px-3 py-2">{product.created_at}</td>
                                            <td className="px-3 py-2 text-nowrap">
                                                <Link
                                                    href={route('product.edit', product.id)}
                                                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1" >
                                                        Edit
                                                </Link>
                                                <button
                                                    onClick={(e)=> deleteProduct(product)}
                                                    className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1" >
                                                        Delete  
                                                </button>
                                            </td>
                                        </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination links={products.meta.links}></Pagination>
                        </div>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    )
}