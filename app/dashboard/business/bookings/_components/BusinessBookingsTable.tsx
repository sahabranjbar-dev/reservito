"use client";

import { ListHeader, StatusBadge, Table } from "@/components";
import { Badge } from "@/components/ui/badge";
import ListContainer from "@/container/ListContainer/ListContainer";
import ListDataProvider from "@/container/ListDataProvider/ListDataProvider";
import { ITableColumns } from "@/types/Table";
import { Calendar, Clock, Phone } from "lucide-react";
import BookingListMoreButton from "./BookingListMoreButton";
import BusinessBookingsFilters from "./BusinessBookingsFilters";
import Link from "next/link";

interface Props {
  data?: any;
}

const BusinessBookingsTable = ({ data }: Props) => {
  const columns: ITableColumns[] = [
    {
      field: "rowNumber",
      title: "ردیف",
    },
    {
      title: "مشتری",
      field: "customer",
      render: (customer) => {
        return (
          <div key={customer?.id} className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-slate-900 text-base">
              {customer.name}
            </h3>
            <Link
              href={`tel:${customer?.phone}`}
              className="flex items-center text-xs text-slate-500 gap-1"
            >
              <Phone className="w-3 h-3" />
              {customer.phone}
            </Link>
          </div>
        );
      },
    },
    {
      title: "سرویس و خدمت",
      field: "staff",
      render: (staff, row) => (
        <div key={staff?.id} className="flex justify-center gap-2 items-center">
          <Badge
            variant="outline"
            className="text-xs px-2 py-0 border-slate-200"
          >
            {row.service.name}
          </Badge>
          <span className="text-xs text-slate-400">با {staff.name}</span>
        </div>
      ),
    },
    {
      title: "تاریخ",
      field: "startTime",
      render: (startTime, row) => (
        <div key={row?.id} className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {new Date(startTime).toLocaleDateString("fa-IR")}
        </div>
      ),
    },
    {
      title: "ساعت",
      field: "startTimeq",

      render: (_, row) => {
        const start = new Date(row?.startTime).toLocaleTimeString("fa-IR", {
          hour: "2-digit",
          minute: "2-digit",
        });
        const end = new Date(row.endTime).toLocaleTimeString("fa-IR", {
          hour: "2-digit",
          minute: "2-digit",
        });
        return (
          <div key={row?.id} className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {start} - {end}
          </div>
        );
      },
    },
    {
      title: "وضعیت",
      field: "status",
      render: (status) => {
        return <StatusBadge status={status} />;
      },
    },

    {
      title: "عملیات",
      field: "id",
      render: (id) => <BookingListMoreButton id={id} />,
    },
  ];

  return (
    <ListContainer data={data}>
      <ListHeader title="لیست رزرو‌ها" filter={<BusinessBookingsFilters />} />
      <ListDataProvider>
        <Table columns={columns} />
      </ListDataProvider>
    </ListContainer>
  );
};

export default BusinessBookingsTable;
