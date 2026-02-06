"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle,
  Clock,
  Image as ImageIcon,
  Loader2,
  Paperclip,
  Send,
  Trash2,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { getTicket, replyToTicket, updateTicketStatus } from "../_meta/actions";
import { getFullDateTime } from "@/utils/common";

type TicketStatus = "OPEN" | "PENDING" | "CLOSED";
type TicketPriority = "LOW" | "MEDIUM" | "HIGH";

export const PriorityBadge = ({ priority }: { priority: TicketPriority }) => {
  const config = {
    HIGH: {
      label: "بالا",
      color:
        "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300",
      icon: AlertTriangle,
    },
    MEDIUM: {
      label: "متوسط",
      color:
        "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300",
      icon: ArrowUpRight,
    },
    LOW: {
      label: "کم",
      color:
        "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300",
      icon: CheckCircle,
    },
  };

  const { label, color, icon: Icon } = config[priority];
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

export const StatusBadge = ({ status }: { status: TicketStatus }) => {
  const config = {
    OPEN: {
      label: "باز",
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    },
    PENDING: {
      label: "در انتظار",
      color:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    },
    CLOSED: {
      label: "بسته شده",
      color: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
    },
  };

  const { label, color } = config[status];
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border border-transparent",
        color,
      )}
    >
      {label}
    </span>
  );
};

// --- Main Modal Component ---

interface Props {
  id: string;
  onClose: () => void;
}

const TicketDetailModal = ({ id, onClose }: Props) => {
  const [replyText, setReplyText] = useState("");
  const queryClient = useQueryClient();

  const { data: ticket, isLoading } = useQuery({
    queryFn: async () => {
      const result = await getTicket(id);
      if (!result?.success) {
        toast.error(result?.message);
        throw new Error(result?.message);
      }
      return result?.data;
    },
    queryKey: ["ticket-detail", id],
    enabled: !!id,
  });

  const replyMutation = useMutation({
    mutationFn: async () => {
      const mockAdminId = "admin_id"; // آیدی ادمین جاری
      return await replyToTicket(id, replyText, mockAdminId);
    },
    onSuccess: (res) => {
      toast.success(res.message);
      setReplyText("");
      queryClient.invalidateQueries({ queryKey: ["ticket-detail", id] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
    onError: () => toast.error("خطا در ارسال پاسخ"),
  });

  const closeTicketMutation = useMutation({
    mutationFn: () => updateTicketStatus(id, "CLOSED"),
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ["ticket-detail", id] });
      onClose();
    },
  });

  const formatDate = (date: Date) => {
    return getFullDateTime(date);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-20">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <div className="w-full flex flex-col h-full max-h-[85vh]">
      {/* Modal Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg overflow-hidden">
              {ticket.user.avatar ? (
                <Image
                  width={100}
                  height={100}
                  src={ticket.user.avatar || "/images/placeholder.png"}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                ticket.user.fullName
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {ticket.user.fullName}
                </h3>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-500" dir="ltr">
                  {ticket.user.phone}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <PriorityBadge priority={ticket.priority} />
                <StatusBadge status={ticket.status} />
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {ticket.id.slice(0, 8)}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <XCircle className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        <div className="mt-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            {ticket.subject}
          </h2>
          <p className="text-sm text-gray-500 mt-1">{ticket.description}</p>
        </div>
      </div>

      {/* Modal Body (Chat) */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white dark:bg-gray-800">
        {ticket.messages.length > 0 ? (
          ticket.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 items-start ${
                msg.isAdmin ? "justify-end" : "justify-start"
              }`}
            >
              {!msg.isAdmin && (
                <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs shrink-0">
                  {msg.senderId ? (
                    <Image
                      width={100}
                      height={100}
                      src={"/images/placeholder.png"}
                      alt=""
                    />
                  ) : (
                    msg.senderId
                  )}
                </div>
              )}
              <div
                className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.isAdmin
                    ? "bg-indigo-600 text-white rounded-tr-sm"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-sm"
                }`}
              >
                <div className="flex justify-between items-baseline gap-4 mb-1">
                  <span className="text-xs font-medium opacity-80">
                    {msg.senderId}
                  </span>
                  <span className="text-[10px] opacity-70">
                    {formatDate(msg.createdAt)}
                  </span>
                </div>
                <p className="whitespace-pre-line">{msg.content}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 py-10">
            هیچ گفتگویی ثبت نشده است.
          </div>
        )}
      </div>

      {/* Footer */}
      {ticket.status !== "CLOSED" && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shrink-0">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none"
                rows={2}
                placeholder="متن پاسخ را بنویسید..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                disabled={replyMutation.isPending}
              />
              <div className="flex items-center justify-between px-1 mt-2">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-gray-600"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-gray-600"
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => replyMutation.mutate()}
                disabled={!replyText.trim() || replyMutation.isPending}
                className="h-12 w-12 rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-lg"
              >
                {replyMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
              {
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                  onClick={() => closeTicketMutation.mutate()}
                  disabled={closeTicketMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketDetailModal;
