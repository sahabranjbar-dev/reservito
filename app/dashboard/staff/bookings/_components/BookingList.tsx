"use client";
import { CustomTable, ListHeader, StatusBadge } from "@/components";
import { ITableColumns } from "@/types/Table";
import { getFullDateTime } from "@/utils/common";
import React from "react";
import StaffBookingListButton from "./StaffBookingListButton";
import ListContainer from "@/container/ListContainer/ListContainer";
import ListDataProvider from "@/container/ListDataProvider/ListDataProvider";
import StaffBookingFilter from "./StaffBookingFilter";

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
      title: "مشتری",
      render: (v) => v?.fullName || v?.phone,
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
