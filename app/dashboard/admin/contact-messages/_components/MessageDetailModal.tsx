"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle,
  Clock,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  Reply,
  Send,
  Trash2,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";
import {
  getMessage,
  replyToMessage,
  updateMessageStatus,
} from "../_meta/actions";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { getFullDateTime } from "@/utils/common";

// --- Types ---
// استفاده از تایپ‌های پرایسما برای همخوانی بیشتر یا تعریف دستی:
type ContactStatus = "NEW" | "REPLIED" | "CLOSED";

interface ContactReply {
  id: string;
  reply: string;
  createdAt: Date;
  user?: {
    fullName: string;
  };
}

interface ContactMessage {
  id: string;
  fullName: string;
  email: string | null;
  phone: string;
  message: string;
  status: ContactStatus;
  createdAt: Date;
  updatedAt: Date;
  // نام این پراپرتی در اینترفیس باید با دیتای برگشتی پرایسما هماهنگ باشد.
  // چون در include پرایسما نوشتیم: ContactMessageReply
  ContactMessageReply: ContactReply[];
}

export const StatusBadge = ({ status }: { status: ContactStatus }) => {
  const config = {
    NEW: {
      label: "جدید",
      color:
        "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
      icon: MessageSquare,
    },
    REPLIED: {
      label: "پاسخ داده شده",
      color:
        "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
      icon: Reply,
    },
    CLOSED: {
      label: "بسته شده",
      color:
        "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600",
      icon: CheckCircle,
    },
  };

  const { label, color, icon: Icon } = config[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        color,
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
};

interface Props {
  id: string;
  onClose: () => void;
}

const MessageDetailModal = ({ id, onClose }: Props) => {
  const [replyText, setReplyText] = useState("");
  const queryClient = useQueryClient();
  const session = useSession();

  const userId = session.data?.user.id;
  // دریافت پیام
  const {
    data: message,
    isLoading,
    isFetching,
  } = useQuery({
    queryFn: async () => {
      const result = await getMessage(id);
      if (!result?.success) {
        toast.error(result?.message);
        throw new Error(result?.message);
      }
      return result?.data as ContactMessage;
    },
    queryKey: ["contact-message", id],
    enabled: !!id,
  });

  // متیشن ارسال پاسخ
  const replyMutation = useMutation({
    mutationFn: async () => {
      if (!userId) return;
      return await replyToMessage(id, replyText, userId);
    },
    onSuccess: (res) => {
      toast.success(res?.message);
      setReplyText("");
      queryClient.invalidateQueries({ queryKey: ["contact-message", id] });
      queryClient.invalidateQueries({ queryKey: ["contact-messages"] }); // آپدیت لیست اصلی
    },
    onError: () => toast.error("خطا در ارسال پاسخ"),
  });

  // متیشن بستن تیکت
  const closeTicketMutation = useMutation({
    mutationFn: () => updateMessageStatus(id, "CLOSED"),
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ["contact-message", id] });
      onClose(); // بستن مودال
    },
    onError: () => toast.error("خطا در بستن تیکت"),
  });

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    replyMutation.mutate();
  };

  const formatDate = (date: Date) => {
    return getFullDateTime(date);
  };

  if (isLoading || isFetching || !message?.id) {
    return (
      <div className="flex justify-center items-center p-20">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      {/* Modal Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg">
            {message.fullName.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {message.fullName}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
              <div className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" />
                <span dir="ltr">{message.phone}</span>
              </div>
              {message.email && (
                <div className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{message.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={message.status} />
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <XCircle className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Modal Body (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50 dark:bg-gray-900/20">
        {/* Original Message */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm relative">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              پیام کاربر
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDate(message.createdAt)}
            </span>
          </div>
          <p className="text-gray-800 dark:text-gray-200 leading-7 whitespace-pre-line">
            {message.message}
          </p>
        </div>

        {/* Conversation History */}
        {message.ContactMessageReply.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide border-b border-gray-200 dark:border-gray-700 pb-2">
              سوابق پاسخ‌ها
            </h4>
            {message.ContactMessageReply.map((reply) => (
              <div key={reply.id} className="flex gap-3 items-start">
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold shrink-0 mt-1">
                  {reply.user?.fullName?.charAt(0) || "A"}
                </div>
                <div className="flex-1 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-tr-xl rounded-b-xl rounded-tl-none border border-blue-100 dark:border-blue-800/50">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs font-bold text-blue-900 dark:text-blue-300">
                      {reply.user?.fullName || "ادمین"}
                    </span>
                    <span className="text-[10px] text-blue-400">
                      {formatDate(reply.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed">
                    {reply.reply}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer / Reply Area */}
      {message.status !== "CLOSED" && (
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            پاسخ خود را بنویسید:
          </label>
          <div className="relative">
            <textarea
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white resize-none"
              rows={3}
              placeholder="متن پاسخ..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              disabled={replyMutation.isPending}
            />
            <div className="flex justify-between items-center mt-3">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                  onClick={() => closeTicketMutation.mutate()}
                  disabled={closeTicketMutation.isPending}
                >
                  <Trash2 className="h-4 w-4 ml-1" />
                  بستن تیکت
                </Button>
              </div>
              <Button
                onClick={handleSendReply}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={replyMutation.isPending || !replyText.trim()}
              >
                {replyMutation.isPending ? (
                  <Loader2 className="h-4 w-4 ml-1 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 ml-1" />
                )}
                ارسال پاسخ
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageDetailModal;
