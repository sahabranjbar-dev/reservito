"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Clock, Palette, Shield, Smartphone, User } from "lucide-react";
import NotificationForm from "./NotificationForm";
import ProfileForm from "./ProfileForm";
import AvailabilityForm from "./AvailabilityForm";
import SecurityForm from "./SecurityForm";
import PreferencesForm from "./PreferencesForm";
import IntegrationForm from "./IntegrationForm";
import { getFullDateTime, timeAgo } from "@/utils/common";
import { useRouter, useSearchParams } from "next/navigation";

const tabs = [
  { id: "profile", label: "پروفایل", icon: User },
  { id: "notifications", label: "اعلان‌ها", icon: Bell },
  { id: "availability", label: "زمان‌بندی", icon: Clock },
  { id: "security", label: "امنیت", icon: Shield },
  { id: "preferences", label: "ترجیحات", icon: Palette },
  { id: "integrations", label: "اتصالات", icon: Smartphone },
];

interface Props {
  staffData: any;
}

const StaffSettingForm = ({ staffData }: Props) => {
  const tabsContents = [
    {
      id: "profile",
      title: "اطلاعات پایه",
      description: "نام و مشخصات خود را ویرایش کنید.",
      form: <ProfileForm staffData={staffData} />,
    },
    {
      id: "notifications",
      title: "تنظیمات اعلان‌ها",
      description: "تنظیم نحوه دریافت اطلاعیه‌ها و اعلان‌ها",
      form: <NotificationForm />,
    },
    {
      id: "availability",
      title: "زمان‌بندی",
      description: "تنظیم روزها و ساعات کاری شما",
      form: <AvailabilityForm />,
    },
    {
      id: "security",
      title: "تغییر رمز عبور",
      description: "مدیریت امنیت حساب کاربری و رمز عبور",
      form: <SecurityForm />,
    },
    {
      id: "preferences",
      title: "تنظیمات ظاهری",
      description: "تنظیمات ظاهری و ترجیحات شخصی",
      form: <PreferencesForm />,
    },
    {
      id: "integrations",
      title: "اتصالات برنامه‌ها",
      description: "اتصال با سایر سرویس‌ها و برنامه‌ها",
      form: <IntegrationForm />,
    },
  ];

  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const defaultTab = searchParams.get("tab") || "profile";

  const onValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams);

    params.delete("tab");
    params.append("tab", value);

    replace(`/dashboard/staff/settings?${params}`);
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
        <TabsList>
          {tabs.map((tab) => {
            return (
              <TabsTrigger key={tab.id} value={tab.id}>
                <tab.icon />
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <div className="flex-1 min-w-0">
          {tabsContents.map(({ description, form, id, title }) => {
            return (
              <TabsContent key={id} value={id}>
                <Card>
                  <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">{form}</CardContent>
                </Card>
              </TabsContent>
            );
          })}
        </div>
      </Tabs>

      <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          اطلاعات پایه
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              آخرین ورود
            </p>
            <p className="font-medium text-gray-900 dark:text-white">
              {getFullDateTime(staffData?.lastLoginAt)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ورژن برنامه
            </p>
            <p className="font-medium text-gray-900 dark:text-white">۱.۰.۰</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              آخرین به‌روزرسانی
            </p>
            <p className="font-medium text-gray-900 dark:text-white">
              {timeAgo(new Date("2026-01-20"))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffSettingForm;
