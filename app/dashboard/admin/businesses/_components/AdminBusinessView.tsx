"use client";
import { Button } from "@/components/ui/button";
import { BUSINESS_TYPE } from "@/constants/common";
import { BusinessType } from "@/constants/enums";
import { copyTextToClipboard, getFullDateTime } from "@/utils/common";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import {
  AlertCircle,
  BadgeCheck,
  Building,
  Calendar,
  Check,
  Clock,
  Copy,
  CreditCard,
  FileText,
  Globe,
  MapPin,
  Percent,
  Phone,
  Shield,
  User,
  X,
} from "lucide-react";
import { Activity, useCallback } from "react";
import { toast } from "sonner";
import {
  approveBusiness,
  getBusinessDetail,
  rejectBusiness,
} from "../_meta/actions/businessActions";

enum BusinessRegistrationStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}
interface Props {
  id?: string;
  onSuccess?: (data: any) => void;
  onCancel?: () => void;
}

const CopyIcon = ({
  copiedText,
  successMessage = "کپی شد",
  className,
}: {
  copiedText?: string | null;
  successMessage?: string;
  className?: string;
}) => {
  return (
    <Activity mode={copiedText ? "visible" : "hidden"}>
      <Copy
        className={clsx(
          "text-primary-500 absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer hover:bg-primary-100 p-1 rounded",
          className,
        )}
        onClick={() => {
          if (!copiedText) return;
          copyTextToClipboard(copiedText).then(() => {
            toast.success(successMessage);
          });
        }}
      />
    </Activity>
  );
};

const AdminBusinessView = ({ id, onCancel, onSuccess }: Props) => {
  const queryClient = useQueryClient();

  const { data: businessDetail, isLoading } = useQuery({
    queryKey: ["admin-business-detail-view", id],
    queryFn: async () => {
      if (!id) return;
      const result = await getBusinessDetail(id);

      if (!result?.success) {
        toast.error(result?.message);
        return;
      }
      return result.businessDetail;
    },
    enabled: !!id,
  });

  const { mutateAsync: rejectHandler, isPending: rejectLoading } = useMutation({
    mutationFn: async ({
      businessId,
      reason,
    }: {
      businessId: string;
      reason: string;
    }) => {
      const response = await rejectBusiness(businessId, reason);

      if (!response.success) {
        toast.error(response.message);

        return null;
      }

      toast.success(response.message);
      onSuccess?.(response.updatedBusiness);
      queryClient.invalidateQueries({
        queryKey: ["admin-business-detail", id],
      });
      return response;
    },
  });

  const { mutateAsync: approvedHandler, isPending: approvedLoading } =
    useMutation({
      mutationFn: async ({ businessId }: { businessId: string }) => {
        const response = await approveBusiness(businessId);

        if (!response.success) {
          toast.error(response.error);
          return null;
        }

        toast.success(response.message);
        onSuccess?.(response);
        queryClient.invalidateQueries({
          queryKey: ["admin-business-detail", id],
        });
        return response;
      },
    });

  const getStatusConfig = useCallback((status: BusinessRegistrationStatus) => {
    switch (status) {
      case BusinessRegistrationStatus.APPROVED:
        return {
          color: "bg-emerald-100 text-emerald-800 border-emerald-200",
          icon: <BadgeCheck size={16} />,
          text: "تایید شده",
        };
      case BusinessRegistrationStatus.PENDING:
        return {
          color: "bg-amber-100 text-amber-800 border-amber-200",
          icon: <Clock size={16} />,
          text: "در انتظار بررسی",
        };
      case BusinessRegistrationStatus.REJECTED:
        return {
          color: "bg-rose-100 text-rose-800 border-rose-200",
          icon: <AlertCircle size={16} />,
          text: "رد شده",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: null,
          text: "نامشخص",
        };
    }
  }, []);

  const statusConfig = businessDetail
    ? getStatusConfig(businessDetail.registrationStatus as any)
    : null;

  const onRejectHandler = async () => {
    if (!businessDetail?.id) return;
    const reason = prompt("دلیل رد کسب‌وکار");
    if (!reason?.trim()) return;
    await rejectHandler({
      businessId: businessDetail.id,
      reason: reason,
    });
  };

  const onApproveHandler = async () => {
    if (!businessDetail?.id) return;
    await approvedHandler({ businessId: businessDetail?.id });
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      {/* هدر با اطلاعات اصلی */}
      <div className="p-6 bg-linear-to-r from-gray-50 to-white border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-gray-900">
                {businessDetail?.businessName}
              </h2>
              {statusConfig && (
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}
                >
                  {statusConfig.icon}
                  {statusConfig.text}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <Building size={14} />
              {BUSINESS_TYPE[businessDetail?.businessType as BusinessType]}
            </p>
          </div>

          <div className="text-left">
            <div className="text-xs text-gray-500 mb-1">شناسه کسب‌وکار</div>
            <code className="font-mono text-sm bg-gray-100 px-3 py-1 rounded-lg text-gray-700">
              {businessDetail?.identifier}
            </code>
          </div>
        </div>
      </div>

      {/* محتوای اصلی */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ستون سمت راست - اطلاعات کسب‌وکار */}
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building size={18} className="text-gray-700" />
              اطلاعات کسب‌وکار
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  شناسه / Slug
                </label>
                <div className="font-mono text-sm bg-white p-3 rounded-lg border border-gray-200 text-gray-700 relative">
                  {businessDetail?.slug}
                  <CopyIcon
                    copiedText={businessDetail?.slug}
                    successMessage="شناسه کپی شد"
                  />
                </div>
              </div>

              {/* <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  نرخ کمیسیون
                </label>
                <div className="flex items-center gap-2 text-gray-800 font-medium bg-white p-3 rounded-lg border border-gray-200">
                  <Percent size={16} className="text-blue-600" />
                  <span>{businessDetail?.commissionRate}%</span>
                </div>
              </div> */}

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  آدرس
                </label>
                <div className="flex items-start gap-3 text-gray-700 p-3 bg-white rounded-lg border border-gray-200 relative">
                  <MapPin size={18} className="text-gray-500 mt-0.5 shrink-0" />
                  <span className="text-sm leading-relaxed">
                    {businessDetail?.address || "آدرس ثبت نشده است"}
                  </span>
                  <CopyIcon
                    copiedText={businessDetail?.address}
                    successMessage="آدرس کپی شد"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  توضیحات
                </label>
                <div className="p-3 bg-white rounded-lg border border-gray-200 min-h-15 relative">
                  <p className="text-sm text-gray-600 pl-4">
                    {businessDetail?.description ||
                      "توضیحی برای این کسب‌وکار ثبت نشده است."}
                  </p>
                  <CopyIcon
                    copiedText={businessDetail?.description}
                    successMessage="توضیحات کپی شد"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    منطقه زمانی
                  </label>
                  <div className="flex items-center gap-2 text-gray-700 text-sm p-3 bg-white rounded-lg border border-gray-200">
                    <Globe size={14} className="text-gray-500" />
                    {businessDetail?.timezone}
                  </div>
                </div> */}

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    وضعیت فعال‌سازی
                  </label>
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${businessDetail?.isActive ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-gray-100 text-gray-700 border border-gray-200"}`}
                  >
                    <Shield size={14} />
                    {businessDetail?.isActive ? "فعال" : "غیرفعال"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* اطلاعات پرداخت */}
          <div className="bg-gray-50 rounded-lg p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard size={18} className="text-gray-700" />
              تنظیمات پرداخت
            </h3>

            {/* <div className="grid grid-cols-2 gap-4">
              <div
                className={`p-3 rounded-lg border ${businessDetail?.allowOnlinePayment ? "border-green-200 bg-green-50" : "border-gray-200 bg-white"}`}
              >
                <div
                  className={`w-3 h-3 rounded-full ${businessDetail?.allowOnlinePayment ? "bg-green-500" : "bg-gray-300"}`}
                ></div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 text-nowrap">
                    پرداخت آنلاین
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {businessDetail?.allowOnlinePayment ? "فعال" : "غیرفعال"}
                </p>
              </div>

              <div
                className={`p-3 rounded-lg border ${businessDetail?.allowOfflinePayment ? "border-blue-200 bg-blue-50" : "border-gray-200 bg-white"}`}
              >
                <div
                  className={`w-3 h-3 rounded-full ${businessDetail?.allowOfflinePayment ? "bg-blue-500" : "bg-gray-300"}`}
                ></div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 text-nowrap">
                    پرداخت آفلاین
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {businessDetail?.allowOfflinePayment ? "فعال" : "غیرفعال"}
                </p>
              </div>
            </div> */}
          </div>
        </div>

        {/* ستون سمت چپ - اطلاعات مالک */}
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User size={18} className="text-gray-700" />
              اطلاعات مالک
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  نام کامل
                </label>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 relative">
                  <User size={16} className="text-gray-500" />
                  <span className="font-medium text-gray-800">
                    {businessDetail?.ownerName}
                  </span>
                  <CopyIcon
                    copiedText={businessDetail?.ownerName}
                    successMessage="نام کامل کپی شد"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  شماره تماس
                </label>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 relative">
                  <Phone size={16} className="text-gray-500" />
                  <span className="font-medium text-gray-800" dir="ltr">
                    {businessDetail?.owner?.phone || "---"}
                  </span>
                  <CopyIcon
                    copiedText={businessDetail?.owner?.phone}
                    successMessage=" شماره تماس کپی شد"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  نام کاربری
                </label>
                <div className="p-3 bg-white rounded-lg border border-gray-200 relative">
                  <span className="font-mono text-sm text-gray-700">
                    {businessDetail?.owner?.username}
                  </span>
                  <CopyIcon
                    copiedText={businessDetail?.owner?.username}
                    successMessage="نام کاربری کپی شد"
                  />
                </div>
              </div>

              <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${businessDetail?.isActive ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-100 text-red-700 border border-red-200"}`}
              >
                <Shield size={14} />
                حساب کسب‌وکار: {businessDetail?.isActive ? "فعال" : "غیرفعال"}
              </div>
            </div>
          </div>

          {/* اطلاعات زمانی */}
          <div className="bg-gray-50 rounded-lg p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-gray-700" />
              اطلاعات زمانی
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">تاریخ ایجاد</span>
                <span className="text-sm font-medium text-gray-900" dir="rtl">
                  {getFullDateTime(businessDetail?.createdAt)}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">آخرین بروزرسانی</span>
                <span
                  className="text-sm font-medium text-gray-900 text-nowrap"
                  dir="rtl"
                >
                  {getFullDateTime(businessDetail?.updatedAt)}
                </span>
              </div>

              {businessDetail?.activatedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">تاریخ فعال‌سازی</span>
                  <span className="text-sm font-medium text-gray-900">
                    {businessDetail?.activatedAt
                      ? new Intl.DateTimeFormat("fa-IR").format(
                          businessDetail.activatedAt,
                        )
                      : "---"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {businessDetail?.registrationStatus === "REJECTED" &&
        businessDetail?.rejectionReason && (
          <div className="mb-4 p-4 bg-rose-50 border border-rose-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={16} className="text-rose-600" />
              <strong className="text-sm font-medium text-rose-900">
                دلیل رد:
              </strong>
            </div>
            <p className="text-sm text-rose-700 text-right">
              {businessDetail.rejectionReason}
            </p>
          </div>
        )}

      {/* فوتر با دکمه‌های اقدام */}
      <div className="p-6 border-t border-gray-100 bg-gray-50">
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button variant="outline" type="button" onClick={onCancel}>
            <X size={18} />
            بستن
          </Button>

          <Button
            loading={rejectLoading}
            variant="destructive"
            type="button"
            onClick={onRejectHandler}
          >
            <X size={18} />
            {businessDetail?.registrationStatus === "REJECTED"
              ? "تغییر دلیل رد"
              : "رد درخواست"}
          </Button>

          <Button
            type="button"
            variant="default"
            onClick={onApproveHandler}
            loading={approvedLoading}
          >
            <Check size={18} />
            {businessDetail?.registrationStatus === "APPROVED"
              ? "تایید مجدد"
              : "تایید درخواست"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminBusinessView;
