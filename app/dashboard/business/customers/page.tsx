"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Phone, User } from "lucide-react";
import { useMemo } from "react";

import { CustomTable } from "@/components";
import { ITableColumns } from "@/types/Table";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import CustomerMoreButton from "./_components/CustomerMoreButton";
import CustomerPagination from "./_components/CustomerPagination";
import CustomerSearch from "./_components/CustomerSearch";
import { getCustomers } from "./_meta/actions";
import ListContainer from "@/container/ListContainer/ListContainer";
import ListDataProvider from "@/container/ListDataProvider/ListDataProvider";
import Link from "next/link";

const BusinessDashboardCustomerPage = () => {
  const searchParams = useSearchParams();

  const userNameOrPhone = searchParams.get("userNameOrPhone") || "";

  const page = Number(searchParams.get("page") || "1");
  const pageSize = Number(searchParams.get("pageSize") || "10");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["customers", userNameOrPhone, page, pageSize],
    queryFn: async () => {
      const res = await getCustomers(userNameOrPhone, page);
      if (!res.success) {
        toast.error(res.error);
      }
      return res.data;
    },
  });

  // تعریف ستون‌های جدول
  const columns: ITableColumns[] = useMemo(
    () => [
      {
        field: "rowNumber",
        title: "ردیف",
      },
      {
        title: "مشتری",
        field: "name",
        render: (value, item) => (
          <div className="flex justify-center items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="font-medium text-slate-800">{value}</div>
              {item.email && (
                <div className="text-xs text-slate-400 truncate max-w-37.5">
                  {item.email}
                </div>
              )}
            </div>
          </div>
        ),
      },
      {
        title: "شماره تماس",
        field: "phone",
        render: (value) => (
          <Link
            href={`tel:${value}`}
            className="flex justify-center items-center gap-2 text-sm text-slate-600 hover:text-blue-500"
          >
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            <span dir="ltr">{value}</span>
          </Link>
        ),
      },
      {
        title: "وضعیت",
        field: "isActive",
        render: (isActive: boolean) => {
          return (
            <Badge
              variant="outline"
              className={cn(
                "font-normal",
                isActive
                  ? "bg-green-50 text-green-700 border-green-100"
                  : "bg-slate-50 text-slate-500",
              )}
            >
              {isActive ? "فعال" : "غیرفعال"}
            </Badge>
          );
        },
      },
      {
        title: "نوبت‌ها",
        field: "totalBookings",
        render: (value: number) => (
          <span className="text-slate-600">{value}</span>
        ),
      },
      {
        title: "عملیات",
        field: "id",
        render: (id, row) => <CustomerMoreButton row={row} id={id} />,
      },
    ],
    [],
  );

  return (
    <div className="space-y-6 p-4 md:p-8">
      {/* هدر صفحه */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">لیست مشتریان</h2>
          <p className="text-sm text-slate-500 mt-1">
            مدیریت و مشاهده لیست تمام مشتریان کسب و کار شما
          </p>
        </div>
      </div>

      {/* فیلتر و جستجو */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
        <CustomerSearch />
      </div>

      {/* نمایش جدول */}
      {isError ? (
        <div className="p-8 text-center text-red-500 bg-red-50 rounded-xl border border-red-100">
          خطا در دریافت اطلاعات:{" "}
          {error instanceof Error ? error.message : "نامشخص"}
        </div>
      ) : isLoading ? (
        <div className="w-full flex justify-center items-center">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <ListContainer data={data}>
          <ListDataProvider>
            <CustomTable columns={columns} />
          </ListDataProvider>
        </ListContainer>
      )}

      {/* نشانگر وضعیت صفحه‌بندی (صوری) */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <CustomerPagination
          currentPage={data?.page ? data?.page : 1}
          totalCount={data?.totalItems}
          totalPages={data?.totalPages}
          loading={isLoading}
        />
      </div>
    </div>
  );
};

export default BusinessDashboardCustomerPage;
