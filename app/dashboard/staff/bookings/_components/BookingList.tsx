"use client";
import { CustomTable, ListHeader, StatusBadge } from "@/components";
import ListContainer from "@/container/ListContainer/ListContainer";
import ListDataProvider from "@/container/ListDataProvider/ListDataProvider";
import { ITableColumns } from "@/types/Table";
import { getFullDateTime } from "@/utils/common";
import { PhoneIcon, User } from "lucide-react";
import Link from "next/link";
import StaffBookingFilter from "./StaffBookingFilter";
import StaffBookingListButton from "./StaffBookingListButton";

interface Props {
  data?: any;
}

const BookingList = ({ data }: Props) => {
  const columns: ITableColumns[] = [
    {
      field: "rowNumber",
      title: "ردیف",
    },
    {
      field: "service",
      title: "سرویس",
      render: (service) => service?.name,
    },
    {
      field: "customer",
      title: "نام مشتری",
      render: (v) => (
        <div className="flex justify-center items-center gap-2">
          <User className="bg-primary-100/40 rounded-full p-1 w-6 h-6" />
          {v?.fullName ?? "---"}
        </div>
      ),
    },
    {
      field: "customer",
      title: "موبایل مشتری",
      render: (v) => (
        <Link
          href={`tel:${v?.phone}`}
          className="hover:text-blue-500 flex justify-center items-center gap-2"
        >
          <PhoneIcon size={16} />
          {v?.phone}
        </Link>
      ),
    },
    {
      field: "startTime",
      title: "زمان",
      render: (v) => getFullDateTime(v),
    },
    {
      field: "status",
      title: "وضعیت",
      render: (v) => <StatusBadge status={v} />,
    },

    {
      field: "id",
      title: "عملیات",
      render: (v) => {
        return <StaffBookingListButton id={v} />;
      },
    },
  ];
  return (
    <ListContainer data={data}>
      <ListHeader hasRefresh={false} filter={<StaffBookingFilter />} />
      <ListDataProvider>
        <CustomTable columns={columns} />
      </ListDataProvider>
    </ListContainer>
  );
};

export default BookingList;
