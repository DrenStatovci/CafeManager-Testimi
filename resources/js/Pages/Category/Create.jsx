import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import TextAreaInput from "@/Components/TextAreaInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";

export default function Create({auth}){
    const {data,setData, post, errors, reset} = useForm({
        name: '',
        description: '',
    })

    const onSubmit = (e) => {
        e.preventDefault();

        post(route('category.store'));
    }

    return(
        <AuthenticatedLayout
            user= {auth.user}
            header= {
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                   Create New Category
                </h2>
            }
        >
        <Head title="Create Catetegory" />

        <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg"> 
                            <form onSubmit={onSubmit} action="" className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">

                                <div className="mt-4">
                                    <InputLabel htmlFor="category_name"
                                        value="Category Name"
                                    />
                                    <TextInput
                                        id = "category_name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        className="mt-1 block w-full"
                                        onChange={e=> setData('name', e.target.value)}
                                    />
                                    <InputError message={errors.name} className="mt-2"/>
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="category_description"
                                        value="Category Description"
                                    />
                                    <TextAreaInput
                                        id = "category_description"
                                        type="text"
                                        name="description"
                                        value={data.description}
                                        className="mt-1 block w-full"
                                        onChange={e=> setData('description', e.target.value)}
                                    />
                                    <InputError message={errors.description} className="mt-2"/>
                                </div>

                                <div className="mt-4 text-right">
                                    <Link
                                        href={route('category.index')}
                                        className="bg-gray-100 py-1 px-3 text-gray-800 rounded shadow 
                                            transition-all hover:bg-gray-200 mr-2"
                                    >
                                        Cancel
                                    </Link>

                                    <button className="bg-emerald-500 py-1 px-3 rounded text-white shadow
                                        transition-all hover:bg-emerald-600">
                                        Create
                                    </button>
                                </div>
                            </form> 
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}