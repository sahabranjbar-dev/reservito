"use client";

import {
  Bell,
  CalendarClock,
  Camera,
  CircleAlert,
  CircleCheck,
  CreditCard,
  Key,
  Lock,
  Palette,
  Settings,
  ShieldAlert,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { BaseField, Form, SwitchComponent } from "@/components";
import { BusinessRegistrationStatus, BusinessType } from "@/constants/enums";
import clsx from "clsx";
import ChangePasswordForm from "./ChangePasswordForm";
import GeneralForm from "./GeneralForm";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  business: {
    id: string;
    businessName: string;
    ownerName: string;
    description: string | null;
    address: string | null;
    businessType: BusinessType;
    isActive: boolean;
    registrationStatus: string;
    identifier: string;
    slug: string;
  };
}

export default function BusinessSettingsPage({ business }: Props) {
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const defaultTab = searchParams.get("tab") || "general";

  const onValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams);

    params.delete("tab");
    params.append("tab", value);

    replace(`/dashboard/business/settings?${params}`);
  };
  return (
    <div className="max-w-6xl mx-auto py-6 md:py-10">
      {/* هدر صفحه */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">تنظیمات کسب‌وکار</h1>
        <p className="text-muted-foreground mt-1">
          مدیریت حساب، امنیت و ظاهر صفحه کسب‌وکار خود.
        </p>
      </div>

      <Tabs
        defaultValue={defaultTab}
        className="w-full"
        dir="rtl"
        onValueChange={onValueChange}
      >
        <>
          <TabsList
            dir="ltr"
            className="max-w-dvw md:max-w-fit w-dvw md:w-fit overflow-scroll pl-64 md:pl-0 h-12"
          >
            <TabsTrigger value="danger">
              <ShieldAlert className="w-4 h-4" />
              منطقه خطر
            </TabsTrigger>

            <TabsTrigger value="billing">
              <CreditCard className="w-4 h-4" />
              صورتحساب و پلن
            </TabsTrigger>

            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4" />
              اعلانات
            </TabsTrigger>

            <TabsTrigger value="security">
              <Lock className="w-4 h-4" />
              امنیت و رمز عبور
            </TabsTrigger>

            <TabsTrigger value="visual">
              <Palette className="w-4 h-4" />
              هویت بصری
            </TabsTrigger>

            <TabsTrigger value="general">
              <Settings className="w-4 h-4" />
              تنظیمات عمومی
            </TabsTrigger>
          </TabsList>

          {/* --- CONTENT AREA --- */}
          <div className="flex-1 min-w-0">
            {/* 1. GENERAL TAB */}
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>اطلاعات پایه</CardTitle>
                  <CardDescription>
                    نام و مشخصات اصلی کسب‌وکار خود را ویرایش کنید.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <GeneralForm
                    defaultValues={{
                      businessName: business.businessName,
                      ownerName: business.ownerName,
                      slug: business.slug,
                      address: business.address,
                      description: business.description,
                      businessType: business.businessType,
                    }}
                  />
                </CardContent>
              </Card>

              {/* وضعیت سیستم در این تب نیز می‌تواند باشد یا جدا */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    وضعیت سیستم
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">شناسه:</span>
                    <span className="border p-2 bg-indigo-50 rounded-2xl">
                      {business.identifier}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      وضعیت ثبت‌نام:
                    </span>
                    <Badge
                      className={clsx("px-3 py-1.5", {
                        "bg-linear-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-300/70 shadow-[0_2px_8px_-2px_rgba(16,185,129,0.2)]":
                          business.registrationStatus ===
                          BusinessRegistrationStatus.APPROVED,
                        "bg-linear-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-300/70 shadow-[0_2px_8px_-2px_rgba(59,130,246,0.2)]":
                          business.registrationStatus ===
                          BusinessRegistrationStatus.APPROVED,
                      })}
                    >
                      {business.registrationStatus ===
                      BusinessRegistrationStatus.APPROVED
                        ? "تایید شده"
                        : "در انتظار تأیید"}
                      {business.registrationStatus ===
                      BusinessRegistrationStatus.APPROVED ? (
                        <CircleCheck />
                      ) : (
                        <CalendarClock />
                      )}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 2. VISUAL IDENTITY TAB */}
            <TabsContent
              value="visual"
              className="space-y-6  relative overflow-hidden p-4 border rounded-2xl cursor-not-allowed"
            >
              <div className="absolute backdrop-blur-[2px] w-full h-full top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center">
                <div className="border p-2 rounded-2xl bg-yellow-100 flex justify-center items-center gap-2 text-gray-600">
                  این قابلیت به‌زودی فعال می‌شود.
                  <CircleAlert />
                </div>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>لوگو و بنر</CardTitle>
                  <CardDescription>
                    تصاویری که برند شما را معرفی می‌کنند.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Logo Upload */}

                  <div className="flex items-start gap-6">
                    <div className="w-24 h-24 rounded-full bg-muted border-2 border-dashed flex items-center justify-center relative overflow-hidden shrink-0">
                      <Camera className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <Label>لوگو کسب‌وکار</Label>
                      <p className="text-sm text-muted-foreground">
                        فرمت‌های مجاز: PNG, JPG. ابعاد پیشنهادی 400x400 پیکسل.
                      </p>
                      <Button variant="outline" size="sm">
                        تغییر لوگو
                      </Button>
                    </div>
                  </div>
                  <Separator />

                  {/* Banner Upload */}
                  <div className="space-y-4">
                    <Label>بنر صفحه (Banner)</Label>
                    <div className="w-full h-48 rounded-lg bg-muted border-2 border-dashed flex items-center justify-center text-muted-foreground cursor-pointer hover:bg-muted/80 transition-colors">
                      <div className="text-center">
                        <Camera className="w-8 h-8 mx-auto mb-2" />
                        <span className="text-sm">
                          برای انتخاب بنر کلیک کنید
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 3. SECURITY TAB */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    تغییر رمز عبور
                  </CardTitle>
                  <CardDescription>
                    برای امنیت بیشتر، از رمز عبور قدرتمند استفاده کنید.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChangePasswordForm />
                </CardContent>
              </Card>
            </TabsContent>

            {/* 4. NOTIFICATIONS TAB */}
            <TabsContent
              value="notifications"
              className="space-y-6 relative overflow-hidden p-4 border rounded-2xl cursor-not-allowed"
            >
              <div className="absolute backdrop-blur-[2px] w-full h-full top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center">
                <div className="border p-2 rounded-2xl bg-yellow-100 flex justify-center items-center gap-2 text-gray-600">
                  این قابلیت به‌زودی فعال می‌شود.
                  <CircleAlert />
                </div>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>تنظیمات اعلانات</CardTitle>
                  <CardDescription>
                    انتخاب کنید چه اطلاعاتی را می‌خواهید دریافت کنید.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Form>
                    <BaseField
                      name="new-booking-alert"
                      component={SwitchComponent}
                      text={
                        <div className="space-y-0.5">
                          <Label>رزرو جدید</Label>
                          <p className="text-sm text-muted-foreground">
                            وقتی مشتری رزرو جدیدی ثبت کرد.
                          </p>
                        </div>
                      }
                    />

                    <BaseField
                      name="cancel-booking-alert"
                      component={SwitchComponent}
                      text={
                        <div className="space-y-0.5">
                          <Label>لغو رزرو</Label>
                          <p className="text-sm text-muted-foreground">
                            وقتی یک رزرو توسط مشتری کنسل شد.
                          </p>
                        </div>
                      }
                    />

                    <BaseField
                      name="marketting"
                      component={SwitchComponent}
                      text={
                        <div className="space-y-0.5">
                          <Label>خبرنامه بازاریابی</Label>
                          <p className="text-sm text-muted-foreground">
                            نکات و پیشنهادات برای رشد کسب‌وکار.
                          </p>
                        </div>
                      }
                    />
                    <div className="pt-4 flex justify-end">
                      <Button type="submit">
                        {false ? "در حال ذخیره..." : "ذخیره تغییرات"}
                      </Button>
                    </div>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 5. BILLING TAB */}
            <TabsContent
              value="billing"
              className="space-y-6 relative overflow-hidden p-4 border rounded-2xl cursor-not-allowed"
            >
              <div className="absolute backdrop-blur-[2px] w-full h-full top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center">
                <div className="border p-2 rounded-2xl bg-yellow-100 flex justify-center items-center gap-2 text-gray-600">
                  این قابلیت به‌زودی فعال می‌شود.
                  <CircleAlert />
                </div>
              </div>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">پلن فعلی: حرفه‌ای (Pro)</h3>
                      <p className="text-sm text-muted-foreground">
                        تمدید: ۱۴۰۳/۱۲/۲۹
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      فعال
                    </Badge>
                  </div>
                  <CardTitle>فاکتورهای اخیر</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center text-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-muted flex items-center justify-center font-mono">
                            PDF
                          </div>
                          <span>فاکتور #{1020 + i}</span>
                        </div>
                        <span className="text-muted-foreground">
                          ۱۴۰۴/۰۹/۱۰
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 6. DANGER ZONE TAB */}
            <TabsContent
              value="danger"
              className="space-y-6 relative overflow-hidden p-4 border rounded-2xl cursor-not-allowed"
            >
              <div className="absolute backdrop-blur-[2px] w-full h-full top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center">
                <div className="border p-2 rounded-2xl bg-yellow-100 flex justify-center items-center gap-2 text-gray-600">
                  این قابلیت به‌زودی فعال می‌شود.
                  <CircleAlert />
                </div>
              </div>
              <Card className="border-red-200 bg-red-50/50 dark:bg-red-900/10">
                <CardHeader>
                  <CardTitle className="text-red-700 dark:text-red-400">
                    حذف حساب کاربری
                  </CardTitle>
                  <CardDescription className="text-red-600/80 dark:text-red-400/80">
                    این عملیات غیرقابل بازگشت است. لطفا با احتیاط پیش بروید.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>تایید نام کسب‌وکار</Label>
                    <Input
                      placeholder="نام کسب‌وکار را برای حذف تایپ کنید"
                      className="bg-background"
                    />
                  </div>
                  <Button variant="destructive" className="w-full">
                    حذف دائمی حساب کاربری
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </>
      </Tabs>
    </div>
  );
}
