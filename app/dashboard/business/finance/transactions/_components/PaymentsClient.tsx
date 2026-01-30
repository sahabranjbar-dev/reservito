"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal, FileText, Download } from "lucide-react";
import { PaymentMethod, PaymentStatus } from "@/constants/enums";

type EnrichedPayment = {
  id: string;
  amount: number; // مبلغ کل
  status: PaymentStatus;
  method: PaymentMethod;
  refId: string | null;
  createdAt: Date;
  businessShare: number; // سهم بیزنس
  platformFee: number; // کمیسیون پلتفرم
  booking: {
    id: string;
    totalPrice: number;
    commission: {
      businessShare: number;
      platformFee: number;
    };
    customer: {
      fullName: string | null;
      phone: string | null;
    };
    service: {
      name: string;
    };
    staff: {
      name: string;
    };
  };
};

interface PaymentsClientProps {
  payments: EnrichedPayment[];
}

const PaymentStatusBadge = ({ status }: { status: PaymentStatus }) => {
  const styles = {
    UNPAID: "bg-yellow-100 text-yellow-800 border-yellow-200",
    PAID: "bg-green-100 text-green-800 border-green-200",
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    FAILED: "bg-red-100 text-red-800 border-red-200",
    REFUNDED: "bg-gray-100 text-gray-800 border-gray-200",
  };

  const labels = {
    UNPAID: "پرداخت نشده",
    PAID: "پرداخت موفق",
    PENDING: "در انتظار",
    FAILED: "ناموفق",
    REFUNDED: "بازگشت وجه",
  };

  return (
    <Badge variant="outline" className={styles[status]}>
      {labels[status]}
    </Badge>
  );
};

/* ==============================
   Main Component
============================== */

const PaymentsClient = ({ payments }: PaymentsClientProps) => {
  const [selectedPayment, setSelectedPayment] =
    useState<EnrichedPayment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // فیلترها
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [filterMethod, setFilterMethod] = useState<string>("ALL");

  // محاسبه آمار
  const stats = useMemo(() => {
    const totalRevenue = payments?.reduce((sum, p) => sum + p.amount, 0);
    const totalIncome = payments?.reduce((sum, p) => {
      if (!p?.booking?.commission?.businessShare) return sum;
      return sum + p?.booking?.commission?.businessShare;
    }, 0);
    const totalFees = payments?.reduce((sum, p) => {
      if (!p?.booking?.commission?.platformFee) return sum;
      return sum + p?.booking?.commission?.platformFee;
    }, 0);

    return {
      totalRevenue,
      totalIncome,
      totalFees,
      count: payments.length,
    };
  }, [payments]);

  // فیلتر کردن لیست
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      if (filterStatus !== "ALL" && p.status !== filterStatus) return false;
      if (filterMethod !== "ALL" && p.method !== filterMethod) return false;
      return true;
    });
  }, [payments, filterStatus, filterMethod]);

  const handleViewDetails = (payment: EnrichedPayment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            درآمد و پرداخت‌ها
          </h2>
          <p className="text-sm text-slate-500">
            مشاهده فاکتورها و مدیریت تراکنش‌های مالی
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-700">
              درآمد کل (فروش)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {stats.totalRevenue.toLocaleString("fa-IR")} تومان
            </div>
            <p className="text-xs text-blue-600 mt-1">
              تعداد تراکنش: {stats.count.toLocaleString("fa-IR")}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-orange-700">
              کمیسیون پلتفرم
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">
              {stats.totalFees.toLocaleString("fa-IR")} تومان
            </div>
            <p className="text-xs text-orange-600 mt-1">کسر شده از درآمد</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-700">
              درآمد خالص (شما)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {stats.totalIncome.toLocaleString("fa-IR")} تومان
            </div>
            <p className="text-xs text-green-600 mt-1">قابل تسویه حساب</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">وضعیت:</span>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="همه" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">همه</SelectItem>
                  <SelectItem value="PAID">موفق</SelectItem>
                  <SelectItem value="PENDING">در انتظار</SelectItem>
                  <SelectItem value="FAILED">ناموفق</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">روش:</span>
              <Select value={filterMethod} onValueChange={setFilterMethod}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="همه" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">همه</SelectItem>
                  <SelectItem value="ONLINE">آنلاین</SelectItem>
                  <SelectItem value="OFFLINE">آفلاین</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">تاریخ / شماره</TableHead>
                <TableHead className="text-right">مشتری</TableHead>
                <TableHead className="text-right">سرویس / پرسنل</TableHead>
                <TableHead className="text-right">مبلغ کل</TableHead>
                <TableHead className="text-right">کمیسیون</TableHead>
                <TableHead className="text-right">سهم شما</TableHead>
                <TableHead className="text-right">وضعیت</TableHead>
                <TableHead className="text-center">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-24 text-center text-slate-500"
                  >
                    هیچ تراکنشی یافت نشد.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="text-right">
                      <div className="font-medium text-slate-900">
                        {new Date(payment.createdAt).toLocaleDateString(
                          "fa-IR",
                        )}
                      </div>
                      <div className="text-xs text-slate-500 font-mono">
                        #{payment.refId || payment.id.slice(0, 8)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="text-sm font-medium">
                        {payment.booking.customer.fullName}
                      </div>
                      <div
                        className="text-xs text-slate-500 dir-ltr"
                        style={{ direction: "ltr" }}
                      >
                        {payment.booking.customer.phone}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="text-sm">
                        {payment.booking.service.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        با {payment.booking.staff.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {payment?.amount.toLocaleString("fa-IR")} تومان
                    </TableCell>
                    <TableCell className="text-right text-orange-600">
                      -{payment?.platformFee?.toLocaleString("fa-IR")}
                    </TableCell>
                    <TableCell className="text-right font-bold text-green-600">
                      {payment?.businessShare?.toLocaleString("fa-IR")}
                    </TableCell>
                    <TableCell>
                      <PaymentStatusBadge status={payment.status} />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal size={18} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(payment)}
                          >
                            <Eye size={16} className="ml-2" />
                            مشاهده فاکتور
                          </DropdownMenuItem>
                          <DropdownMenuItem disabled>
                            <FileText size={16} className="ml-2" />
                            چاپ PDF (به زودی)
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Invoice Modal */}
      {isModalOpen && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg bg-white animate-in fade-in zoom-in duration-200">
            <CardHeader className="border-b flex justify-between items-center">
              <CardTitle>فاکتور پرداخت</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">نام مشتری:</span>
                <span className="font-medium">
                  {selectedPayment.booking.customer.fullName}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">سرویس:</span>
                <span className="font-medium">
                  {selectedPayment.booking.service.name}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">پرسنل:</span>
                <span className="font-medium">
                  {selectedPayment.booking.staff.name}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">شماره پیگیری:</span>
                <span className="font-mono">
                  {selectedPayment.refId || "-"}
                </span>
              </div>

              <div className="border-t pt-4 mt-4 space-y-2">
                <div className="flex justify-between">
                  <span>مبلغ کل:</span>
                  <span>
                    {selectedPayment.amount.toLocaleString("fa-IR")} تومان
                  </span>
                </div>
                <div className="flex justify-between text-orange-600">
                  <span>کمیسیون پلتفرم:</span>
                  <span>
                    -{selectedPayment?.platformFee?.toLocaleString("fa-IR")}{" "}
                    تومان
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>سهم نهایی شما:</span>
                  <span className="text-green-600">
                    {selectedPayment?.businessShare?.toLocaleString("fa-IR")}{" "}
                    تومان
                  </span>
                </div>
              </div>

              <Button
                className="w-full gap-2"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                <Download size={16} />
                بستن
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PaymentsClient;
