"use client";

import { cn } from "@/lib/utils";

interface Customer {
  id: string;
  name: string;
  phone: string;
  totalBookings: number;
  lastBooking: string | null;
  firstBooking: string | null;
}

const CustomersTable = ({ customers }: { customers: Customer[] }) => {
  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="px-4 py-3 text-right">نام</th>
            <th className="px-4 py-3 text-right">موبایل</th>
            <th className="px-4 py-3 text-center">تعداد نوبت</th>
            <th className="px-4 py-3 text-right">آخرین نوبت</th>
            <th className="px-4 py-3 text-right">عملیات</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className="border-t hover:bg-muted/50">
              <td className="px-4 py-3">{customer.name}</td>
              <td className="px-4 py-3">{customer.phone}</td>
              <td className="px-4 py-3 text-center">
                {customer.totalBookings}
              </td>
              <td className="px-4 py-3">
                {customer.lastBooking
                  ? new Date(customer.lastBooking).toLocaleDateString("fa-IR")
                  : "—"}
              </td>
              <td className="px-4 py-3">
                <button className="text-primary hover:underline">مشاهده</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomersTable;
