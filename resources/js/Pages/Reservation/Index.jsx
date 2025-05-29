import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SelectInput from '@/Components/SelectInput';
import TextInput from '@/Components/TextInput';
import Pagination from '@/Components/Pagination';
import { RESERVATION_STATUS_CLASS_MAP, RESERVATION_STATUS_TEXT_MAP } from '@/constants';

// React Day Picker imports
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

export default function Index({ auth, reservations, queryParams = {}, success }) {
  // Ensure queryParams is always an object
  queryParams = { ...queryParams };

  // State for single date selection
  const [selectedDate, setSelectedDate] = useState(
    queryParams.date ? new Date(queryParams.date) : undefined
  );

  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value;
    } else {
      delete queryParams[name];
    }
    router.get(route('reservation.index'), queryParams, { preserveState: true, replace: true });
  };

  const onKeyPress = (name, e) => {
    if (e.key !== 'Enter') return;
    searchFieldChanged(name, e.target.value);
  };

  const sortChanged = (name) => {
    if (name === queryParams.sort_field) {
      queryParams.sort_direction = queryParams.sort_direction === 'asc' ? 'desc' : 'asc';
    } else {
      queryParams.sort_field = name;
      queryParams.sort_direction = 'asc';
    }
    router.get(route('reservation.index'), queryParams, { preserveState: true, replace: true });
  };

  const cancelReservation = (reservation) => {
    if (!window.confirm('Cancel this reservation?')) return;
    router.delete(route('reservation.destroy', reservation.id));
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const formatDate = (d) => {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };
    if (date) {
      searchFieldChanged('date', formatDate(date));
    } else {
      searchFieldChanged('date', null);
    }
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Reservations
          </h2>
          {(auth.user.role === 'admin' || auth.user.role === 'waiter') && (
            <Link
              href={route('reservation.create')}
              className="bg-emerald-500 py-1 px-3 text-white rounded shadow hover:bg-emerald-600"
            >
              New Reservation
            </Link>
          )}
        </div>
      }
    >
      <Head title="Reservations" />

      <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">
        {success && (
          <div className="bg-emerald-500 text-white px-4 py-2 rounded mb-4">
            {success}
          </div>
        )}

        {/*Sorting and Filtering*/}
        
        {/* Calendar Container */}
        <div className="flex flex-wrap items-start gap-4 mb-6 justify-between">
        <details className=''>
        <summary className='block mt-1 cursor-pointer px-4 py-2 text-gray-300 border border-gray-700 rounded-md font-medium'>Filter by Date</summary>
        <div className="bg-indigo-50 p-4 rounded-lg inline-block mb-6 just">
          {/* <h3 className="text-lg font-medium text-indigo-700 mb-2">Filter by Date</h3> */}
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            modifiersClassNames={{
              selected: 'bg-indigo-600 text-white',
              today: 'ring-2 ring-indigo-400',
            }}
            className="rounded-lg"
          />
        </div>
        </details>
          {/* Search by name */}
          <TextInput
            placeholder="Search name…"
            defaultValue={queryParams.costumer_name || ''}
            onKeyPress={(e) => onKeyPress('costumer_name', e)}
            className="w-60"
          />

          {/* Status filter */}
          <SelectInput
            value={queryParams.status || ''}
            onChange={(e) => searchFieldChanged('status', e.target.value)}
            className="w-40"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="seated">Seated</option>
            <option value="cancelled">Cancelled</option>
          </SelectInput>

          {/* Sort field */}
          <SelectInput
            value={queryParams.sort_field || 'reservation_date'}
            onChange={(e) => sortChanged(e.target.value)}
            className="w-44"
          >
            <option value="reservation_date">When</option>
            <option value="costumer_name">Customer</option>
            <option value="guest_number">Guest Number</option>
            <option value="status">Status</option>
          </SelectInput>

          {/* Sort direction */}
          <button
            type="button"
            onClick={() => sortChanged(queryParams.sort_field || 'reservation_date')}
            className="px-3 py-1 border rounded text-gray-300 border-gray-700"
          >
            {queryParams.sort_direction === 'asc' ? '↑' : '↓'}
          </button>
        </div>

        {/* Card Grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {reservations.data.map((r) => (
            <div
              key={r.id}
              className="bg-white shadow rounded-lg p-4 space-y-3"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold">#{r.id}</span>
                <span
                  className={
                    'text-xs font-semibold px-2 py-1 rounded ' +
                    (RESERVATION_STATUS_CLASS_MAP[r.status])
                  }
                >
                  {RESERVATION_STATUS_TEXT_MAP[r.status]}
                </span>
              </div>

              <p className="text-sm">
                <strong>When:</strong>{' '}
                {new Date(r.reservation_date).toLocaleString()}
              </p>
              <p className="text-sm">
                <strong>Who:</strong> {r.costumer_name}
              </p>
              <p className="text-sm">
                <strong>Size: </strong>{r.guest_number}
              </p>
              <p className="text-sm">
                <strong>Table:</strong> #{r.table.number}
              </p>

              <div className="pt-2 border-t flex justify-end space-x-2">
                <button
                  onClick={() => cancelReservation(r)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Cancel
                </button>
                {(auth.user.role === 'admin' || auth.user.role === 'waiter') && (
                    <Link
                      href={route('reservation.edit', r.id)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Edit
                    </Link>
                  )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-6">
          <Pagination links={reservations.meta.links} />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
