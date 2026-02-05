"use client";
import { Modal } from "@/components";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookingStatus } from "@/constants/enums";
import { useConfirm } from "@/hooks/useConfirm";
import { cn } from "@/lib/utils";
import {
  convertToFarsiDigits,
  copyTextToClipboard,
  getFullDateTime,
} from "@/utils/common";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Calendar,
  Clock,
  Coins,
  MoreVertical,
  Phone,
  Scissors,
  TextInitial,
  User,
} from "lucide-react";
import { Activity, useState } from "react";
import { toast } from "sonner";
import {
  getStaffBookingDetails,
  updateBookingStatusAction,
} from "../../schedule/_meta/actions";

interface Props {
  id: string;
}

const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: "در انتظار",
  CONFIRMED: "تأیید شده",
  COMPLETED: "تکمیل شده",
  CANCELED: "لغو شده",
  REJECTED: "رد شده",
  NO_SHOW_CUSTOMER: "عدم حضور مشتری",
  NO_SHOW_STAFF: "عدم حضور همکار",
};

const StaffBookingListButton = ({ id: bookingId }: Props) => {
  const confirm = useConfirm();
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus>();

  const [openModal, setOpenModal] = useState<boolean>(false);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["booking-details", bookingId],
    queryFn: async () => {
      const result = await getStaffBookingDetails({ bookingId });
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateBookingStatusAction,
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.error);
      }
      refetch();
    },
  });

  const submitStatusChange = async () => {
    if (!selectedStatus || selectedStatus === data?.status) return;

    const confirmed = await confirm({
      title: `آیا می‌خواهید وضعیت رزرو را به «${BOOKING_STATUS_LABELS[selectedStatus]}» تغییر دهید؟`,
      description: null,
    });

    if (!confirmed) return;

    await mutateAsync({
      bookingId,
      status: selectedStatus,
    });
  };

  if (isLoading) return <BookingDetailsSkeleton />;

  if (isError) {
    return (
      <div className="p-6 text-center text-red-600">
        {error?.message || "خطا در دریافت اطلاعات"}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div>
      <Button
        variant="ghost"
        type="button"
        onClick={() => {
          setOpenModal(true);
        }}
      >
        <MoreVertical />
      </Button>

      <Modal
        hideActions
        title="جزئیات نوبت"
        open={openModal}
        onOpenChange={setOpenModal}
      >
        <div className="bg-white border rounded-2xl">
          {/* Header */}
          <div className="p-5 border-b bg-slate-50 grid grid-cols-1 md:grid-cols-2">
            <div>
              <h3 className="font-bold text-lg">جزئیات رزرو</h3>
              <p className="text-xs text-slate-500 mt-1">کد رزرو: {data.id}</p>
            </div>

            <div>
              <Label className="my-2">تغییر وضعیت رزرو</Label>
              <Select
                value={selectedStatus ?? undefined}
                onValueChange={(v) => setSelectedStatus(v as BookingStatus)}
                dir="rtl"
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="انتخاب وضعیت" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(BOOKING_STATUS_LABELS) as BookingStatus[]).map(
                    (status) => (
                      <SelectItem
                        key={status}
                        value={status}
                        className="cursor-pointer"
                      >
                        {BOOKING_STATUS_LABELS[status]}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Body */}
          <div className="space-y-6 grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <DetailRow
              icon={<User className="w-4 h-4" />}
              label="مشتری"
              value={data.customer?.fullName || "—"}
            />
            <DetailRow
              icon={<Phone className="w-4 h-4" />}
              label="شماره تماس"
              value={data.customer?.phone}
              isCopyable
            />
            <DetailRow
              icon={<Scissors className="w-4 h-4" />}
              label="سرویس"
              value={data.service?.name}
            />
            <DetailRow
              icon={<Clock className="w-4 h-4" />}
              label="مدت زمان"
              value={`${data.service?.duration} دقیقه`}
            />
            <DetailRow
              icon={<Coins className="w-4 h-4" />}
              label="قیمت"
              value={`${convertToFarsiDigits(data.service?.price?.toLocaleString() ?? "")} تومان`}
            />
            <DetailRow
              icon={<Calendar className="w-4 h-4" />}
              label="تاریخ"
              value={getFullDateTime(data.startTime)}
            />

            <Activity mode={data.customerNotes ? "visible" : "hidden"}>
              <div className="border p-2 rounded-lg bg-blue-50 md:col-span-2 ">
                <p className="flex justify-start items-center gap-2 text-slate-500">
                  <span className="p-1.5 bg-slate-50 rounded-lg border border-slate-100 ">
                    <TextInitial className="w-4 h-4" />
                  </span>

                  <span> توضیحات:</span>
                </p>
                <p className="p-4">{data.customerNotes}</p>
              </div>
            </Activity>

            {/* تغییر وضعیت */}
            <div className="space-y-2 md:col-span-2">
              <button
                disabled={
                  !selectedStatus || isPending || selectedStatus === data.status
                }
                onClick={submitStatusChange}
                className={cn(
                  "w-full mt-2 py-2 rounded-xl text-sm font-medium transition",
                  !selectedStatus || isPending || selectedStatus === data.status
                    ? "bg-slate-100 text-slate-400"
                    : "bg-indigo-600 text-white hover:bg-indigo-700",
                )}
              >
                ثبت تغییر وضعیت
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StaffBookingListButton;

const DetailRow = ({
  icon,
  label,
  value,
  valueClassName = "text-slate-700",
  isCopyable = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
  isCopyable?: boolean;
}) => (
  <div className="flex justify-between items-center group border p-2 rounded-lg bg-blue-50">
    <div className="flex items-center gap-3 text-sm text-slate-500">
      <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-100">
        {icon}
      </div>
      <span>{label}</span>
    </div>
    <span
      className={cn(
        "text-left",
        valueClassName,
        isCopyable && "cursor-pointer hover:text-indigo-600 transition-colors",
      )}
      title={value}
      onClick={() =>
        isCopyable &&
        copyTextToClipboard(value).then(() => toast.success("کپی شد."))
      }
    >
      {value}
    </span>
  </div>
);

const BookingDetailsSkeleton = () => (
  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-5 animate-pulse">
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <div className="h-5 bg-slate-100 rounded w-32" />
        <div className="h-4 bg-slate-100 rounded w-20" />
      </div>
      <div className="h-6 bg-slate-100 rounded-full w-16" />
    </div>

    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-100 rounded-lg" />
            <div className="h-4 bg-slate-100 rounded w-20" />
          </div>
          <div className="h-4 bg-slate-100 rounded w-24" />
        </div>
      ))}
    </div>

    <div className="h-px bg-slate-100 w-full" />

    <div className="flex gap-3 pt-2">
      <div className="h-10 bg-slate-100 rounded-xl flex-1" />
      <div className="h-10 bg-indigo-50 rounded-xl flex-1" />
    </div>
  </div>
);
