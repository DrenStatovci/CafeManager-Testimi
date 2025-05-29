import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import SelectInput from "@/Components/SelectInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";

export default function Create({ auth, reservation, tables }) {
  const { data, setData, post, errors, processing, reset } = useForm({
    table_id: reservation.table.id || '',
    costumer_name: reservation.costumer_name || '',
    costumer_phone: reservation.costumer_phone || '',
    reservation_date: reservation.reservation_date || '',
    guest_number: reservation.guest_number || 1,
    status: reservation.status || '',
    _method: "PUT"
  });


  const onSubmit = (e) => { 
    e.preventDefault();
    post(route("reservation.update",reservation.id));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Create New Reservation
        </h2>
      }
    >
      <Head title="Create Reservation" />

      <div className="py-12">
        <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <form
              onSubmit={onSubmit}
              className="p-6 bg-white dark:bg-gray-800 shadow sm:rounded-lg"
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

              {/* Guest Name */}
              <div className="mt-6">
                <InputLabel htmlFor="costumer_name" value="Customer's Name" />
                <TextInput
                  id="costumer_name"
                  name="costumer_name"
                  value={data.costumer_name}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("costumer_name", e.target.value)}
                />
                <InputError message={errors.costumer_name} className="mt-2" />
              </div>
            
            {/*Guest Phone Number*/}
              <div className="mt-6">
                <InputLabel htmlFor="costumer_phone" value="Customer's Phone Number" />
                <TextInput
                  id="costumer_phone"
                  name="costumer_phone"
                  value={data.costumer_phone}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("costumer_phone", e.target.value)}
                />
                <InputError message={errors.costumer_phone} className="mt-2" />
              </div>

              {/* Reservation Date/Time */}
              <div className="mt-6">
                <InputLabel
                  htmlFor="reservation_date"
                  value="Reservation Date & Time"
                />
                <TextInput
                  id="reservation_date"
                  name="reservation_date"
                  type="datetime-local"
                  value={data.reservation_date}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("reservation_date", e.target.value)}
                />
                <InputError
                  message={errors.reservation_date}
                  className="mt-2"
                />
              </div>

              {/* Reservation's Status */}
               <div className="mt-6">
                <InputLabel htmlFor="status" value="Reservation's Status"/>
                <SelectInput
                    id="status"
                    name="status"
                    value={data.status}
                    className="mt-1 block w-full"
                    onChange= {(e)=>setData('status', e.target.value)}
                >
                    <option value="" disabled>Select Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="seated">Seated</option>
                    <option value="completed">Completed</option>
                    <option value="canceled">Canceled</option>
                    
                </SelectInput>
              </div>

              {/* Number of Guests */}
              <div className="mt-6">
                <InputLabel htmlFor="guest_number" value="Number of Guests" />
                <TextInput
                  id="guest_number"
                  name="guest_number"
                  type="number"
                  min="1"
                  value={data.guest_number}
                  className="mt-1 block w-24"
                  onChange={(e) => setData("guest_number", e.target.value)}
                />
                <InputError message={errors.guest_number} className="mt-2" />
              </div>

              {/* Actions */}
              <div className="mt-4 text-right">
                <Link
                  href={route("reservation.index")}
                  className="bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={processing}
                  className="bg-blue-500 py-1 px-3 rounded text-white shadow transition-all hover:bg-blue-600"
                >
                  Update Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
