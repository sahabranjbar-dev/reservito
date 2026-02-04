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
  staffName?: string;
  date?: string;
  status?: BookingStatus;
}

const BusinessBookingsFilters = () => {
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  // گرفتن همه مقادیر از URLSearchParams
  const defaultValues: IForm = {
    customerName: searchParams.get("customerName") || "",
    customerPhone: searchParams.get("customerPhone") || "",
    serviceName: searchParams.get("serviceName") || "",
    staffName: searchParams.get("staffName") || "",
    date: searchParams.get("date") || "",
    status: (searchParams.get("status") as BookingStatus) || null,
  };

  const onSubmit = (values: IForm) => {
    const params = new URLSearchParams();

    Object.entries(values).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });

    replace(`/dashboard/business/bookings?${params.toString()}`);
  };

  const removeFilterHandler = () => {
    replace(`/dashboard/business/bookings`);
  };

  return (
    <Form<IForm>
      onSubmit={onSubmit}
      className="grid grid-cols-1 md:grid-cols-4 gap-2"
      defaultValues={defaultValues}
    >
      {({ reset }) => {
        return (
          <>
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
            <BaseField
              component={TextCore}
              label="نام همکار"
              name="staffName"
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
                reset();
                removeFilterHandler();
              }}
            />
          </>
        );
      }}
    </Form>
  );
};

export default BusinessBookingsFilters;
