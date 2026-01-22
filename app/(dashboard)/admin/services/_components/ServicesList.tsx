"use client";
import { Table } from "@/components";
import ListDataProvider from "@/container/ListDataProvider/ListDataProvider";
import { ITableColumns } from "@/types/Table";
import ServicesListButtons from "./ServicesListButtons";

const ServicesList = () => {
  const columns: ITableColumns[] = [
    {
      field: "rowNumber",
      title: "ردیف",
    },
    {
      field: "title",
      title: "نام",
    },
    {
      field: "price",
      title: "قیمت",
      render: (v: number) => v.toLocaleString("fa"),
    },
    {
      field: "duration",
      title: "مدت زمان",
      render: (v: number) => v.toLocaleString("fa"),
    },
    {
      field: "reservations",
      title: "تعداد رزروها",
      render: (v: any[]) => v?.length,
    },
    {
      field: "createdAt",
      title: "تاریخ ایجاد",
      hasDateFormatter: true,
    },
    {
      field: "updatedAt",
      title: "تاریخ ویرایش",
      hasDateFormatter: true,
    },
    {
      field: "id",
      title: "عملیات",
      render: (id: string, item) => {
        return <ServicesListButtons id={id} />;
      },
    },
  ];
  return (
    <ListDataProvider>
      <Table columns={columns} />
    </ListDataProvider>
  );
};

export default ServicesList;
