import Pagination from "@/Components/Pagination";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import { ORDER_STATUS_TEXT_MAP, ORDER_STATUS_CLASS_MAP } from "@/constants";

export default function Index({ auth, orders, queryParams = null, success }) {
  queryParams = queryParams || {};

  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value;
    } else {
      delete queryParams[name];
    }
    router.get(route("order.index"), queryParams, { preserveState: true });
  };

  const onKeyPress = (name, e) => {
    if (e.key !== "Enter") return;
    searchFieldChanged(name, e.target.value);
  };

  const sortChanged = (name) => {
    if (name === queryParams.sort_field) {
      queryParams.sort_direction = queryParams.sort_direction === "asc" ? "desc" : "asc";
    } else {
      queryParams.sort_field = name;
      queryParams.sort_direction = "asc";
    }
    router.get(route("order.index"), queryParams, { preserveState: true });
  };

  const completeOrder = (order) => {
    if (!window.confirm("Mark this order as completed?")) return;
    router.post(route("order.complete", order.id));
  };

  const payOrder = (order) => {
    if (!window.confirm("Mark this order as paid?")) return;
    router.post(route("order.pay", order.id));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between text-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Orders
          </h2>
          {(auth.user.role === "waiter" || auth.user.role === "admin") && (
            <Link
              href={route("order.create")}
              className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600"
            >
              New Order
            </Link>
          )}
        </div>
      }
    >
      <Head title="Orders" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {success && (
            <div className="bg-emerald-500 py-2 px-4 text-white rounded mb-4">
              {success}
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <div className="overflow-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                    <tr className="whitespace-nowrap">
                      <TableHeading
                        name="id"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        ID
                      </TableHeading>
                      <TableHeading
                        name="table_id"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        Table #
                      </TableHeading>
                      <TableHeading
                        name="user_id"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        Waiter
                      </TableHeading>
                      <TableHeading
                        name="total"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        Total
                      </TableHeading>
                      <TableHeading
                        name="status"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        Status
                      </TableHeading>
                      <TableHeading
                        name="created_at"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        Created At
                      </TableHeading>
                      <TableHeading
                        name="created_at"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        Updated At
                      </TableHeading>
                      <th className="px-3 py-2">Actions</th>
                    </tr>
                  </thead>

                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                    <tr className="whitespace-nowrap">
                      <th className="px-3 py-2"></th>
                      <th className="px-3 py-2"></th>
                      <th className="px-3 py-2"></th>
                      <th className="px-3 py-2"></th>
                      <th className="px-3 py-2">
                        {auth.user.role === "admin" && (<SelectInput
                          className="w-full"
                          value={queryParams.status || ""}
                          onChange={(e) => searchFieldChanged("status", e.target.value)}
                        >
                          <option value="">All</option>
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="paid">Paid</option>
                        </SelectInput>)}
                        
                      </th>
                      <th className="px-3 py-2"></th>
                      <th className="px-3 py-2"></th>
                      <th className="px-3 py-2"></th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders.data.map((order) => (
                    
                     
                        <Link
                        as="tr"
                        href={route('order.show', order.id)}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 cursor-pointer"
                        key={order.id}>
                        <td className="px-3 py-2">{order.id}</td>
                        <td className="px-3 py-2">{order.table.number}</td>
                        <td className="px-3 py-2">{order.waiter.name}</td>
                        <td className="px-3 py-2">{order.total}€</td>
                        <td className="px-3 py-2">
                          <span className={"px-2 py-1 rounded text-white " + (ORDER_STATUS_CLASS_MAP[order.status])}>
                            {ORDER_STATUS_TEXT_MAP[order.status]}
                          </span>
                        </td>
                        <td className="px-3 py-2">{order.created_at}</td>
                        <td className="px-3 py-2">{order.updated_at}</td>
                        <td className="px-3 py-2 space-x-2">
                          {(auth.user.role === "bartender" || auth.user.role === "admin")   && order.status === "pending" && (
                            <button
                              onClick={() => completeOrder(order)}
                              className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                            >
                              Complete
                            </button>
                          )}
                          {(auth.user.role === "waiter" || auth.user.role === "admin") && order.status === "completed" && (
                            <button
                              onClick={() => payOrder(order)}
                              className="font-medium text-green-600 dark:text-green-500 hover:underline"
                            >
                              Mark as Paid
                            </button>
                          )}
                        </td>
                      </Link>
                      
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination links={orders.meta.links} />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
