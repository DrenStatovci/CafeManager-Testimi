// resources/js/Pages/Order/Show.jsx
import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ order, auth }) {
  // Pull the shared auth object out of Inertia’s props

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={ <div className="flex justify-between text-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {`Order #${order.id}`}
          </h2>
          {(auth.user.role === "waiter" || auth.user.role === "admin") && (
            <Link
              href={route("order.edit", order.id)}
              className="bg-blue-500  py-1 px-3 text-white rounded shadow transition-all hover:bg-blue-600"
            >
              Edit Order
            </Link>
          )}
        </div>
      
    }
    >
      {/* Set the page <title> */}
      <Head title={`Order #${order.id}`} />

      
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Created:</strong> {order.created_at}</p>
            </div>
            <div>
              <p><strong>Table:</strong> {order.table.number}</p>
              <p><strong>Waiter:</strong> {order.waiter.name}</p>
            </div>
          </div>

          <h3 className="text-lg font-medium mb-2">Items</h3>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b py-2">Product</th>
                <th className="border-b py-2">Qty</th>
                <th className="border-b py-2">Unit Price</th>
                <th className="border-b py-2">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map(item => (
                <tr key={item.id} className="border-b">
                  <td className="py-2">{item.product.name}</td>
                  <td className="py-2">{item.quantity}</td>
                  <td className="py-2">${item.unit_price}</td>
                  <td className="py-2">
                    ${(item.quantity * item.unit_price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 flex justify-between items-center">
            <span className="text-lg font-bold">Total: ${order.total}</span>
            <Link
              href={route('order.index')}
              className="text-blue-600 hover:underline"
            >
              ← Back to Orders
            </Link>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
