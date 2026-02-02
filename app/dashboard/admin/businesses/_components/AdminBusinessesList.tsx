"use client";

import { Modal } from "@/components";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BUSINESS_TYPE } from "@/constants/common";
import { BusinessType } from "@/constants/enums";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { Edit, Eye, ToggleLeft, ToggleRight, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { toggleBusinessStatus } from "../_meta/actions/businessActions";
import AdminBusinessView from "./AdminBusinessView";

enum BusinessStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

interface Owner {
  id: string;
  fullName: string | null;
  phone: string | null;
  email: string | null;
  avatar: string | null;
}

interface Business {
  id: string;
  businessName: string;
  ownerName: string | null;
  description: string | null;
  logo: string | null;
  address: string | null;
  slug: string;
  businessType: string;
  createdAt: string;
  registrationStatus: BusinessStatus;
  rejectionReason: string | null;
  owner: Owner;
  isActive: boolean;
}

interface AdminBusinessesListProps {
  businesses: Business[];
}

interface IModalState {
  modalType?: "view" | "edit" | "delete";
  id?: string;
}

const StatusBadge = ({ status }: { status: BusinessStatus }) => {
  const styles: Record<BusinessStatus, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    APPROVED: "bg-green-100 text-green-800 border-green-200",
    REJECTED: "bg-red-100 text-red-800 border-red-200",
  };

  const labels: Record<BusinessStatus, string> = {
    PENDING: "در انتظار تایید",
    APPROVED: "تایید شده",
    REJECTED: "رد شده",
  };

  return (
    <Label
      className={clsx(
        "rounded-full text-xs flex justify-center items-center border px-3 py-1",
        styles[status],
      )}
    >
      {labels[status]}
    </Label>
  );
};

const AdminBusinessesList = ({ businesses }: AdminBusinessesListProps) => {
  const queryClient = useQueryClient();

  const [modalState, setModalState] = useState<IModalState>();

  const closeModal = () => {
    setModalState({});
  };

  const changeStatusHandler = useCallback(
    async (id: string, isActive: boolean) => {
      if (!id) return;
      await toggleBusinessStatus(id, isActive)
        .then(({ success, error, message }) => {
          if (success) {
            toast.success(message);
          } else {
            toast.error(error);
          }
        })
        .finally(() => {
          queryClient.invalidateQueries({
            queryKey: ["admin-business-detail", id],
          });
        });
    },
    [queryClient],
  );
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 font-sans dir-rtl">
      {/* هدر */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            مدیریت کسب‌وکارها
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            تایید، رد و مدیریت وضعیت درخواست‌ها
          </p>
        </div>
      </div>

      {/* جدول */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-right">
          <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
            <tr>
              <th className="p-4 font-medium">نام کسب‌وکار</th>
              <th className="p-4 font-medium">مالک</th>
              <th className="p-4 font-medium">نوع</th>
              <th className="p-4 font-medium">تاریخ درخواست</th>
              <th className="p-4 font-medium">وضعیت</th>
              <th className="p-4 font-medium text-center">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {businesses.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  هیچ درخواستی یافت نشد.
                </td>
              </tr>
            ) : (
              businesses.map((business) => (
                <tr
                  key={business.id}
                  className="hover:bg-gray-50 transition-colors group"
                >
                  <td className="p-4 font-medium text-gray-900">
                    {business.businessName}
                  </td>
                  <td className="p-4 text-gray-600 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs overflow-hidden">
                      {business.owner?.avatar ? (
                        <Image
                          src={business.owner.avatar}
                          alt=""
                          width={100}
                          height={100}
                        />
                      ) : (
                        <User size={14} />
                      )}
                    </div>
                    {business.ownerName || business.owner?.fullName}
                  </td>
                  <td className="p-4 text-gray-600">
                    {BUSINESS_TYPE[business.businessType as BusinessType]}
                  </td>
                  <td className="p-4 text-gray-500">
                    {new Date(business.createdAt).toLocaleDateString("fa-IR")}
                  </td>
                  <td className="p-4">
                    <StatusBadge status={business.registrationStatus} />
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        type="button"
                        tooltip={
                          business.isActive ? "غیرفعال کردن" : "فعال کردن"
                        }
                        onClick={() => {
                          changeStatusHandler(business.id, business.isActive);
                        }}
                      >
                        {business.isActive ? (
                          <ToggleRight className="h-5 w-5 text-emerald-500" />
                        ) : (
                          <ToggleLeft className="h-5 w-5 text-slate-400" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        type="button"
                        tooltip="مشاهده و اجازه‌ی ورود"
                        onClick={() => {
                          setModalState({
                            id: business.id,
                            modalType: "view",
                          });
                        }}
                      >
                        <Eye size={18} />
                      </Button>

                      <Link
                        href={`/dashboard/admin/businesses/${business?.id}`}
                      >
                        <Button
                          variant="ghost"
                          type="button"
                          tooltip="ویرایش کسب‌وکار"
                        >
                          <Edit />
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        onOpenChange={(open) => {
          setModalState({ modalType: open ? "view" : undefined });
        }}
        open={modalState?.modalType === "view"}
        title="مشاهده و اجازه‌ی ورود"
        hideActions
      >
        <AdminBusinessView
          id={modalState?.id}
          onCancel={() => {
            closeModal();
          }}
          onSuccess={() => {
            closeModal();
          }}
        />
      </Modal>
    </div>
  );
};

export default AdminBusinessesList;
