import { DisabledSection } from "@/components";
import { Globe, Smartphone } from "lucide-react";
import React from "react";

const SecurityForm = () => {
  return (
    <div className="space-y-6 relative">
      <DisabledSection />
      {/* تغییر رمز عبور */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          تغییر رمز عبور
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              رمز عبور فعلی
            </label>
            <div className="relative">
              <input className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              رمز عبور جدید
            </label>
            <div className="relative">
              <input className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              تأیید رمز عبور جدید
            </label>
            <div className="relative">
              <input className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>
        </div>
        <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
          <p className="text-sm text-blue-600 dark:text-blue-400">
            رمز عبور باید حداقل ۸ کاراکتر شامل حروف بزرگ، کوچک و اعداد باشد
          </p>
        </div>
      </div>

      {/* احراز هویت دو مرحله‌ای */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              احراز هویت دو مرحله‌ای
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              امنیت حساب کاربری خود را افزایش دهید
            </p>
          </div>
          <button
            className={`relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 dark:bg-gray-600"}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1"}`}
            />
          </button>
        </div>
        {
          <div className="mt-4 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
            <p className="text-sm text-green-600 dark:text-green-400">
              احراز هویت دو مرحله‌ای فعال است. برای ورود به کد ارسال شده به تلفن
              همراه نیاز دارید.
            </p>
          </div>
        }
      </div>

      {/* هشدارهای امنیتی */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              هشدارهای ورود
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              دریافت ایمیل هنگام ورود از دستگاه جدید
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
      </div>

      {/* جلسات فعال */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          جلسات فعال
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
            <div className="flex items-center">
              <Smartphone className="h-5 w-5 text-gray-500 dark:text-gray-400 ml-2" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  iPhone 13 Pro
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  تهران، ایران • امروز ۱۴:۳۰
                </p>
              </div>
            </div>
            <button className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">
              خاتمه جلسه
            </button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
            <div className="flex items-center">
              <Globe className="h-5 w-5 text-gray-500 dark:text-gray-400 ml-2" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Windows Chrome
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  اصفهان، ایران • دیروز ۰۹:۱۵
                </p>
              </div>
            </div>
            <button className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">
              خاتمه جلسه
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityForm;
