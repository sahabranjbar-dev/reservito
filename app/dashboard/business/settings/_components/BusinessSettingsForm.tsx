"use client";

import { useState, useTransition } from "react";
import {
  Building2,
  User,
  Globe,
  MapPin,
  Hash,
  Camera,
  Lock,
  Bell,
  CreditCard,
  ShieldAlert,
  Palette,
  Save,
  Key,
  Settings,
  CircleCheck,
  CalendarClock,
  CircleAlert,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch"; // برای اعلانات
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import { BusinessRegistrationStatus, BusinessType } from "@/constants/enums";
import { updateBusinessSettings } from "../_meta/actions";
import { BaseField, Form, SwitchComponent, TextCore } from "@/components";
import clsx from "clsx";
import GeneralForm from "./GeneralForm";

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
  const onPasswordSubmit = () => {
    // اینجا لاگیک تغییر رمز عبور را اضافه کنید
    console.log("Password change requested");
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

      <Tabs defaultValue="general" className="w-full" dir="rtl">
        <div className="flex flex-col md:flex-row gap-8">
          {/* --- SIDEBAR (RIGHT SIDE IN RTL) --- */}
          <TabsList
            dir="rtl"
            className="h-full w-full md:w-64 flex flex-col justify-start items-start p-1 bg-transparent border-l gap-1 rounded-none border-r-0"
          >
            <TabsTrigger
              value="general"
              className="w-full justify-start px-4 py-3 gap-3 text-right data-[state=active]:bg-muted data-[state=active]:shadow-sm rounded-lg transition-all"
            >
              <Settings className="w-4 h-4" />
              تنظیمات عمومی
            </TabsTrigger>
            <TabsTrigger
              value="visual"
              className="w-full justify-start px-4 py-3 gap-3 text-right data-[state=active]:bg-muted data-[state=active]:shadow-sm rounded-lg transition-all"
            >
              <Palette className="w-4 h-4" />
              هویت بصری
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="w-full justify-start px-4 py-3 gap-3 text-right data-[state=active]:bg-muted data-[state=active]:shadow-sm rounded-lg transition-all"
            >
              <Lock className="w-4 h-4" />
              امنیت و رمز عبور
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="w-full justify-start px-4 py-3 gap-3 text-right data-[state=active]:bg-muted data-[state=active]:shadow-sm rounded-lg transition-all"
            >
              <Bell className="w-4 h-4" />
              اعلانات
            </TabsTrigger>
            <TabsTrigger
              value="billing"
              className="w-full justify-start px-4 py-3 gap-3 text-right data-[state=active]:bg-muted data-[state=active]:shadow-sm rounded-lg transition-all"
            >
              <CreditCard className="w-4 h-4" />
              صورتحساب و پلن
            </TabsTrigger>
            <div className="flex-1"></div>{" "}
            {/* Spacer to push Danger Zone down */}
            <TabsTrigger
              value="danger"
              className="w-full justify-start px-4 py-3 gap-3 text-right text-red-600 hover:text-red-700 hover:bg-red-50 data-[state=active]:bg-red-50 data-[state=active]:text-red-700 rounded-lg transition-all mt-4"
            >
              <ShieldAlert className="w-4 h-4" />
              منطقه خطر
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
            <TabsContent value="visual" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>لوگو و بنر</CardTitle>
                  <CardDescription>
                    تصاویری که برند شما را معرفی می‌کنند.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 relative overflow-hidden p-4 border rounded-2xl cursor-not-allowed">
                  {/* Logo Upload */}
                  <div className="absolute backdrop-blur-[2px] w-full h-full top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center">
                    <div className="border p-2 rounded-2xl bg-yellow-100 flex justify-center items-center gap-2 text-gray-600">
                      این قابلیت به‌زودی فعال می‌شود.
                      <CircleAlert />
                    </div>
                  </div>

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
                  <Form onSubmit={onPasswordSubmit}>
                    <div className="max-w-xl mx-auto p-4 space-y-3">
                      <BaseField
                        name="currentPassword"
                        component={TextCore}
                        label="رمز عبور فعلی"
                        required
                      />
                      <BaseField
                        name="newPassword"
                        component={TextCore}
                        label="رمز عبور جدید"
                        required
                      />
                      <BaseField
                        name="repeatNewPassword"
                        component={TextCore}
                        label="تکرار رمز عبور جدید"
                        required
                      />

                      <div className="pt-4">
                        <Button type="submit" className="w-full">
                          بروزرسانی رمز عبور
                        </Button>
                      </div>
                    </div>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 4. NOTIFICATIONS TAB */}
            <TabsContent value="notifications" className="space-y-6">
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
            <TabsContent value="billing" className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border p-4 bg-card">
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

              <Card>
                <CardHeader>
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
            <TabsContent value="danger" className="space-y-6">
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
        </div>
      </Tabs>
    </div>
  );
}
