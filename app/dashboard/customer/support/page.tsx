"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // اگر دارید
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Clock, Loader2, MessageSquare, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { DisabledSection, Modal } from "@/components";
import { useSession } from "next-auth/react";
import { notFound } from "next/navigation";
import TicketDetailModal from "./_components/TicketDetailModal";
import { createCustomerTicket, getCustomerTickets } from "./_meta/actions";

const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    OPEN: {
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30",
      label: "باز",
    },
    PENDING: {
      color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30",
      label: "در حال بررسی",
    },
    CLOSED: {
      color: "bg-gray-100 text-gray-700 dark:bg-gray-700",
      label: "بسته شده",
    },
  };
  const { color, label } = config[status as keyof typeof config] || config.OPEN;
  return (
    <span className={cn("px-2 py-1 rounded-md text-xs font-bold", color)}>
      {label}
    </span>
  );
};

const CreateTicketForm = ({ userId }: { userId: string }) => {
  const queryClient = useQueryClient();
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      createCustomerTicket(userId, subject, description, priority),
    onSuccess: (res) => {
      toast.success(res.message);
      setSubject("");
      setDescription("");
      setPriority("MEDIUM");
      queryClient.invalidateQueries({ queryKey: ["customer-tickets", userId] });
    },
    onError: () => toast.error("خطا در ثبت تیکت"),
  });

  return (
    <Card className="relative border-t-4 border-t-indigo-500 shadow-md h-fit top-4 overflow-hidden">
      <DisabledSection />
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Plus className="h-5 w-5 text-indigo-600" />
          ثبت تیکت جدید
        </CardTitle>
        <CardDescription>
          درخواست خود را ثبت کنید تا تیم پشتیبانی بررسی کنند.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium">موضوع</Label>
          <Input
            placeholder="مثلا: مشکل در رزرو نوبت"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        <div>
          <Label className="text-sm font-medium">اولویت</Label>
          <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="انتخاب کنید" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">کم</SelectItem>
              <SelectItem value="MEDIUM">متوسط</SelectItem>
              <SelectItem value="HIGH">بالا</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-sm font-medium">توضیحات</Label>
          <Textarea
            placeholder="جزئیات مشکل را بنویسید..."
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <Button
          onClick={() => mutate()}
          disabled={isPending || !subject || !description}
          className="w-full bg-indigo-600 hover:bg-indigo-700"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "ارسال تیکت"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

const TicketList = ({ userId }: { userId: string }) => {
  const [modalState, setModalState] = useState<{
    open: boolean;
    id: string | null;
  }>({ id: null, open: false });

  const { data, isLoading } = useQuery({
    queryKey: ["customer-tickets", userId],
    queryFn: async () => {
      const res = await getCustomerTickets(userId);
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
  });

  if (isLoading)
    return <div className="p-8 text-center">در حال بارگذاری...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        تیکت‌های من
      </h2>
      {data && data.length > 0 ? (
        data.map((ticket) => (
          <Card
            key={ticket.id}
            className="hover:shadow-md transition-shadow border-r-4 border-r-indigo-200 dark:border-r-indigo-900"
          >
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {ticket.subject}
                    </h3>
                    <StatusBadge status={ticket.status} />
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                    {ticket.description}
                  </p>
                  <div className="text-xs text-gray-400 flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(ticket.createdAt).toLocaleDateString("fa-IR")}
                    </span>
                    {ticket.messages && ticket.messages.length > 0 && (
                      <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-[10px]">
                        آخرین پاسخ توسط{" "}
                        {ticket.messages[0].isAdmin ? "پشتیبان" : "شما"}
                      </span>
                    )}
                  </div>
                </div>
                <div className="md:w-32 flex md:flex-col justify-end gap-2">
                  {/* دکمه‌های اکشن می‌توانند اینجا باشند */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full md:w-auto"
                    type="button"
                    onClick={() => {
                      setModalState({ id: ticket.id, open: true });
                    }}
                  >
                    مشاهده
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300">
          <MessageSquare className="h-10 w-10 mx-auto text-gray-300 mb-2" />
          <p className="text-gray-500">هنوز تیکتی ثبت نکرده‌اید.</p>
        </div>
      )}
      <Modal
        open={modalState.open}
        onOpenChange={(open) => {
          setModalState((prev) => {
            if (!open) return { open: false, id: null };
            return { ...prev, open: true };
          });
        }}
      >
        <TicketDetailModal
          id={modalState.id || ""}
          onClose={() => {
            setModalState({ open: false, id: null });
          }}
          userId={userId}
        />
      </Modal>
    </div>
  );
};

export default function SupportPage() {
  const session = useSession();

  const userId = session.data?.user.id;

  if (!userId) {
    notFound();
  }

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          پشتیبانی و تیکت‌ها
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          در صورت بروز هرگونه مشکل، از این بخش با ما در ارتباط باشید.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* ستون سمت راست: لیست تیکت‌ها */}
        <div className="lg:col-span-2">
          <TicketList userId={userId} />
        </div>

        {/* ستون سمت چپ: فرم ثبت جدید */}
        <div className="lg:col-span-1">
          <CreateTicketForm userId={userId} />
        </div>
      </div>
    </div>
  );
}
