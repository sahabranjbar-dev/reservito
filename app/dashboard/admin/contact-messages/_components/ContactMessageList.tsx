"use client";

import { Modal } from "@/components"; // مسیر کامپوننت مودال شما
import { Button } from "@/components/ui/button";
import { Eye, FileText, Mail, Phone } from "lucide-react";
import MessageDetailModal, { StatusBadge } from "./MessageDetailModal";
import { useState } from "react";

interface Props {
  data: any[];
}

const ContactMessageList = ({ data }: Props) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({ id: null, isOpen: false });

  return (
    <div className="space-y-6 p-4 md:p-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Mail className="h-6 w-6 text-indigo-600" />
            پیام‌های تماس با ما
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            مدیریت و پاسخ‌دهی به پیام‌های ارسال شده توسط کاربران
          </p>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 w-24 text-center">وضعیت</th>
                <th className="px-6 py-4">نام و نام خانوادگی</th>
                <th className="px-6 py-4">اطلاعات تماس</th>
                <th className="px-6 py-4 hidden md:table-cell">تاریخ ارسال</th>
                <th className="px-6 py-4 w-20 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {data.length > 0 ? (
                data.map((msg) => (
                  <tr
                    key={msg.id}
                    className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-colors cursor-pointer border-b border-gray-50 dark:border-gray-700/50 last:border-0"
                  >
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={msg.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {msg.fullName}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5 line-clamp-1 md:hidden">
                        {msg.message.substring(0, 40)}...
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3 w-3" />
                          <span dir="ltr">{msg.phone}</span>
                        </div>
                        {msg.email && (
                          <div className="flex items-center gap-1.5">
                            <Mail className="h-3 w-3" />
                            <span className="truncate max-w-37.5">
                              {msg.email}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400 hidden md:table-cell text-xs">
                      {new Intl.DateTimeFormat("fa-IR", {
                        month: "numeric",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(new Date(msg.createdAt))}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={() => {
                          setModalState({ id: msg?.id, isOpen: true });
                        }}
                      >
                        <Eye className="h-4 w-4 text-indigo-600" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <FileText className="h-12 w-12 mb-3 opacity-20" />
                      <p>هیچ پیامی یافت نشد.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {/* اطمینان حاصل کنید که کامپوننت Modal شما props title و children را قبول میکند */}
      <Modal
        open={modalState.isOpen}
        onOpenChange={(open) => {
          setModalState((prev) => {
            if (!open) return { isOpen: false, id: null };
            return { ...prev, isOpen: open };
          });
        }}
        title="جزئیات پیام"
      >
        {modalState.id && (
          <MessageDetailModal
            id={modalState.id}
            onClose={() => setModalState({ isOpen: false, id: null })}
          />
        )}
      </Modal>
    </div>
  );
};

export default ContactMessageList;
