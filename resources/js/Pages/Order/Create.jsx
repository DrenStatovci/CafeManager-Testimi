import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import SelectInput from "@/Components/SelectInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";

export default function Create({ auth, tables, products }) {
  const { data, setData, post, errors, processing, reset } = useForm({
    table_id: "",
    items: [
      { product_id: "", quantity: 1 }
    ],
  });

  const addItem = () => {
    setData("items", [
      ...data.items,
      { product_id: "", quantity: 1 }
    ]);
  };

  const removeItem = (index) => {
    const updated = data.items.filter((_, i) => i !== index);
    setData("items", updated);
  };

  const updateItem = (index, field, value) => {
    const updated = data.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setData("items", updated);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    post(route("order.store"), {
      onSuccess: () => reset()
    });
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Create New Order
        </h2>
      }
    >
      <Head title="Create Order" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <form
              onSubmit={onSubmit}
              className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg"
            >
              {/* Table Selection */}
              <div>
                <InputLabel htmlFor="table_id" value="Table" />
                <SelectInput
                  id="table_id"
                  name="table_id"
                  value={data.table_id}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("table_id", e.target.value)}
                >
                  <option value="">Select Table</option>
                  {tables.map((table) => (
                    <option key={table.id} value={table.id}>
                      {table.number}
                    </option>
                  ))}
                </SelectInput>
                <InputError message={errors.table_id} className="mt-2" />
              </div>

              {/* Order Items List */}
              <div className="mt-6">
                <InputLabel value="Order Items" />
                {data.items.map((item, index) => (
                  <div key={index} className="flex space-x-2 mt-2">
                    <SelectInput
                      name="product_id"
                      value={item.product_id}
                      className="flex-1"
                      onChange={(e) => updateItem(index, "product_id", e.target.value)}
                    >
                      <option value="">Select Product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </SelectInput>
                    <TextInput
                      name="quantity"
                      type="number"
                      min="1"
                      value={item.quantity}
                      className="w-24"
                      onChange={(e) => updateItem(index, "quantity", e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addItem}
                  className="mt-3 text-blue-600 hover:text-blue-800"
                >
                  + Add Item
                </button>
                <InputError message={errors.items} className="mt-2" />
              </div>

              {/* Actions */}
              <div className="mt-4 text-right">
                <Link
                  href={route("order.index")}
                  className="bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={processing}
                  className="bg-emerald-500 py-1 px-3 rounded text-white shadow transition-all hover:bg-emerald-600"
                >
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
