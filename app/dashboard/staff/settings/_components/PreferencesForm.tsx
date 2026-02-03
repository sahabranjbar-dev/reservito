import { DisabledSection } from "@/components";
import { Globe, Moon, Sun } from "lucide-react";
import React from "react";

const PreferencesForm = () => {
  return (
    <div className="space-y-6 relative">
      <DisabledSection />
      {/* تنظیمات ظاهری */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          تنظیمات ظاهری
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              تم
            </label>
            <div className="flex space-x-3 space-x-reverse">
              <button
                className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-700"}`}
              >
                <Sun className="h-6 w-6 mb-2" />
                <span>روشن</span>
              </button>
              <button
                className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center "dark" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-700"}`}
              >
                <Moon className="h-6 w-6 mb-2" />
                <span>تیره</span>
              </button>
              <button
                className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center "system" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-700"}`}
              >
                <Globe className="h-6 w-6 mb-2" />
                <span>سیستم</span>
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              زبان
            </label>
            <select className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="fa">فارسی</option>
              <option value="en">English</option>
              <option value="ar">العربیة</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              منطقه زمانی
            </label>
            <select className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="Asia/Tehran">تهران (GMT+3:30)</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">نیویورک (GMT-5)</option>
              <option value="Europe/London">لندن (GMT+0)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              فرمت زمان
            </label>
            <div className="flex space-x-3 space-x-reverse">
              <button
                className={`flex-1 p-3 rounded-xl border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20"  dark:border-gray-700"}`}
              >
                ۲۴ ساعته
              </button>
              <button
                className={`flex-1 p-3 rounded-xl border-2  bg-blue-50 dark:bg-blue-900/20" border-gray-200 dark:border-gray-700"}`}
              >
                ۱۲ ساعته
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* تنظیمات نوبت‌گیری */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          تنظیمات نوبت‌گیری
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                تأیید خودکار نوبت‌ها
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                نوبت‌های جدید به طور خودکار تأیید می‌شوند
              </p>
            </div>
            <button>
              <span />
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              حداکثر نوبت روزانه
            </label>
            <input
              type="number"
              min="1"
              max="50"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              پس از رسیدن به این تعداد، تقویم شما برای روز جاری بسته می‌شود
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesForm;
