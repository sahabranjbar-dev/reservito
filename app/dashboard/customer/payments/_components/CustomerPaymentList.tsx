"use client";
import { Modal } from "@/components";
import { formatCurrency } from "@/utils/common";
import { useMutation } from "@tanstack/react-query";
import { ArrowDownLeft, CreditCard, Eye, Wallet } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { getPaymentDetail } from "../_meta/actions";
import PaymentDetails from "./PaymentDetails";

type PaymentStatus = "UNPAID" | "PENDING" | "PAID" | "FAILED" | "REFUNDED";
type PaymentMethod = "ONLINE" | "OFFLINE";

interface BusinessType {
  id: string;
  businessName: string;
  logo: string | null;
  slug: string;
}

interface ServiceType {
  id: string;
  name: string;
}

interface BookingType {
  id: string;
  startTime: Date;
  service: ServiceType;
  business: BusinessType;
}

interface PaymentType {
  id: string;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  createdAt: Date;
  refId: string | null;
  gatewayName: string | null;
  booking: BookingType;
}

interface Props {
  payments: PaymentType[];
}

const MethodIcon = ({ method }: { method: PaymentMethod }) => {
  return method === "ONLINE" ? (
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
      <CreditCard className="h-4 w-4" />
    </div>
  ) : (
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
      <Wallet className="h-4 w-4" />
    </div>
  );
};

const getStatusBadge = (status: PaymentStatus) => {
  switch (status) {
    case "PAID":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
          موفق
        </span>
      );
    case "FAILED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-600/10">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
          ناموفق
        </span>
      );
    case "REFUNDED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
          <ArrowDownLeft className="h-3 w-3" />
          برگشت خورده
        </span>
      );
    case "PENDING":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
          در انتظار پرداخت
        </span>
      );
    default:
      return <span className="text-slate-500 text-xs">{status}</span>;
  }
};

const CustomerPaymentList = ({ payments }: Props) => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const {
    data: paymentData,
    isPending,
    mutateAsync: getPaymentData,
  } = useMutation({
    mutationFn: async (id: string) => {
      const response = await getPaymentDetail(id);

      if (!response.success) {
        toast.error(response.error);
        return [];
      }

      return response.payment;
    },
  });

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5">
      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
            <tr>
              <th className="px-6 py-4">جزئیات سرویس</th>
              <th className="px-6 py-4">تاریخ و ساعت</th>
              <th className="px-6 py-4">روش پرداخت</th>
              <th className="px-6 py-4">مبلغ</th>
              <th className="px-6 py-4">وضعیت</th>
              <th className="px-6 py-4 text-left">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {payments.map((payment) => (
              <tr
                key={payment.id}
                className="group transition-colors hover:bg-slate-50/80"
              >
                {/* Service Details */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Image
                      width={100}
                      height={100}
                      src={
                        payment?.booking?.business?.logo ||
                        "/images/placeholder.png"
                      }
                      alt={payment?.booking?.business?.businessName}
                      className="h-10 w-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <p className="font-semibold text-slate-900">
                        {payment?.booking?.service?.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {payment?.booking?.business?.businessName}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Date */}
                <td className="px-6 py-4">
                  <p className="text-slate-700">
                    {payment.createdAt.toLocaleDateString("fa")}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(payment.createdAt).toLocaleTimeString("fa-IR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </td>

                {/* Method */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <MethodIcon method={payment?.method} />
                    <span className="text-slate-600 text-xs">
                      {payment?.method === "ONLINE" ? "آنلاین" : "دربی"}
                    </span>
                  </div>
                </td>

                {/* Amount */}
                <td className="px-6 py-4">
                  <span className="font-medium text-slate-900">
                    {formatCurrency(payment?.amount)}
                  </span>
                </td>

                {/* Status */}
                <td className="px-6 py-4 text-nowrap">
                  {getStatusBadge(payment?.status)}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-left">
                  <button
                    type="button"
                    onClick={() => {
                      getPaymentData(payment.id);
                      setOpenModal(true);
                    }}
                    className="text-slate-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-lg"
                  >
                    <Eye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination (Visual Only) */}
      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-4">
        <p className="text-xs text-slate-500">نمایش ۱ تا ۳ از ۳ تراکنش</p>
        <div className="flex gap-2">
          <button className="rounded border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500 disabled:opacity-50">
            قبلی
          </button>
          <button className="rounded border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500 disabled:opacity-50">
            بعدی
          </button>
        </div>
      </div>

      <Modal
        onOpenChange={setOpenModal}
        open={openModal}
        title={"paymentData"}
        width="md:max-w-2xl max-h-[94vh] overflow-scroll"
        hideActions
      >
        <PaymentDetails
          paymentData={paymentData as any}
          loading={isPending}
          onClose={() => {
            setOpenModal(false);
          }}
          onDownloadInvoice={() => {
            toast.success("فاکتور در حال آماده سازی است ...");
          }}
          onPay={() => {
            toast.success("در حال رفتن به درگاه پرداخت هستید، صبر کنید...");
          }}
        />
      </Modal>
    </div>
  );
};

export default CustomerPaymentList;
