"use client";
import {
  BaseField,
  Combobox,
  DatePicker,
  FilterButtons,
  Form,
  TextCore,
} from "@/components";
import { BOOKING_STATUS } from "@/constants/common";
import { BookingStatus } from "@/constants/enums";
import { useRouter, useSearchParams } from "next/navigation";

interface IForm {
  customerName?: string;
  customerPhone?: string;
  serviceName?: string;
  date?: string;
  status?: BookingStatus;
}

const StaffBookingFilter = () => {
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  // گرفتن همه مقادیر از URLSearchParams
  const defaultValues: IForm = {
    customerName: searchParams.get("customerName") || "",
    customerPhone: searchParams.get("customerPhone") || "",
    serviceName: searchParams.get("serviceName") || "",
    date: searchParams.get("date") || "",
    status: (searchParams.get("status") as BookingStatus) || undefined,
  };

  const onSubmit = (values: IForm) => {
    const params = new URLSearchParams();

    Object.entries(values).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });

    replace(`/dashboard/staff/bookings?${params.toString()}`);
  };

  const removeFilterHandler = () => {
    replace(`/dashboard/staff/bookings`);
  };
  return (
    <Form<IForm> defaultValues={defaultValues} onSubmit={onSubmit}>
      {({ reset, setValue }) => {
        return (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <BaseField
              component={TextCore}
              label="نام مشتری"
              name="customerName"
            />
            <BaseField
              component={TextCore}
              label="موبایل مشتری"
              name="customerPhone"
            />
            <BaseField
              component={TextCore}
              label="نام سرویس"
              name="serviceName"
            />

            <BaseField component={DatePicker} label="تاریخ رزرو" name="date" />

            <BaseField
              component={Combobox}
              label="وضعیت"
              name="status"
              options={Object.entries(BOOKING_STATUS).map(([key, value]) => ({
                id: key,
                farsiTitle: value,
              }))}
            />

            <FilterButtons
              removeFilterHandler={() => {
                setValue("date", "");
                reset();
                removeFilterHandler();
              }}
            />
          </div>
        );
      }}
    </Form>
  );
};

export default StaffBookingFilter;
