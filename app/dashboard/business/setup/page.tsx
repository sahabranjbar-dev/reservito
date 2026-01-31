"use client";

import { getBusinessTypeOptions } from "@/app/business/_meta/utils";
import { BaseField, Form, TextCore } from "@/components"; // مسیر کامپوننت‌های شما
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Calendar, Phone, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { setupBusinessAction } from "../actions";

const SetupWizard = () => {
  const session = useSession();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const AllbusinessData = getBusinessTypeOptions();

  const userBusiness = AllbusinessData.find(
    (item) => item.id === session.data?.user.business?.businessType,
  );

  const BusinessIcon = userBusiness?.icon;

  const onSubmit = async (data: any) => {
    // اگر در مرحله آخر هستیم
    if (step === 2) {
      // چون در ما به درستی سرور اکشن را هنوز نساختیم، اینجا فرض می‌کنیم کار می‌کند
      // در مرحله بعد اکشن را می‌سازیم

      const result = await setupBusinessAction(data);

      if (result?.success) {
        toast.success("عملیات با موفقیت انجام شد");
        router.push("/dashboard/business");
        router.refresh();
      } else {
        toast.error(result?.error);
      }
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8 lg:p-12">
        {/* Stepper Header */}
        <div className="mb-10">
          <div className="flex justify-between mb-4 text-sm font-bold text-slate-400">
            <span className={step >= 0 ? "text-indigo-600" : ""}>
              ۱. اولین سرویس
            </span>
            <span className={step >= 1 ? "text-indigo-600" : ""}>۲. پرسنل</span>
            <span className={step >= 2 ? "text-indigo-600" : ""}>
              ۳. زمان‌بندی
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((step + 1) / 3) * 100}%` }}
            />
          </div>
        </div>

        <Form onSubmit={onSubmit}>
          {/* STEP 1: Service */}
          {step === 0 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {BusinessIcon && <BusinessIcon className="w-8 h-8" />}
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  تعریف اولین خدمت
                </h2>
                <p className="text-slate-500">
                  مشتری‌ها با خدمت شما آشنا شوند.
                </p>
              </div>

              <BaseField
                component={TextCore}
                name="serviceName"
                label="نام خدمت"
                icon={BusinessIcon && <BusinessIcon className="w-5 h-5" />}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BaseField
                  component={TextCore}
                  name="price"
                  label="قیمت"
                  number
                  formatter
                  description="قیمت اختیاری است و به تومان وارد کنید"
                />
                <BaseField
                  component={TextCore}
                  name="duration"
                  label="مدت زمان"
                  number
                  formatter
                  required
                  description="مدت زمان بر حسب دقیقه وارد کنید"
                />
              </div>

              <Button className="w-full">
                مرحله بعد <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>
            </div>
          )}

          {/* STEP 2: Staff */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  مدیریت پرسنل
                </h2>
                <p className="text-slate-500">چه کسی خدمات را انجام می‌دهد؟</p>
              </div>

              <BaseField
                component={TextCore}
                name="staffName"
                label="نام پرسنل"
                icon={<User className="w-5 h-5" />}
                required
              />

              <BaseField
                component={TextCore}
                name="staffPhone"
                label="شماره تماس پرسنل"
                icon={<Phone className="w-5 h-5" />}
                required
              />

              <p className="text-xs text-slate-400 mt-2">
                این نام در پروفایل عمومی فروشگاه نمایش داده می‌شود.
              </p>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setStep(0)}
                  className="w-1/2"
                >
                  <ArrowRight className="w-4 h-4 ml-2" /> بازگشت
                </Button>
                <Button className="w-1/2">مرحله بعد</Button>
              </div>
            </div>
          )}

          {/* STEP 3: Schedule */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  زمان‌بندی هفتگی
                </h2>
                <p className="text-slate-500">در چه روزهایی باز هستید؟</p>
                <span>
                  این مرحله در قسمت زمان‌بندی داشبورد قابل تغییر می‌باشد
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  "شنبه",
                  "یکشنبه",
                  "دوشنبه",
                  "سه‌شنبه",
                  "چهارشنبه",
                  "پنج‌شنبه",
                  "جمعه",
                ].map((day, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      defaultChecked={i !== 6}
                      className="w-5 h-5 text-indigo-600 rounded"
                    />
                    <span className="font-medium text-slate-700">{day}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 mt-6">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setStep(1)}
                  className="w-1/2"
                >
                  <ArrowRight className="w-4 h-4 ml-2" /> بازگشت
                </Button>
                <Button
                  type="submit"
                  className="w-1/2 bg-green-600 hover:bg-green-700"
                >
                  تکمیل و شروع کار <ArrowLeft className="w-4 h-4 mr-2" />
                </Button>
              </div>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
};

export default SetupWizard;
