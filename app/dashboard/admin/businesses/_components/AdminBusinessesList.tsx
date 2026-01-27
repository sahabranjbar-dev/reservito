"use client";

import { useState } from "react";
import {
  Check,
  X,
  Eye,
  MapPin,
  Phone,
  User,
  Percent,
  Edit,
} from "lucide-react";
import {
  approveBusiness,
  rejectBusiness,
  updateBusinessCommission,
} from "../_meta/actions/businessActions";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
  commissionRate: number;
  createdAt: string;
  registrationStatus: BusinessStatus;
  rejectionReason: string | null;
  owner: Owner;
}

interface AdminBusinessesListProps {
  initialBusinesses: Business[];
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
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
};

const AdminBusinessesList = ({
  initialBusinesses,
}: AdminBusinessesListProps) => {
  const { refresh } = useRouter();
  const [businesses, setBusinesses] = useState<Business[]>(initialBusinesses);
  const [editMode, setEditMode] = useState(false);
  const [tempCommission, setTempCommission] = useState<number | null>(null);

  // State for Modals
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(
    null
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // هندل کردن تایید (قابل استفاده برای تمام وضعیت‌ها)
  const handleApprove = async (id: string) => {
    setLoading(true);
    setToastMessage(null);

    // 1. بهینه‌سازی UI (Optimistic Update)
    const oldList = [...businesses];
    setBusinesses((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              registrationStatus: BusinessStatus.APPROVED,
              rejectionReason: null,
            }
          : b
      )
    );

    // 2. فراخوانی اکشن سرور
    const result = await approveBusiness(id);

    // 3. هندل نتیجه
    if (!result.success) {
      setBusinesses(oldList); // بازگشت به حالت قبل در صورت خطا
      setToastMessage("خطا: " + result.message);
    } else {
      setToastMessage(result.message);
      setIsDetailsOpen(false);
    }
    setLoading(false);
  };

  // هندل کردن باز کردن مودال رد
  const openRejectModal = (id: string) => {
    setRejectionReason("");
    setIsRejectModalOpen(true);
  };

  // هندل کردن ثبت رد کردن
  const handleRejectSubmit = async () => {
    if (!selectedBusiness) return;
    if (!rejectionReason.trim()) return alert("لطفا دلیل رد کردن را وارد کنید");

    setLoading(true);
    setToastMessage(null);

    // 1. بهینه‌سازی UI
    const oldList = [...businesses];
    setBusinesses((prev) =>
      prev.map((b) =>
        b.id === selectedBusiness.id
          ? {
              ...b,
              registrationStatus: BusinessStatus.REJECTED,
              rejectionReason,
            }
          : b
      )
    );

    // 2. فراخوانی اکشن سرور
    const result = await rejectBusiness(selectedBusiness.id, rejectionReason);

    // 3. هندل نتیجه
    if (!result.success) {
      setBusinesses(oldList);
      setToastMessage("خطا: " + result.message);
    } else {
      setToastMessage(result.message);
      setIsRejectModalOpen(false);
      setIsDetailsOpen(false);
    }
    setLoading(false);
  };

  return (
    <div
      className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 font-sans dir-rtl"
      style={{ direction: "rtl" }}
    >
      {toastMessage && (
        <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-200 flex justify-between items-center">
          {toastMessage}
          <button
            onClick={() => setToastMessage(null)}
            className="text-blue-500 font-bold"
          >
            ×
          </button>
        </div>
      )}

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
                  <td className="p-4 text-gray-600">{business.businessType}</td>
                  <td className="p-4 text-gray-500">
                    {new Date(business.createdAt).toLocaleDateString("fa-IR")}
                  </td>
                  <td className="p-4">
                    <StatusBadge status={business.registrationStatus} />
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedBusiness(null);
                          setSelectedBusiness(business);
                          setIsDetailsOpen(true);
                        }}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="مشاهده و تغییر وضعیت"
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= مودال جزئیات ================= */}
      {isDetailsOpen && selectedBusiness && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">
                جزئیات و مدیریت
              </h3>
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="group flex justify-between">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      نام کسب‌وکار
                    </label>
                    <div className="font-semibold text-lg text-gray-800">
                      {selectedBusiness.businessName}
                    </div>
                  </div>
                  <div className="group-hover:opacity-100 opacity-0 duration-200">
                    <Edit className="text-gray-500 border bg-gray-100 rounded cursor-pointer" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    نام مالک
                  </label>
                  <div className="flex items-center gap-2 text-gray-700">
                    <User size={16} className="text-gray-400" />
                    {selectedBusiness.ownerName}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    شماره تماس
                  </label>
                  <div
                    className="flex items-center gap-2 text-gray-700"
                    dir="ltr"
                  >
                    <Phone size={16} className="text-gray-400" />
                    {selectedBusiness.owner?.phone || "---"}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    شناسه / Slug
                  </label>
                  <div className="font-mono text-sm bg-gray-100 p-2 rounded text-gray-600">
                    {selectedBusiness.slug}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    دسته بندی
                  </label>
                  <div className="text-gray-800 font-medium">
                    {selectedBusiness.businessType}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    آدرس
                  </label>
                  <div className="flex items-start gap-2 text-gray-600 text-sm leading-relaxed">
                    <MapPin size={16} className="text-gray-400 mt-1 shrink-0" />
                    {selectedBusiness.address || "ثبت نشده"}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    توضیحات
                  </label>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {selectedBusiness.description || "توضیحی ثبت نشده است."}
                  </p>
                </div>
                <div className="flex items-center gap-4 group justify-between">
                  <div className="flex items-center gap-1 text-gray-700">
                    <Percent size={16} className="text-blue-500" />
                    <span>کمیسیون: </span>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={
                        editMode
                          ? tempCommission ?? ""
                          : selectedBusiness.commissionRate
                      }
                      readOnly={!editMode}
                      className="w-20 text-center focus-visible:ring-0"
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (isNaN(value)) return;
                        setTempCommission(value);
                      }}
                    />
                    %
                  </div>
                  <div>
                    {editMode ? (
                      <div className="flex items-center gap-2">
                        {/* SAVE */}
                        <Check
                          className="text-green-600 border bg-green-50 rounded cursor-pointer"
                          onClick={() => {
                            if (tempCommission === null) return;
                            if (tempCommission < 0 || tempCommission > 100) {
                              alert("کمیسیون باید بین ۰ تا ۱۰۰ باشد");
                              return;
                            }

                            setSelectedBusiness((prev) =>
                              prev
                                ? { ...prev, commissionRate: tempCommission }
                                : prev
                            );

                            setEditMode(false);
                            setTempCommission(null);

                            // TODO: بعداً اینجا API می‌زنیم
                            updateBusinessCommission(
                              selectedBusiness.id,
                              tempCommission
                            ).then((data) => {
                              if (!data.success) return;
                              toast.success(data?.message);
                              setEditMode(false);
                              setTempCommission(null);
                              setIsDetailsOpen(false);
                              refresh();
                            });
                          }}
                        />

                        {/* CANCEL */}
                        <X
                          className="text-gray-500 border bg-gray-100 rounded cursor-pointer"
                          onClick={() => {
                            setEditMode(false);
                            setTempCommission(null);
                          }}
                        />
                      </div>
                    ) : (
                      <Edit
                        className="text-gray-500 border bg-gray-100 rounded cursor-pointer group-hover:opacity-100 opacity-0 duration-200"
                        onClick={() => {
                          setTempCommission(selectedBusiness.commissionRate);
                          setEditMode(true);
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* فوتر اکشن‌ها (همیشه قابل تغییر) */}
            <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-end gap-3">
              {selectedBusiness.registrationStatus ===
                BusinessStatus.REJECTED && (
                <div className="w-full mb-2 p-3 bg-red-50 text-red-700 text-sm rounded-lg text-wrap overflow-scroll max-h-20">
                  <strong>علت رد قبلی:</strong>{" "}
                  {selectedBusiness.rejectionReason || "ندارد"}
                </div>
              )}

              <button
                onClick={() => openRejectModal(selectedBusiness.id)}
                disabled={loading}
                className="px-6 py-2.5 text-nowrap rounded-xl border border-red-200 text-red-600 font-medium hover:bg-red-50 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X size={18} />
                {selectedBusiness.registrationStatus === BusinessStatus.REJECTED
                  ? "تغییر دلیل رد"
                  : "رد کردن"}
              </button>

              <button
                onClick={() => handleApprove(selectedBusiness.id)}
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition flex items-center gap-2 shadow-lg shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check size={18} />
                {selectedBusiness.registrationStatus === BusinessStatus.APPROVED
                  ? "تایید مجدد (ریست)"
                  : "تایید و فعال‌سازی"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= مودال علت رد کردن ================= */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              ثبت دلیل رد کردن
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              لطفا دلیل عدم تایید را بنویسید. این پیام برای کاربر ارسال می‌شود.
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full h-32 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none mb-4"
              placeholder="مثال: مدارک هویتی نامعتبر است، آدرس مشخص نیست..."
            ></textarea>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                disabled={loading}
                className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
              >
                انصراف
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition shadow-lg shadow-red-200 disabled:opacity-50"
              >
                {loading ? "در حال ثبت..." : "ثبت و ارسال"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBusinessesList;
