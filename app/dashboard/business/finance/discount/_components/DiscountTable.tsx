"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Edit,
  Copy,
  Check,
  X,
  Calendar,
  Tag,
  Percent,
  Coins,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import {
  upsertDiscount,
  toggleDiscountStatus,
  deleteDiscount,
} from "../_meta/actions";
import DiscountForm from "./DiscountForm";
import { Modal } from "@/components";
import { toast } from "sonner";

// --- Types ---
type DiscountType = "PERCENTAGE" | "FIXED_AMOUNT";
type DiscountStatus = "ACTIVE" | "INACTIVE" | "EXPIRED";

interface DiscountData {
  id: string;
  code: string;
  type: DiscountType;
  value: number;
  status: DiscountStatus;
  maxDiscount: number | null;
  minOrderAmount: number | null;
  usageLimit: number | null;
  usedCount: number;
  startsAt: string;
  expiresAt: string;
}

interface Props {
  discounts: DiscountData[];
  businessId: string;
}

// --- Helper Components ---
const StatusBadge = ({ status }: { status: DiscountStatus }) => {
  const styles = {
    ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
    INACTIVE: "bg-slate-50 text-slate-700 border-slate-200",
    EXPIRED: "bg-rose-50 text-rose-700 border-rose-200",
  };
  const labels = {
    ACTIVE: "فعال",
    INACTIVE: "غیرفعال",
    EXPIRED: "منقضی",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border ${styles[status]}`}
    >
      {status === "ACTIVE" && (
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      )}
      {labels[status]}
    </span>
  );
};

export const DiscountTable = ({ discounts, businessId }: Props) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({ id: null, isOpen: false });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">کدهای تخفیف</h2>
          <p className="text-sm text-slate-500 mt-1">
            مدیریت کدهای تخفیف و کمپین‌های فروش
          </p>
        </div>
        <button
          onClick={() => setModalState({ id: null, isOpen: true })}
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
          ایجاد کد جدید
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-scroll rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-right text-sm">
          <thead className="bg-slate-50 border-b border-slate-100 font-medium text-slate-500">
            <tr>
              <th className="px-6 py-4">کد تخفیف</th>
              <th className="px-6 py-4">نوع و مقدار</th>
              <th className="px-6 py-4">اعتبار</th>
              <th className="px-6 py-4">مصرف</th>
              <th className="px-6 py-4">وضعیت</th>
              <th className="px-6 py-4 text-left">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {discounts.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-8 text-center text-slate-500"
                >
                  هیچ کد تخفیفی یافت نشد.
                </td>
              </tr>
            ) : (
              discounts.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 font-mono tracking-wider">
                        {item.code}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(item.code).then(() => {
                            toast.success(`کد تخفیف ${item.code} کپی شد`);
                          });
                        }}
                        className="text-slate-400 hover:text-blue-600"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {item.type === "PERCENTAGE" ? (
                        <Percent className="h-4 w-4 text-indigo-500" />
                      ) : (
                        <Coins className="h-4 w-4 text-indigo-500" />
                      )}
                      <span className="font-medium text-slate-700">
                        {item.type === "PERCENTAGE"
                          ? `${item.value}%`
                          : `${new Intl.NumberFormat("fa-IR").format(item.value)} تومان`}
                      </span>
                    </div>
                    {item.minOrderAmount && (
                      <div className="text-xs text-slate-400 mt-1">
                        حداقل خرید:{" "}
                        {new Intl.NumberFormat("fa-IR").format(
                          item.minOrderAmount,
                        )}{" "}
                        تومان
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600 text-xs">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(item.expiresAt).toLocaleDateString("fa-IR")}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-700">
                      <span className="font-medium">{item.usedCount}</span>
                      {item.usageLimit && (
                        <span className="text-slate-400 text-xs">
                          {" "}
                          از{" "}
                          {new Intl.NumberFormat("fa-IR").format(
                            item.usageLimit,
                          )}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-4 text-left">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() =>
                          toggleDiscountStatus(item.id, item.status)
                        }
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                        title={
                          item.status === "ACTIVE"
                            ? "غیرفعال کردن"
                            : "فعال کردن"
                        }
                      >
                        {item.status === "ACTIVE" ? (
                          <ToggleRight className="h-5 w-5 text-emerald-500" />
                        ) : (
                          <ToggleLeft className="h-5 w-5 text-slate-400" />
                        )}
                      </button>
                      <button
                        onClick={() =>
                          setModalState({ id: item.id, isOpen: true })
                        }
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (
                            confirm("آیا از حذف این کد تخفیف اطمینان دارید؟")
                          ) {
                            deleteDiscount(item.id);
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        onOpenChange={() => {
          setModalState((prev) => ({ ...prev, isOpen: !prev.isOpen }));
        }}
        open={modalState.isOpen}
        title={modalState ? "ویرایش کد تخفیف" : "کد تخفیف جدید"}
        width="md:max-w-2xl max-h-[94vh] overflow-scroll"
        hideActions
      >
        <DiscountForm
          onCancel={() => {
            setModalState((prev) => ({ ...prev, isOpen: false }));
          }}
          id={modalState.id}
          onSuccess={() => {
            setModalState((prev) => ({ ...prev, isOpen: false }));
          }}
          businessId={businessId}
        />
      </Modal>
    </div>
  );
};
