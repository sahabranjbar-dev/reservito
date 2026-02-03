import { DisabledSection } from "@/components";
import { Bell, Calendar, Smartphone } from "lucide-react";
import React from "react";

const IntegrationForm = () => {
  return (
    <div className="space-y-6 relative">
      <DisabledSection />

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          اتصالات برنامه‌ها
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/20">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="mr-4">
                <p className="font-medium text-gray-900 dark:text-white">
                  تقویم گوگل
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  همگام‌سازی با Google Calendar
                </p>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-150">
              متصل
            </button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/20">
                <Smartphone className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="mr-4">
                <p className="font-medium text-gray-900 dark:text-white">
                  واتساپ
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ارسال یادآوری از طریق واتساپ
                </p>
              </div>
            </div>
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
              اتصال
            </button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/20">
                <Bell className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="mr-4">
                <p className="font-medium text-gray-900 dark:text-white">
                  تلگرام
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  اطلاع‌رسانی از طریق تلگرام
                </p>
              </div>
            </div>
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
              اتصال
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationForm;
