"use client";

import { BaseField, DisabledSection, Form, TextCore } from "@/components";
import { Button } from "@/components/ui/button";
import { AtSign, Bell, CircleCheckBig, Lock, Mail, User } from "lucide-react";
import Image from "next/image";
import { Activity, FormEvent, useState } from "react";
import OtpCodeInput from "./OtpCodeInput";
import { convertToEnglishDigits, validateEmail } from "@/utils/common";
import { useMutation } from "@tanstack/react-query";
import { updateCustomerProfile } from "../_meta/actions";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface IFormValues {
  id: string;
  phone: string;
  email?: string | null;
  username?: string | null;
  fullName?: string | null;
  validPhone?: string;
}

interface UserInfo {
  id: string;
  phone: string;
  email: string | null;
  username: string | null;
  fullName: string | null;
  avatar: string | null;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  deletedAt: Date | null;
}

interface Props {
  userInfo: UserInfo | null;
}

const CustomerSettingForm = ({ userInfo: user }: Props) => {
  const { update: updateSession, data: sessionData } = useSession();

  const updateSessionHandler = async (fullName?: string | null) => {
    await updateSession({
      user: {
        ...sessionData?.user,
        name: fullName,
      },
    });
  };
  const [activeTab, setActiveTab] = useState<
    "profile" | "security" | "notifications"
  >("profile");

  const { mutateAsync, isPending: updateLoading } = useMutation({
    mutationFn: async ({
      email,
      fullName,
      phone,
      username,
    }: {
      email?: string | null;
      fullName?: string | null;
      phone: string;
      username?: string | null;
    }) => {
      const result = await updateCustomerProfile({
        email,
        fullName,
        phone,
        username,
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      updateSessionHandler(result.updatedUser?.fullName);
      return result;
    },
  });
  // اکشن: بروزرسانی پروفایل
  const handleProfileSubmit = async ({
    phone,
    validPhone,
    email,
    fullName,
    username,
  }: IFormValues) => {
    if (convertToEnglishDigits(phone) !== validPhone) {
      toast.error("شماره تماس تایید نشده است");
      return;
    }

    await mutateAsync({
      phone: convertToEnglishDigits(phone),
      email: email,
      fullName: fullName,
      username: username,
    });
  };

  // اکشن: تغییر رمز عبور
  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    toast.info("به زودی این قابلیت فعال خواهد شد");
    return;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800" dir="rtl">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* --- Sidebar --- */}
          <div className="md:col-span-1 space-y-6">
            {/* User Summary Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
              <div className="relative w-24 h-24 mb-4">
                <Image
                  width={100}
                  height={100}
                  src={user?.avatar || "/images/placeholder.png"}
                  alt={user?.fullName || "User"}
                  className="w-full h-full rounded-full object-cover border-4 border-indigo-50"
                />
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                {user?.fullName}
              </h2>
              <p className="text-sm text-gray-500 mb-1">
                {user?.email || user?.phone}
              </p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                مشتری
              </span>
            </div>

            {/* Navigation Menu */}
            <nav className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === "profile"
                    ? "bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <User size={18} />
                اطلاعات حساب کاربری
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === "security"
                    ? "bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Lock size={18} />
                امنیت و رمز عبور
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === "notifications"
                    ? "bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Bell size={18} />
                اعلان‌ها
              </button>
            </nav>
          </div>

          {/* --- Main Content Area --- */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              {/* Profile Settings Tab */}
              {activeTab === "profile" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    تنظیمات پروفایل
                  </h2>

                  <Form
                    defaultValues={{
                      fullName: user?.fullName,
                      email: user?.email,
                      phone: user?.phone,
                      username: user?.username,
                      validPhone: user?.phone,
                    }}
                    onSubmit={handleProfileSubmit}
                    className="space-y-6"
                  >
                    {({ watch }) => {
                      return (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <BaseField
                              name="fullName"
                              component={TextCore}
                              label="نام و نام خانوادگی"
                            />

                            <BaseField
                              name="username"
                              component={TextCore}
                              label="نام کاربری"
                              icon={<AtSign />}
                            />

                            <BaseField
                              name="email"
                              type="email"
                              component={TextCore}
                              label="آدرس ایمیل"
                              icon={<Mail />}
                              placeholder="@gmail.com"
                              className="pl-10"
                              dir="ltr"
                              validate={(value) => {
                                if (!value) return true;
                                const { valid, message } = validateEmail(
                                  value,
                                  false,
                                );
                                if (!valid) return message;
                                return true;
                              }}
                            />
                          </div>

                          <div className="space-y-2 grid grid-cols-1 lg:grid-cols-2 gap-4 border rounded-2xl p-2 bg-slate-50">
                            <div>
                              <BaseField
                                name="phone"
                                component={TextCore}
                                label="شماره موبایل"
                                required
                                placeholder={true}
                                description={
                                  "تغییر شماره موبایل نیاز به تاییدیه پیامکی دارد."
                                }
                                dir="ltr"
                              />

                              <Activity
                                mode={
                                  watch("validPhone") === watch("phone")
                                    ? "visible"
                                    : "hidden"
                                }
                              >
                                <p className="tex-xs text-green-600 flex justify-start items-center gap-2">
                                  <CircleCheckBig
                                    size={16}
                                    className="animate-pulse"
                                  />
                                  شماره موبایل تایید شد
                                </p>
                              </Activity>
                            </div>

                            <div className="place-content-start mt-8">
                              <OtpCodeInput />
                            </div>
                          </div>

                          <div className="pt-4 border-t border-gray-100 flex justify-end">
                            <Button loading={updateLoading} type="submit">
                              ذخیره تغییرات
                            </Button>
                          </div>
                        </>
                      );
                    }}
                  </Form>
                </div>
              )}

              {/* Security Settings Tab */}
              {activeTab === "security" && (
                <div className="relative">
                  <DisabledSection />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    امنیت حساب
                  </h2>
                  <p className="text-gray-500 mb-8 text-sm">
                    برای حفظ امنیت حساب خود، از رمز عبور قوی استفاده کنید.
                  </p>

                  <form
                    onSubmit={handlePasswordSubmit}
                    className="space-y-6 max-w-lg"
                  >
                    {/* Current Password */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        رمز عبور فعلی
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        required
                        className="w-full rounded-lg border-gray-300 border px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                      />
                    </div>

                    {/* New Password */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        رمز عبور جدید
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        required
                        minLength={6}
                        className="w-full rounded-lg border-gray-300 border px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                      />
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        تکرار رمز عبور جدید
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        required
                        className="w-full rounded-lg border-gray-300 border px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                      />
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                      <button
                        type="submit"
                        className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-lg font-medium transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        تغییر رمز عبور
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Notifications Tab (Placeholder) */}
              {activeTab === "notifications" && (
                <div className="text-center py-12">
                  <Bell className="mx-auto text-gray-300 mb-4" size={48} />
                  <h3 className="text-lg font-medium text-gray-900">
                    تنظیمات اعلان‌ها
                  </h3>
                  <p className="text-gray-500 text-sm mt-2">
                    در حال حاضر گزینه‌ای برای تغییر وجود ندارد.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSettingForm;
