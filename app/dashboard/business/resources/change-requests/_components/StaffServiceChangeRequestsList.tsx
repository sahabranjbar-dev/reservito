"use client";
import { CustomTable, ListHeader } from "@/components";
import ListContainer from "@/container/ListContainer/ListContainer";
import ListDataProvider from "@/container/ListDataProvider/ListDataProvider";
import { ITableColumns } from "@/types/Table";
import React, { useMemo } from "react";
import StaffServiceChangeRequestActions from "./StaffServiceChangeRequestActions";
import { Check, Clock, X } from "lucide-react";
import clsx from "clsx";
import PaginationWrapper from "@/components/Pagination/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import StaffServiceChangeRequestFilter from "./StaffServiceChangeRequestFilter";

interface Props<T = any> {
  data: T;
}

interface IData {
  resultList: any;
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const StaffServiceChangeRequestsList = ({ data }: Props<IData>) => {
  const searchParams = useSearchParams();

  const { replace } = useRouter();

  const onPageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.delete("page");
    params.append("page", String(page));

    replace(`/dashboard/staff/bookings?${params}`);
  };
  const columns: ITableColumns[] = useMemo(
    () => [
      {
        field: "rowNumber",
        title: "ردیف",
      },

      // اطلاعات همکار
      {
        field: "staff",
        title: "نام همکار",
        render: (value) => value?.name ?? "-",
      },

      // درخواست‌های جدید
      {
        field: "requestedName",
        title: "نام درخواستی جدید",
        render: (value) => value ?? "-",
      },
      {
        field: "requestedDuration",
        title: "مدت درخواستی جدید (دقیقه)",
        render: (value) => value ?? "-",
      },
      {
        field: "requestedPrice",
        title: "قیمت درخواستی جدید",
        render: (value) =>
          value ? value.toLocaleString("fa-IR") + " تومان" : "-",
      },

      // وضعیت فعال/غیرفعال
      {
        field: "requestedActive",
        title: "فعال باشد؟",
        render: (value) =>
          value === true ? "بله" : value === false ? "خیر" : "-",
      },

      // وضعیت بررسی
      {
        field: "status",
        title: "وضعیت درخواست",
        render: (value) => {
          const baseClass =
            "border rounded-2xl px-2 py-1 text-xs flex items-center justify-center gap-1 w-fit";

          switch (value) {
            case "PENDING":
              return (
                <span
                  className={clsx(
                    baseClass,
                    "bg-amber-100 text-amber-600 border-amber-300",
                  )}
                >
                  <Clock size={12} />
                  در انتظار تأیید
                </span>
              );

            case "APPROVED":
              return (
                <span
                  className={clsx(
                    baseClass,
                    "bg-green-100 text-green-600 border-green-300",
                  )}
                >
                  <Check size={12} />
                  تأیید شده
                </span>
              );

            case "REJECTED":
              return (
                <span
                  className={clsx(
                    baseClass,
                    "bg-red-100 text-red-600 border-red-300",
                  )}
                >
                  <X size={12} />
                  رد شده
                </span>
              );

            default:
              return "-";
          }
        },
      },

      // تاریخ ثبت
      {
        field: "createdAt",
        title: "تاریخ ثبت",
        render: (value) =>
          value ? new Date(value).toLocaleDateString("fa-IR") : "-",
      },
      {
        field: "id",
        title: "عملیات",
        render: (value) => <StaffServiceChangeRequestActions id={value} />,
      },
    ],
    [],
  );

  return (
    <ListContainer data={data}>
      <ListHeader
        title="لیست درخواست تغییر سرویس"
        filter={<StaffServiceChangeRequestFilter />}
      />
      <ListDataProvider>
        <CustomTable columns={columns} />
        <PaginationWrapper
          currentPage={data.page}
          onPageChange={onPageChange}
          totalCount={data.totalItems}
          loading={false}
          totalPages={data?.totalPages}
        />
      </ListDataProvider>
    </ListContainer>
  );
};

export default StaffServiceChangeRequestsList;
