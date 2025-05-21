import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import SelectInput from "@/Components/SelectInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";

export default function Edit({ auth, user }) {
  const { data, setData, post, errors, reset, processing } = useForm({
    name: user.name || "",
    email: user.email || "",
    phone_number: user.phone_number || "",
    password: "",
    password_confirmation: "",
    role: user.role || "",
    _method: "PUT"
  }, {
    transform: (data) => {
      if (!data.password) {
        delete data.password;
        delete data.password_confirmation;
      }
      return data
    }
  });

  const onSubmit = (e) => {
    e.preventDefault();
    post(route("user.update", user.id || ""), {
      onSuccess: () => reset("password", "password_confirmation"),
    });
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Edit User
        </h2>
      }
    >
      <Head title="Edit User" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <form
              onSubmit={onSubmit}
              className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg"
            >
              {/* Name */}
              <div className="mt-4">
                <InputLabel htmlFor="name" value="Name" />
                <TextInput
                  id="name"
                  name="name"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  className="mt-1 block w-full"
                  autoComplete="name"
                />
                <InputError message={errors.name} className="mt-2" />
              </div>

              <div className="mt-4">
                <InputLabel htmlFor="phone_number" value="Phone Number" />
                <TextInput
                  id="phone_number"
                  type="text"
                  name="phone_number"
                  value={data.phone_number}
                  onChange={(e) => setData("phone_number", e.target.value)}
                  className="mt-1 block w-full"
                  autoComplete="phone_number"
                />
                <InputError message={errors.phone_number} className="mt-2" />
              </div>

              {/* Email */}
              <div className="mt-4">
                <InputLabel htmlFor="email" value="Email" />
                <TextInput
                  id="email"
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={(e) => setData("email", e.target.value)}
                  className="mt-1 block w-full"
                  autoComplete="username"
                />
                <InputError message={errors.email} className="mt-2" />
              </div>

              {/* Password */}
              <div className="mt-4">
                <InputLabel htmlFor="password" value="Password" />
                <TextInput
                  id="password"
                  type="password"
                  name="password"
                  value={data.password}
                  onChange={(e) => setData("password", e.target.value)}
                  className="mt-1 block w-full"
                  autoComplete="new-password"
                />
                <InputError message={errors.password} className="mt-2" />
              </div>

              {/* Password Confirmation */}
              <div className="mt-4">
                <InputLabel
                  htmlFor="password_confirmation"
                  value="Confirm Password"
                />
                <TextInput
                  id="password_confirmation"
                  type="password"
                  name="password_confirmation"
                  value={data.password_confirmation}
                  onChange={(e) =>
                    setData("password_confirmation", e.target.value)
                  }
                  className="mt-1 block w-full"
                  autoComplete="new-password"
                />
                <InputError
                  message={errors.password_confirmation}
                  className="mt-2"
                />
              </div>

              {/* Role */}
              <div className="mt-4">
                <InputLabel htmlFor="role" value="Role" />
                <SelectInput
                  id="role"
                  name="role"
                  value={data.role}
                  onChange={(e) => setData("role", e.target.value)}
                  className="mt-1 block w-full rounded border-gray-300"
                >
                  <option value="admin">Admin</option>
                  <option value="waiter">Kamarier</option>
                  <option value="bartender">Shankist</option>
                </SelectInput>
                <InputError message={errors.role} className="mt-2" />
              </div>

              {/* Actions */}
              <div className="mt-4 text-right">
                <Link
                  href={route("user.index")}
                  className="bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={processing}
                  className="bg-emerald-500 py-1 px-3 rounded text-white shadow transition-all hover:bg-emerald-600"
                >
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
