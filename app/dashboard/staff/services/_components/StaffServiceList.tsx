"use client";
import {
  BaseField,
  CheckboxContainer,
  Form,
  Modal,
  TextCore,
} from "@/components";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import {
  getServiceDetails,
  requestServiceChangeAction,
} from "../_meta/actions";

export interface IStaff {
  id: string;
  businessId: string;
  userId: string;
  name: string;
  avatar: any;
  phone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  services: Service[];
  bookings: Booking[];
  exceptions: any[];
  serviceChangeRequests: ServiceChangeRequest[];
  schedules: Schedule[];
}

export interface Service {
  id: string;
  serviceId: string;
  staffId: string;
  overridePrice: any;
  service: Service2;
}

export interface Service2 {
  id: string;
  name: string;
  description: any;
  price: number;
  duration: number;
  capacity: number;
  depositRequired: boolean;
  depositAmount: any;
  isActive: boolean;
  businessId: string;
}

export interface Booking {
  id: string;
  businessId: string;
  customerId: string;
  serviceId: string;
  staffId: string;
  startTime: string;
  endTime: string;
  status: string;
  totalPrice: number;
  customerNotes: string;
  internalNotes: any;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  createdById: any;
}

export interface ServiceChangeRequest {
  id: string;
  staffId: string;
  serviceId: string;
  requestedPrice: any;
  requestedActive: any;
  requestedName: any;
  requestedDescription: any;
  requestedDuration: any;
  status: string;
  rejectionReason: any;
  createdAt: string;
  reviewedAt: any;
}

export interface Schedule {
  id: string;
  staffId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isClosed: boolean;
}

interface Props {
  staff: IStaff;
}

interface IForm {
  requestedName: string;
  requestedPrice: number;
  requestedDuration: number;
  requestedActive: boolean;
  requestedDescription: string;
  rejectionReason: string;
  serviceId: string;
}

const StaffServicesList = ({ staff }: Props) => {
  const services = staff?.services;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: serviceDetailsData, mutateAsync: getServiceDetail } =
    useMutation({
      mutationFn: async (serviceId: string) => {
        const response = await getServiceDetails(serviceId);
        return response;
      },
    });

  const { mutateAsync: fetchChangeData } = useMutation({
    mutationFn: async (data: IForm) => {
      const response = await requestServiceChangeAction(data);

      return response;
    },
    onSuccess: (data) => {
      if (!data?.success) return;
      toast.success(data.message);
    },
  });

  const handleOpenRequestModal = async (service: Service) => {
    await getServiceDetail(service.serviceId);

    setIsModalOpen(true);
  };

  const handleSubmitRequest = (data: IForm) => {
    fetchChangeData(data).then((data) => {
      if (!data.success) return;
      setIsModalOpen(false);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* --- بخش نمایش اطلاعات پرسنل --- */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 flex items-center justify-between border border-gray-100">
          <div className="flex items-center gap-4">
            <Image
              width={100}
              height={100}
              src={staff.avatar || "/images/placeholder.png"}
              alt={staff.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-primary-100"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-800">{staff.name}</h1>
              <p className="text-gray-500 font-medium flex items-center gap-2">
                <span>شماره تماس:</span>
                <span className="bg-gray-100 px-2 py-0.5 rounded text-sm text-gray-700">
                  {staff.phone}
                </span>
              </p>
            </div>
          </div>
          <div className="text-left hidden md:block">
            <p className="text-sm text-gray-400">نقش کاربری</p>
            <p className="text-sm font-semibold text-blue-600">همکار / پرسنل</p>
          </div>
        </div>

        {/* --- لیست خدمات --- */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">خدمات من</h2>
          <span className="text-xs text-gray-500 bg-yellow-50 px-2 py-1 rounded border border-yellow-100">
            برای تغییر مشخصات خدمات، درخواست خود را ثبت کنید
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-5 relative group"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">
                    {service.service.name}
                  </h3>
                  {service.service.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {service.service.description}
                    </p>
                  )}
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    service.service.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {service.service.isActive ? "فعال" : "غیرفعال"}
                </span>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="flex gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    💰
                    {new Intl.NumberFormat("fa-IR").format(
                      service.service.price,
                    )}{" "}
                    تومان
                  </span>
                  <span className="flex items-center gap-1">
                    ⏱️ {service.service.duration} دقیقه
                  </span>
                </div>

                <button
                  onClick={() => handleOpenRequestModal(service)}
                  className="text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors font-medium"
                >
                  درخواست تغییر
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* --- مودال درخواست تغییر --- */}
        <Modal
          onOpenChange={setIsModalOpen}
          open={isModalOpen}
          title={`درخواست تغییر: ${serviceDetailsData?.serviceDetail?.name}`}
          width="md:max-w-2xl max-h-[94vh] overflow-scroll"
          hideActions
        >
          <>
            <Form
              defaultValues={{
                requestedActive: serviceDetailsData?.serviceDetail?.isActive,
                requestedDuration: serviceDetailsData?.serviceDetail?.duration,
                requestedName: serviceDetailsData?.serviceDetail?.name,
                requestedPrice: Number(
                  serviceDetailsData?.serviceDetail?.price,
                ),
                serviceId: serviceDetailsData?.serviceDetail?.id,
                requestedDescription:
                  serviceDetailsData?.serviceDetail?.description ?? "",
              }}
              onSubmit={handleSubmitRequest}
              className="p-6"
            >
              {({ watch }) => {
                return (
                  <>
                    {/* توضیحات برای کاربر */}
                    <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded-md mb-4">
                      تغییرات اعمال شده پس از تایید مدیر کسب‌وکار در سایت اصلی
                      اعمال خواهند شد. مقادیر فعلی در اینجا پیش‌فرض هستند.
                    </div>

                    {/* فیلد نام سرویس */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <BaseField
                        name="requestedName"
                        component={TextCore}
                        label="نام خدمت"
                        required
                      />
                      <BaseField
                        name="requestedPrice"
                        component={TextCore}
                        label="قیمت (تومان)"
                        required
                        number
                        formatter
                      />

                      <BaseField
                        name="requestedDuration"
                        component={TextCore}
                        label="مدت زمان (دقیقه)"
                        required
                        number
                      />

                      <BaseField
                        name="requestedActive"
                        component={CheckboxContainer}
                        text={`این سرویس برای من ${watch("requestedActive") ? "فعال" : "غیرفعال"} باشد`}
                      />

                      <BaseField
                        name="requestedDescription"
                        component={Textarea}
                        label="توضیحات سرویس"
                        containerClassName="col-span-2"
                      />
                      <BaseField
                        name="rejectionReason"
                        component={Textarea}
                        label="دلیل تغییر این سرویس"
                        containerClassName="col-span-2"
                      />

                      {/* دکمه‌های اقدام */}
                      <div className="col-span-2 flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => setIsModalOpen(false)}
                          className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          انصراف
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors"
                        >
                          ارسال درخواست به مدیر
                        </button>
                      </div>
                    </div>
                  </>
                );
              }}
            </Form>
          </>
        </Modal>
      </div>
    </div>
  );
};

export default StaffServicesList;
