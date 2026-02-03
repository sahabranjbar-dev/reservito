import { DisabledSection } from "@/components";
import React from "react";

const NotificationForm = () => {
  return (
    <div className="space-y-6 relative">
      <DisabledSection />
      {/* تنظیمات اعلان‌ها */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          تنظیمات اعلان‌ها
        </h3>
        <div className="space-y-4">
          {[
            {
              key: "emailNotifications",
              label: "اعلان‌های ایمیلی",
              description: "دریافت اطلاعیه‌های مهم از طریق ایمیل",
            },
            {
              key: "smsNotifications",
              label: "اعلان‌های پیامکی",
              description: "دریافت هشدار از طریق پیامک",
            },
            {
              key: "pushNotifications",
              label: "اعلان‌های پوش",
              description: "دریافت اعلان‌های لحظه‌ای در دستگاه",
            },
            {
              key: "bookingReminders",
              label: "یادآور نوبت‌ها",
              description: "یادآوری نوبت‌های پیش‌رو",
            },
            {
              key: "newBookingAlerts",
              label: "هشدار نوبت جدید",
              description: "اطلاع فوری از ثبت نوبت جدید",
            },
            {
              key: "promotionNotifications",
              label: "اطلاع‌رسانی پیشنهادات",
              description: "دریافت پیشنهادات ویژه و تخفیف‌ها",
            },
            {
              key: "marketingEmails",
              label: "ایمیل‌های تبلیغاتی",
              description: "دریافت خبرنامه و محتوای آموزشی",
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {item.label}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {item.description}
                </p>
              </div>
              <button
                className={`relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 dark:bg-gray-600"}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" : "translate-x-1"}`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* زمان‌بندی اعلان‌ها */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          زمان‌بندی اعلان‌ها
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ساعت شروع ارسال اعلان
            </label>
            <input
              type="time"
              defaultValue="08:00"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ساعت پایان ارسال اعلان
            </label>
            <input
              type="time"
              defaultValue="22:00"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          اعلان‌ها تنها در بازه زمانی مشخص شده ارسال خواهند شد
        </p>
      </div>
    </div>
  );
};

export default NotificationForm;
