"use client";

import { CustomTable, ListHeader } from "@/components";
import { Badge } from "@/components/ui/badge";
import ListContainer from "@/container/ListContainer/ListContainer";
import ListDataProvider from "@/container/ListDataProvider/ListDataProvider";
import { ITableColumns } from "@/types/Table";
import { getFullDateTime } from "@/utils/common";
import { Briefcase, Shield, User } from "lucide-react";
import { useMemo } from "react";
import AdminUserActionButton from "./AdminUserActionButton";

interface AdminUsersListProps<T = any> {
  data: T;
}

const AdminUsersList = ({ data }: AdminUsersListProps) => {
  const columns = useMemo<ITableColumns[]>(
    () => [
      {
        field: "rowNumber",
        title: "ردیف",
      },
      {
        field: "fullName",
        title: "نام کاربر",
      },
      {
        field: "roles",
        title: "نقش‌ها",
        render: (roles, row) => {
          const isSuperAdmin = roles.some((r: any) => r.role === "SUPER_ADMIN");
          const isCustomer =
            roles.some((r: any) => r.role === "CUSTOMER") || roles.length === 0;
          const isBusinessOwner = (row?.ownedBusinesses?.length ?? 0) > 0;
          const isStaff = (row?.staffMembers?.length ?? 0) > 0;

          return (
            <div className="flex flex-wrap gap-1">
              {isSuperAdmin && (
                <Badge variant="destructive" className="bg-red-600">
                  <Shield size={12} className="ml-1" />
                  ادمین کل
                </Badge>
              )}
              {isCustomer && (
                <Badge
                  variant="secondary"
                  className="bg-slate-100 text-slate-700"
                >
                  <User size={12} className="ml-1" />
                  مشتری
                </Badge>
              )}
              {isBusinessOwner && (
                <Badge
                  variant="outline"
                  className="bg-indigo-50 text-indigo-700 border-indigo-100"
                >
                  <Briefcase size={12} className="ml-1" />
                  صاحب بیزنس
                </Badge>
              )}
              {isStaff && (
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-indigo-100"
                >
                  <Briefcase size={12} className="ml-1" />
                  همکار بیزنس
                </Badge>
              )}
            </div>
          );
        },
      },
      {
        field: "ownedBusinesses",
        title: "اطلاعات بیزنس",
        render(value, row) {
          const isBusinessOwner = (value?.length ?? 0) > 0;

          return isBusinessOwner ? (
            <div className="text-sm font-medium">
              {value.map((b: any) => (
                <div key={b.id} className="text-slate-700">
                  {b.businessName}
                </div>
              ))}
            </div>
          ) : row.staffMembers?.length ? (
            row.staffMembers.map((b: any) => (
              <div key={b.business.id} className="text-slate-800">
                <span className="text-gray-500"> همکاری با </span>
                {b.business.businessName}
              </div>
            ))
          ) : (
            <span className="text-slate-400 text-sm">ندارد</span>
          );
        },
      },
      {
        field: "isActive",
        title: "وضعیت",
        render: (isActive) => (isActive ? "فعال" : "غیرفعال"),
      },
      {
        field: "createdAt",
        title: "تاریخ عضویت",
        render: (createdAt) => getFullDateTime(createdAt),
      },
      {
        field: "id",
        title: "عملیات",
        render: (id) => <AdminUserActionButton id={id} />,
      },
    ],
    [],
  );

  return (
    <ListContainer data={data}>
      <ListHeader />
      <ListDataProvider>
        <CustomTable columns={columns} />
      </ListDataProvider>
    </ListContainer>
  );
};

export default AdminUsersList;
