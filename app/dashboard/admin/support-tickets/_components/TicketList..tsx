"use client";

import { Modal } from "@/components";
import { Button } from "@/components/ui/button";
import { Eye, FileText } from "lucide-react";
import { useState } from "react";
import TicketDetailModal, {
  PriorityBadge,
  StatusBadge,
} from "./TicketDetailModal";

interface Props {
  data: any[];
}

const TicketList = ({ data }: Props) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({ id: null, isOpen: false });

  return (
    <div className="space-y-6 p-4 md:p-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="h-6 w-6 text-indigo-600" />
            تیکت‌های پشتیبانی
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            مدیریت و پاسخ‌دهی به درخواست‌های کاربران
          </p>
        </div>
      </div>

      {/* Stats Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { label: "همه", count: data.length, key: "all" },
          {
            label: "باز",
            count: data.filter((m) => m.status === "OPEN").length,
            key: "OPEN",
          },
          {
            label: "در انتظار",
            count: data.filter((m) => m.status === "PENDING").length,
            key: "PENDING",
          },
          {
            label: "بالا",
            count: data.filter((m) => m.priority === "HIGH").length,
            key: "HIGH",
          },
        ].map((item) => (
          <button
            key={item.key}
            className="px-4 py-2 rounded-lg text-xs md:text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 whitespace-nowrap"
          >
            {item.label} ({item.count})
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4">موضوع تیکت</th>
                <th className="px-6 py-4">کاربر</th>
                <th className="px-6 py-4 w-24 text-center">اولویت</th>
                <th className="px-6 py-4 w-28 text-center">وضعیت</th>
                <th className="px-6 py-4 hidden md:table-cell">تاریخ</th>
                <th className="px-6 py-4 w-20 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {data.length > 0 ? (
                data.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-colors cursor-pointer border-b border-gray-50 dark:border-gray-700/50 last:border-0"
                    onClick={() =>
                      setModalState({ id: ticket.id, isOpen: true })
                    }
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {ticket.subject}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-600 dark:text-gray-400">
                        {ticket.user?.fullName || "نامشخص"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <PriorityBadge priority={ticket.priority} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400 hidden md:table-cell text-xs">
                      {new Intl.DateTimeFormat("fa-IR", {
                        month: "numeric",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(new Date(ticket.createdAt))}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalState({ id: ticket.id, isOpen: true });
                        }}
                      >
                        <Eye className="h-4 w-4 text-indigo-600" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <FileText className="h-12 w-12 mb-3 opacity-20" />
                      <p>هیچ تیکتی یافت نشد.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal
        open={modalState.isOpen}
        onOpenChange={(open) => {
          setModalState((prev) => {
            if (!open) return { isOpen: false, id: null };
            return { ...prev, isOpen: open };
          });
        }}
        title="جزئیات تیکت"
        className="max-w-4xl" // برای چت کردن عرض بزرگتر
      >
        {modalState.id && (
          <TicketDetailModal
            id={modalState.id}
            onClose={() => setModalState({ isOpen: false, id: null })}
          />
        )}
      </Modal>
    </div>
  );
};

export default TicketList;
