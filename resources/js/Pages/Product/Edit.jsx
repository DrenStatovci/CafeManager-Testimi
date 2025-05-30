import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import SelectInput from "@/Components/SelectInput";
import TextAreaInput from "@/Components/TextAreaInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";

export default function Edit({auth,product, categories}){
    const {data,setData, post, errors, reset} = useForm({
        image: '',
        name: product.name|| '',
        description: product.description || '',
        category_id: product.category_id || '',
        price: product.price || '',
        _method: "PUT"
    })

    const onSubmit = (e) => {
        e.preventDefault();

        post(route('product.update', product.id));
    }

    return(
        <AuthenticatedLayout
            user= {auth.user}
            header= {
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                   Edit Product
                </h2>
            }
        >
        <Head title="Edit Product" />

        <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg"> 
                            <form onSubmit={onSubmit} action="" className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">

                                <div>
                                    <InputLabel htmlFor="prduct_image_path"
                                        value="Product Image"
                                    />
                                    <TextInput
                                        id = "product_image_path"
                                        type="file"
                                        name="image"
                                        dusk="image"
                                        className="mt-1 block w-full"
                                        onChange={e=> setData('image', e.target.files[0])}
                                    />
                                    <InputError message={errors.image} className="mt-2"/>
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="product_name"
                                        value="Product Name"
                                    />
                                    <TextInput
                                        id = "product_name"
                                        type="text"
                                        name="name"
                                        dusk="name"
                                        value={data.name}
                                        className="mt-1 block w-full"
                                        onChange={e=> setData('name', e.target.value)}
                                    />
                                    <InputError message={errors.name} className="mt-2"/>
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="product_description"
                                        value="Product Description"
                                    />
                                    <TextAreaInput
                                        id = "product_description"
                                        type="text"
                                        name="description"
                                        dusk="description"
                                        value={data.description}
                                        className="mt-1 block w-full"
                                        onChange={e=> setData('description', e.target.value)}
                                    />
                                    <InputError message={errors.description} className="mt-2"/>
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="product_price"
                                        value="Product Price"
                                    />
                                    <TextInput
                                        id = "product_price"
                                        type="number"
                                        name="price"
                                        dusk="price"
                                        value={data.price}
                                        className="mt-1 block w-full"
                                        onChange={e=> setData('price', e.target.value)}
                                    />
                                    <InputError message={errors.price} className="mt-2"/>
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="product_category_id"
                                        value="Project Category"
                                    />
                                    <SelectInput
                                        id="product_category"
                                        name="category_id"
                                        dusk="category_id"
                                        value={data.category_id}
                                        className="mt-1 block w-full"
                                        onChange={e => setData('category_id', e.target.value)}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((category)=>
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        )}
                                    </SelectInput>
                                    <InputError message={errors.category} className="mt-2"/>
                                </div>

                                <div className="mt-4 text-right">
                                    <Link
                                        href={route('product.index')}
                                        className="bg-gray-100 py-1 px-3 text-gray-800 rounded shadow 
                                            transition-all hover:bg-gray-200 mr-2"
                                    >
                                        Cancel
                                    </Link>

                                    <button className="bg-emerald-500 py-1 px-3 rounded text-white shadow
                                        transition-all hover:bg-emerald-600">
                                        Update
                                    </button>
                                </div>
                            </form> 
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}