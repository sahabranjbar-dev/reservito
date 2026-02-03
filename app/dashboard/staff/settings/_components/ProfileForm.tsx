"use client";
import OtpCodeInput from "@/app/dashboard/customer/settings/_components/OtpCodeInput";
import { updateCustomerProfile } from "@/app/dashboard/customer/settings/_meta/actions";
import { BaseField, DisabledSection, Form, TextCore } from "@/components";
import { Button } from "@/components/ui/button";
import {
  convertToEnglishDigits,
  convertToFarsiDigits,
  getFullDateTime,
  validateEmail,
} from "@/utils/common";
import { useMutation } from "@tanstack/react-query";
import { AtSign, Camera, CircleCheckBig, Mail } from "lucide-react";
import { useSession } from "next-auth/react";
import { Activity } from "react";
import { toast } from "sonner";
import { updateStaffProfileAction } from "../_meta/actions";

interface Props {
  staffData: any;
}

interface IFormValues {
  id: string;
  phone: string;
  email?: string | null;
  username?: string | null;
  fullName?: string | null;
  validPhone?: string;
}

const ProfileForm = ({ staffData }: Props) => {
  const { update: updateSession, data: sessionData } = useSession();

  const updateSessionHandler = async (fullName?: string | null) => {
    await updateSession({
      user: {
        ...sessionData?.user,
        name: fullName,
      },
    });
  };

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
      const result = await updateStaffProfileAction({
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
  const onSubmit = async ({
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
  return (
    <div className="space-y-6">
      {/* آپلود آواتار */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <DisabledSection />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          تصویر پروفایل
        </h3>
        <div className="flex items-center space-x-6 space-x-reverse">
          <div className="relative">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-full bg-muted border-2 border-dashed flex items-center justify-center relative overflow-hidden shrink-0">
                <Camera className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  فرمت‌های مجاز: PNG, JPG. ابعاد پیشنهادی 400x400 پیکسل.
                </p>
                <Button variant="outline" size="sm">
                  تغییر تصویر
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* اطلاعات شخصی */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          اطلاعات شخصی
        </h3>
        <Form
          defaultValues={{
            fullName: staffData?.fullName,
            email: staffData?.email,
            phone: staffData?.phone,
            username: staffData?.username,
            validPhone: staffData?.phone,
          }}
          onSubmit={onSubmit}
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
                      const { valid, message } = validateEmail(value, false);
                      if (!valid) return message;
                      return true;
                    }}
                  />
                </div>

                <div className="space-y-2 grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-2xl p-2 bg-slate-50">
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
                      <span className="tex-xs text-green-600 flex justify-start items-center gap-2">
                        <CircleCheckBig size={16} className="animate-pulse" />
                        شماره موبایل تایید شد
                      </span>
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

      {/* آمار */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          آمار فعالیت
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">
              تاریخ عضویت
            </p>
            <p className="text-gray-900 dark:text-white text-left p-4">
              {getFullDateTime(staffData?.createdAt)}
            </p>
          </div>
          <div className="relative p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
            <p className="text-sm text-green-600 dark:text-green-400 mb-1">
              میانگین امتیاز
            </p>
            <div className="flex items-center">
              <span className="text-lg font-semibold text-gray-900 dark:text-white ml-2">
                {staffData?.rating}
              </span>
              <div className="flex ">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="text-amber-400">
                    ★
                  </span>
                ))}
              </div>
              <DisabledSection />
            </div>
          </div>
          <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800">
            <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">
              نوبت‌های انجام شده
            </p>

            {staffData?.bookings?.length ? (
              <p className="text-lg font-semibold text-gray-900 dark:text-white text-left p-4">
                {convertToFarsiDigits(staffData?.bookings?.length)}
              </p>
            ) : (
              <span className="text-xs text-gray-500 text-left w-full block mt-4">
                هنوز خدمتی انجام نشده است
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
