"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Send, XCircle, User, ShieldCheck, Lock } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { getTicket, replyTicket } from "../_meta/actions";
import { toast } from "sonner";
import { format } from "date-fns-jalali"; // یا همان تابع Intl که استفاده کردید

// --- Types ---

interface TicketMessage {
  id: string;
  content: string;
  createdAt: Date;
  isAdmin: boolean;
  sender: {
    fullName: string;
    avatar?: string | null;
  };
}

interface Ticket {
  id: string;
  subject: string;
  description?: string | null;
  status: "OPEN" | "PENDING" | "CLOSED";
  createdAt: Date;
  user: { fullName: string; phone: string };
  messages: TicketMessage[];
}

interface Props {
  id: string;
  userId: string;
  onClose: () => void;
}

const TicketDetailModal = ({ id, userId, onClose }: Props) => {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // دریافت تیکت و پیام‌ها
  const {
    data: ticket,
    isLoading,
    isError,
  } = useQuery({
    queryFn: async () => {
      const res = await getTicket(id, userId);
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    queryKey: ["ticket-detail", id],
    enabled: !!id,
    staleTime: 0, // همیشه اطلاعات جدید بگیر
  });

  // اسکرول خودکار به پایین وقتی مودال باز میشه یا پیام جدید میاد
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [ticket, isLoading]);

  // متیشن ارسال پاسخ
  const replyMutation = useMutation({
    mutationFn: () => replyTicket(id, message, userId),
    onSuccess: (res) => {
      toast.success(res.message);
      setMessage("");
      // این‌والی‌دیت لیست تیکت‌ها و جزئیات تیکت فعلی
      queryClient.invalidateQueries({ queryKey: ["ticket-detail", id] });
      queryClient.invalidateQueries({ queryKey: ["customer-tickets", userId] });
    },
    onError: () => toast.error("خطا در ارسال پیام"),
  });

  const handleSend = () => {
    if (!message.trim()) return;
    replyMutation.mutate();
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "long",
    }).format(new Date(date));
  };

  if (isError || !id) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-red-500">
        خطا در بارگذاری اطلاعات
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[80vh] w-full bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Modal Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">
            {isLoading ? "در حال بارگذاری..." : ticket?.subject}
          </h3>
          {ticket && (
            <div className="flex items-center gap-2 mt-1">
              <span
                className={cn(
                  "w-2 h-2 rounded-full",
                  ticket.status === "OPEN"
                    ? "bg-green-500"
                    : ticket.status === "PENDING"
                      ? "bg-amber-500"
                      : "bg-gray-400",
                )}
              />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {ticket.status === "OPEN"
                  ? "باز"
                  : ticket.status === "PENDING"
                    ? "در حال بررسی"
                    : "بسته شده"}
              </span>
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <XCircle className="h-6 w-6 text-gray-400" />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-white dark:bg-gray-900">
        {isLoading ? (
          <div className="flex justify-center pt-20">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          </div>
        ) : (
          <>
            {/* نمایش توضیحات اولیه تیکت (فقط یک بار در بالا) */}
            {ticket && ticket.description && (
              <div className="flex justify-center mb-8">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-100 p-4 rounded-xl rounded-tl-none max-w-[80%] text-sm leading-relaxed shadow-sm border border-indigo-100 dark:border-indigo-800/30">
                  <div className="flex items-center gap-2 mb-2 text-indigo-400 text-xs font-bold">
                    <User className="h-3 w-3" />
                    <span>درخواست اولیه شما</span>
                  </div>
                  {ticket.description}
                  <div className="text-[10px] text-indigo-400/70 mt-2 text-left">
                    {formatDate(ticket.createdAt)}
                  </div>
                </div>
              </div>
            )}

            {/* لیست پیام‌ها */}
            {ticket?.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 items-end ${
                  msg.isAdmin ? "justify-start" : "justify-end"
                }`}
              >
                {msg.isAdmin && (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center shrink-0 border border-indigo-200 dark:border-indigo-700">
                    <ShieldCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[75%] px-4 py-3 rounded-2xl text-sm shadow-sm leading-7",
                    msg.isAdmin
                      ? "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tr-none"
                      : "bg-indigo-600 text-white rounded-tl-none",
                  )}
                >
                  <div className="flex justify-between items-end gap-3 mb-1">
                    <span className="text-xs font-bold opacity-80">
                      {msg.isAdmin ? "پشتیبان" : msg.senderId}
                    </span>
                    <span
                      className={cn(
                        "text-[10px] opacity-70",
                        msg.isAdmin ? "text-gray-500" : "text-indigo-200",
                      )}
                    >
                      {formatDate(msg.createdAt)}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap break-words">
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Footer / Input Area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">
        {ticket?.status === "CLOSED" ? (
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm py-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <Lock className="h-4 w-4" />
            این تیکت بسته شده است و امکان ارسال پاسخ وجود ندارد.
          </div>
        ) : (
          <div className="flex items-end gap-2">
            <textarea
              className="flex-1 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white resize-none max-h-32"
              rows={1}
              placeholder="پیام خود را بنویسید..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={replyMutation.isPending}
            />
            <Button
              onClick={handleSend}
              disabled={!message.trim() || replyMutation.isPending}
              className="h-10 w-10 shrink-0 rounded-full bg-indigo-600 hover:bg-indigo-700"
              size="icon"
            >
              {replyMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetailModal;
