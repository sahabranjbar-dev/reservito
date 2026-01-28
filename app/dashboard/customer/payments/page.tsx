import { authOptions } from "@/utils/authOptions";
import { formatCurrency } from "@/utils/common";
import prisma from "@/utils/prisma";
import { ArrowDownLeft, Download, Filter, Receipt, Wallet } from "lucide-react";
import { getServerSession } from "next-auth";
import CustomerPaymentList from "./_components/CustomerPaymentList";

const CustomerPayment = async () => {
  const session = await getServerSession(authOptions);

  const userId = session?.user.id;

  const payments = await prisma.payment.findMany({
    where: {
      verifiedById: userId,
    },
    include: {
      booking: {
        include: {
          business: true,
          createdBy: true,
          payments: true,
          service: true,
          staff: true,
        },
      },
      business: true,
      verifiedBy: true,
    },
  });

  // محاسبات آماری ساده
  const totalPaid = payments
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalRefunded = payments
    .filter((p) => p.status === "REFUNDED")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div
      className="min-h-screen bg-slate-50 p-4 sm:p-8 font-sans text-slate-800"
      dir="rtl"
    >
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header Section */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              تراکنش‌های مالی
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              مشاهده تاریخچه پرداخت‌ها و وضعیت رزروها
            </p>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50">
              <Filter className="h-4 w-4" />
              فیلتر
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50">
              <Download className="h-4 w-4" />
              خروجی Excel
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <Wallet className="h-6 w-6" />
              </div>
              <span className="text-xs font-medium text-slate-400">
                مجموع پرداختی
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(totalPaid)}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                {payments.filter((p) => p.status === "PAID").length} تراکنش موفق
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
                <ArrowDownLeft className="h-6 w-6" />
              </div>
              <span className="text-xs font-medium text-slate-400">
                مجموع برگشتی
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(totalRefunded)}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                {payments.filter((p) => p.status === "REFUNDED").length} تراکنش
                لغو شده
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-linear-to-br from-slate-900 to-slate-800 p-6 shadow-sm text-white transition-all hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-white/10 rounded-lg text-white">
                <Receipt className="h-6 w-6" />
              </div>
              <span className="text-xs font-medium text-slate-300">
                اعتبار فعلی
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-white">۰ تومان</p>
              <p className="text-sm text-slate-400 mt-1">موجودی کیف پول</p>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <CustomerPaymentList payments={payments as any} />
      </div>
    </div>
  );
};

export default CustomerPayment;
