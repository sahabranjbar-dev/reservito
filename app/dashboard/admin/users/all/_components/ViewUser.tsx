"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  User,
  Phone,
  Mail,
  Calendar,
  Shield,
  Building,
  Star,
  Clock,
  Edit,
  Trash2,
  Power,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Key,
  Layers,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import {
  addUserRole,
  deleteUser,
  getUserDetails,
  removeUserRole,
  restoreUser,
  toggleUserStatus,
} from "../_meta/actions";
import { Role } from "@/constants/enums";

interface UserDetail {
  id: string;
  fullName: string | null;
  phone: string;
  email: string | null;
  username: string | null;
  avatar: string | null;
  isActive: boolean;
  deletedAt: string | null;
  createdAt: Date;
  lastLoginAt: Date | null;
  roles: { id: string; role: Role }[];
  businessMembers: any[];
  ownedBusinesses: any[];
  bookings: any[];
  favorites: any[];
}

interface Props {
  id: string;
}

// --- Helper Components ---

const StatCard = ({
  title,
  value,
  icon: Icon,
  colorClass,
  valueClass,
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  colorClass: string;
  valueClass?: string;
}) => (
  <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {title}
        </p>
        <p
          className={`text-2xl font-bold mt-1 text-gray-900 dark:text-white ${valueClass}`}
        >
          {value}
        </p>
      </div>
      <div className={`p-3 rounded-lg ${colorClass}`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </div>
);

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText,
  variant = "destructive",
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText?: string;
  variant?: "destructive" | "default" | "warning";
  isLoading: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-gray-100 dark:border-gray-700 animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center mb-6">
          <div
            className={`p-3 rounded-full mb-4 ${
              variant === "destructive"
                ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                : "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
            }`}
          >
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {description}
          </p>
        </div>
        <div className="flex items-center gap-3 justify-end">
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full sm:w-auto"
            disabled={isLoading}
          >
            {cancelText || "انصراف"}
          </Button>
          <Button
            onClick={onConfirm}
            variant={variant === "destructive" ? "destructive" : "default"}
            className={`w-full sm:w-auto ${
              variant !== "destructive" &&
              "bg-green-600 hover:bg-green-700 text-white"
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- Helper Functions ---

const formatDate = (dateString: string | Date | null) => {
  if (!dateString) return "نامشخص";
  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const getStatusBadge = (isActive: boolean, deletedAt: string | null) => {
  if (deletedAt)
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
        حذف شده
      </span>
    );
  if (isActive)
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
        فعال
      </span>
    );
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
      غیرفعال
    </span>
  );
};

const getRoleBadge = (role: string) => {
  const styles = {
    SUPER_ADMIN:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    CUSTOMER:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  };
  const labels = {
    SUPER_ADMIN: "مدیر کل",
    CUSTOMER: "مشتری",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[role as keyof typeof styles] || styles.CUSTOMER}`}
    >
      {labels[role as keyof typeof labels] || role}
    </span>
  );
};

// --- Main Component ---

const ViewUser = ({ id }: Props) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Dialog States
  const [dialogs, setDialogs] = useState({
    delete: false,
    restore: false,
  });

  // Form State
  const [selectedRole, setSelectedRole] = useState<Role>(Role.CUSTOMER);

  // --- Queries ---
  const {
    data: userData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user-details", id],
    queryFn: async () => {
      const result = await getUserDetails(id);
      if (!result.success) throw new Error(result.message);
      return result.user as UserDetail;
    },
    enabled: !!id,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });

  // --- Mutations ---

  const toggleStatusMutation = useMutation({
    mutationFn: () => toggleUserStatus(id),
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ["user-details", id] });
    },
    onError: () => toast.error("خطا در تغییر وضعیت کاربر"),
  });

  const deleteUserMutation = useMutation({
    mutationFn: () => deleteUser(id),
    onSuccess: (res) => {
      toast.success(res.message);
      setDialogs((prev) => ({ ...prev, delete: false }));
      queryClient.invalidateQueries({ queryKey: ["user-details", id] });
    },
    onError: () => toast.error("خطا در حذف کاربر"),
  });

  const restoreUserMutation = useMutation({
    mutationFn: () => restoreUser(id),
    onSuccess: (res) => {
      toast.success(res.message);
      setDialogs((prev) => ({ ...prev, restore: false }));
      queryClient.invalidateQueries({ queryKey: ["user-details", id] });
    },
    onError: () => toast.error("خطا در بازیابی کاربر"),
  });

  const addRoleMutation = useMutation({
    mutationFn: (role: Role) => addUserRole(id, role),
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ["user-details", id] });
    },
    onError: () => toast.error("خطا در افزودن نقش"),
  });

  const removeRoleMutation = useMutation({
    mutationFn: (roleId: string) => removeUserRole(id, roleId),
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ["user-details", id] });
    },
    onError: () => toast.error("خطا در حذف نقش"),
  });

  // --- Handlers ---

  const handleAddRole = () => {
    // چک می‌کنیم آیا نقش قبلا وجود دارد
    const exists = userData?.roles.some((r) => r.role === selectedRole);
    if (exists) {
      toast.error("این نقش قبلاً برای کاربر ثبت شده است.");
      return;
    }
    addRoleMutation.mutate(selectedRole);
  };

  // --- Loading & Error States ---

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-500 dark:text-gray-400">
          در حال بارگذاری پروفایل...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[400px] bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
          خطا در بارگذاری
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md">
          {(error as Error).message}
        </p>
        <Button onClick={() => refetch()} variant="outline">
          تلاش مجدد
        </Button>
      </div>
    );
  }

  if (!userData) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Profile Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="h-24 w-24 rounded-2xl bg-gray-100 dark:bg-gray-700 overflow-hidden ring-4 ring-white dark:ring-gray-800 shadow-sm">
              {userData.avatar ? (
                <Image
                  src={userData.avatar}
                  alt={userData.fullName || "Avatar"}
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-400">
                  <User className="h-10 w-10" />
                </div>
              )}
            </div>
            {/* Status Indicator */}
            <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
              <div
                className={`h-4 w-4 rounded-full border-2 border-white dark:border-gray-800 ${
                  userData.deletedAt
                    ? "bg-red-500"
                    : userData.isActive
                      ? "bg-green-500"
                      : "bg-amber-500"
                }`}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {userData.fullName || "کاربر بدون نام"}
              </h1>
              {getStatusBadge(userData.isActive, userData.deletedAt)}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-400 mt-2">
              <div className="flex items-center">
                <Phone className="h-4 w-4 ml-1.5 opacity-70" />
                <span dir="ltr">{userData.phone}</span>
              </div>
              {userData.email && (
                <div className="flex items-center">
                  <Mail className="h-4 w-4 ml-1.5 opacity-70" />
                  <span>{userData.email}</span>
                </div>
              )}
              {userData.username && (
                <div className="flex items-center">
                  <User className="h-4 w-4 ml-1.5 opacity-70" />
                  <span>@{userData.username}</span>
                </div>
              )}
            </div>
            <div className="mt-3 text-xs text-gray-500 dark:text-gray-500 flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              <span>عضویت: {formatDate(userData.createdAt)}</span>
              {userData.lastLoginAt && (
                <span className="mr-2">
                  • آخرین بازدید: {formatDate(userData.lastLoginAt)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-2 w-full md:w-auto">
          <Button
            variant={userData.isActive ? "outline" : "default"}
            className="w-full md:w-auto justify-start"
            disabled={!!userData.deletedAt}
            onClick={() => toggleStatusMutation.mutate()}
            loading={toggleStatusMutation.isPending}
          >
            <Power className="h-4 w-4 ml-2" />
            {userData.isActive ? "غیرفعال کردن" : "فعال کردن"}
          </Button>
          <Button variant="ghost" className="w-full md:w-auto justify-start">
            <Edit className="h-4 w-4 ml-2" />
            ویرایش اطلاعات
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="نقش‌ها"
          value={userData.roles.length}
          icon={Shield}
          colorClass="bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400"
        />
        <StatCard
          title="کسب‌وکارها"
          value={
            userData.ownedBusinesses.length + userData.businessMembers.length
          }
          icon={Building}
          colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
        />
        <StatCard
          title="نوبت‌ها"
          value={userData.bookings.length}
          icon={Calendar}
          colorClass="bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400"
        />
        <StatCard
          title="علاقه‌مندی‌ها"
          value={userData.favorites.length}
          icon={Star}
          colorClass="bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400"
        />
      </div>

      {/* Tabs Content */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden min-h-[400px]">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 pt-4 overflow-x-auto">
          <div className="flex space-x-6 space-x-reverse">
            {[
              { id: "overview", label: "نقش‌ها و دسترسی", icon: Shield },
              { id: "businesses", label: "کسب‌وکارها", icon: Building },
              { id: "bookings", label: "نوبت‌های اخیر", icon: Calendar },
              { id: "favorites", label: "علاقه‌مندی‌ها", icon: Star },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 space-x-reverse pb-4 border-b-2 transition-colors text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Panels */}
        <div className="p-6">
          {/* Roles Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                    <Key className="h-5 w-5 ml-2 text-blue-500" />
                    مدیریت نقش‌ها
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    سطح دسترسی کاربر را تعیین کنید
                  </p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as Role)}
                    className="h-9 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 flex-1 sm:flex-none"
                  >
                    <option value="CUSTOMER">مشتری</option>
                    <option value="SUPER_ADMIN">مدیر کل</option>
                  </select>
                  <Button
                    size="sm"
                    onClick={handleAddRole}
                    disabled={addRoleMutation.isPending}
                  >
                    {addRoleMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Plus className="h-4 w-4 ml-1" />{" "}
                        {/* Add Plus import if needed, or use text */}
                        افزودن
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  نقش‌های فعلی
                </h4>
                <div className="flex flex-wrap gap-3">
                  {userData.roles.length > 0 ? (
                    userData.roles.map((role) => (
                      <div
                        key={role.id}
                        className="group flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-700 rounded-full border border-gray-200 dark:border-gray-600 shadow-sm"
                      >
                        {getRoleBadge(role.role)}
                        <button
                          onClick={() => removeRoleMutation.mutate(role.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                          title="حذف نقش"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-400 italic py-2">
                      هیچ نقشی تعریف نشده است.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Businesses Tab */}
          {activeTab === "businesses" && (
            <div className="space-y-6">
              {userData.ownedBusinesses.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 uppercase tracking-wide">
                    مالکیت‌ها
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userData.ownedBusinesses.map((biz) => (
                      <div
                        key={biz.id}
                        className="p-4 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10 flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {biz.businessName}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {biz.businessType}
                          </p>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          مالک
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {userData.businessMembers.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 uppercase tracking-wide">
                    همکاری‌ها
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userData.businessMembers.map((member) => (
                      <div
                        key={member.id}
                        className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {member.business.businessName}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {member.business.businessType}
                          </p>
                        </div>
                        <span className="text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                          {member.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {userData.ownedBusinesses.length === 0 &&
                userData.businessMembers.length === 0 && (
                  <div className="text-center py-10 text-gray-400">
                    سابقه کسب‌وکاری یافت نشد.
                  </div>
                )}
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === "bookings" && (
            <div className="space-y-3">
              {userData.bookings.length > 0 ? (
                userData.bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">
                          {booking.service?.name || "سرویس نامشخص"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {booking.business.businessName}
                        </p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-medium text-gray-900 dark:text-white mb-1">
                        {formatDate(booking.startTime)}
                      </p>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          booking.status === "COMPLETED"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                  <Clock className="h-10 w-10 mb-2 opacity-50" />
                  <p>هنوز نوبتی ثبت نشده است.</p>
                </div>
              )}
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === "favorites" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {userData.favorites.map((fav) => (
                <div
                  key={fav.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {fav.business.businessName}
                  </span>
                </div>
              ))}
              {userData.favorites.length === 0 && (
                <p className="text-gray-400 col-span-full text-center py-6">
                  لیست علاقه‌مندی خالی است.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-red-100 dark:border-red-900/30 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          مدیریت وضعیت حساب
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-2xl">
          در این بخش می‌توانید حساب کاربری را به صورت نرم حذف (Soft Delete) کنید
          یا در صورت حذف بودن، آن را بازیابی نمایید.
        </p>
        <div className="flex items-center gap-3">
          {!userData.deletedAt ? (
            <Button
              variant="destructive"
              onClick={() => setDialogs((prev) => ({ ...prev, delete: true }))}
            >
              <Trash2 className="h-4 w-4 ml-2" />
              حذف کاربر
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => setDialogs((prev) => ({ ...prev, restore: true }))}
              className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700"
            >
              <RefreshCw className="h-4 w-4 ml-2" />
              بازیابی کاربر
            </Button>
          )}
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={dialogs.delete}
        onClose={() => setDialogs((prev) => ({ ...prev, delete: false }))}
        onConfirm={() => deleteUserMutation.mutate()}
        title="حذف کاربر؟"
        description={`آیا مطمئن هستید که می‌خواهید کاربر «${userData.fullName || userData.phone}» را حذف کنید؟ این کار اطلاعات را از دسترسی خارج می‌کند اما قابل بازیابی است.`}
        confirmText="بله، حذف کن"
        isLoading={deleteUserMutation.isPending}
        variant="destructive"
      />

      <ConfirmDialog
        isOpen={dialogs.restore}
        onClose={() => setDialogs((prev) => ({ ...prev, restore: false }))}
        onConfirm={() => restoreUserMutation.mutate()}
        title="بازیابی کاربر؟"
        description={`آیا می‌خواهید دسترسی کاربر «${userData.fullName || userData.phone}» را بازگردانید؟`}
        confirmText="بله، بازیابی کن"
        isLoading={restoreUserMutation.isPending}
        variant="default"
      />
    </div>
  );
};

// کامپوننت Plus برای دکمه افزودن نقش (اگر در کتابخانه آیکون‌ها نیست)
const Plus = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

export default ViewUser;
