"use client";
import { getBusinessTypeOptions } from "@/app/business/_meta/utils";
import {
  BaseField,
  Combobox,
  Form,
  FormButtons,
  SwitchContainer,
  TextCore,
} from "@/components";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { BusinessRegistrationStatus, BusinessType } from "@/constants/enums";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateBusiness } from "../_meta/actions/businessActions";

interface Props {
  businessData?: any;
}

interface IData {
  id: string;
  businessName: string;
  ownerName: string;
  identifier: string;
  businessType: BusinessType;
  commissionRate: number;
  registrationStatus: BusinessRegistrationStatus;
  description: string;
  address: string;
  timezone: string;
  rejectionReason: string;
  isActive: boolean;
  allowOnlinePayment: boolean;
  allowOfflinePayment: boolean;
}

// گزینه‌های وضعیت ثبت
const registrationStatusOptions = [
  { id: "PENDING", farsiTitle: "در انتظار بررسی" },
  { id: "APPROVED", farsiTitle: "تایید شده" },
  { id: "REJECTED", farsiTitle: "رد شده" },
];

// گزینه‌های منطقه زمانی
const timezoneOptions = [
  { id: "Asia/Tehran", farsiTitle: "تهران (ایران)" },
  { id: "Asia/Dubai", farsiTitle: "دبی (امارات)" },
  { id: "Europe/Istanbul", farsiTitle: "استانبول (ترکیه)" },
  { id: "America/New_York", farsiTitle: "نیویورک (آمریکا)" },
  { id: "Europe/London", farsiTitle: "لندن (انگلیس)" },
];

const AdminBusinessForm = ({ businessData }: Props) => {
  const { isPending: submitLoading, mutateAsync } = useMutation({
    mutationFn: async (data: IData) => {
      const result = await updateBusiness(data);

      if (!result.success) {
        toast.error(result.message || "خطا در به‌روزرسانی کسب‌وکار");
      } else {
        toast.success("کسب‌وکار با موفقیت به‌روزرسانی شد");
      }

      return result;
    },
  });

  const handleSubmit = async (values: IData) => {
    await mutateAsync(values);
  };

  const businessTypeOptions = getBusinessTypeOptions().map((option) => ({
    id: option.id,
    farsiTitle: option.titleFa,
  }));

  return (
    <Card className="m-4">
      <CardTitle>ویرایش کسب‌وکار</CardTitle>
      <CardContent>
        <Form onSubmit={handleSubmit} defaultValues={businessData || {}}>
          <div className="space-y-8">
            {/* بخش اطلاعات اصلی */}
            <>
              <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                اطلاعات اصلی
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BaseField
                  name="businessName"
                  component={TextCore}
                  label="نام کسب‌وکار"
                  required
                />

                <BaseField
                  name="ownerName"
                  component={TextCore}
                  label="نام مالک"
                  required
                />

                <BaseField
                  name="identifier"
                  component={TextCore}
                  label="شناسه کسب‌وکار"
                  required
                />

                <BaseField
                  name="businessType"
                  component={Combobox}
                  label="نوع کسب‌وکار"
                  options={businessTypeOptions}
                  placeholder="انتخاب نوع کسب‌وکار"
                  required
                  rules={{ required: "نوع کسب‌وکار الزامی است" }}
                />

                <BaseField
                  name="commissionRate"
                  component={TextCore}
                  number
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  label="درصد کمیسیون پلتفرم"
                  placeholder="مثال: ۱۰"
                  description="عدد بین ۰ تا ۱۰۰"
                  required
                  validate={(value: number) => {
                    if (value > 100) {
                      return "حداکثر مقدار ۱۰۰ است";
                    } else if (value < 0) {
                      return "حداقل مقدار ۰ است";
                    } else return true;
                  }}
                />

                <BaseField
                  name="registrationStatus"
                  component={Combobox}
                  label="وضعیت ثبت"
                  options={registrationStatusOptions}
                  required
                />
              </div>
            </>

            {/* بخش اطلاعات تکمیلی */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                اطلاعات تکمیلی
              </h3>

              <div className="space-y-6">
                <BaseField
                  name="description"
                  component={Textarea}
                  label="توضیحات"
                  placeholder="توضیحات کامل درباره کسب‌وکار"
                  rows={4}
                  description="حداکثر ۵۰۰ کاراکتر"
                />

                <BaseField
                  name="address"
                  component={Textarea}
                  label="آدرس کامل"
                  placeholder="آدرس دقیق کسب‌وکار"
                  rows={3}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <BaseField
                    name="timezone"
                    component={Combobox}
                    label="منطقه زمانی"
                    options={timezoneOptions}
                    required
                    rules={{ required: "منطقه زمانی الزامی است" }}
                  />

                  {/* دلیل رد - فقط زمانی نمایش داده شود که وضعیت REJECTED است */}
                  <BaseField
                    name="rejectionReason"
                    component={TextCore}
                    label="دلیل رد (در صورت رد شدن)"
                    placeholder="دلیل رد درخواست"
                    description="فقط برای وضعیت رد شده"
                    // با استفاده از conditional rendering یا hidden field بهتر است
                  />
                </div>
              </div>
            </div>

            {/* بخش تنظیمات */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                تنظیمات سیستم
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                <BaseField
                  name="isActive"
                  component={SwitchContainer}
                  label="وضعیت فعال"
                  description="فعال/غیرفعال کردن کسب‌وکار"
                />

                <BaseField
                  name="allowOnlinePayment"
                  component={SwitchContainer}
                  label="پرداخت آنلاین"
                  description="اجازه پرداخت آنلاین"
                />

                <BaseField
                  name="allowOfflinePayment"
                  component={SwitchContainer}
                  label="پرداخت در محل"
                  description="اجازه پرداخت حضوری"
                />
              </div>
            </div>

            <div className="justify-self-end">
              <FormButtons
                cancelUrl="/dashboard/admin/businesses"
                submitLoading={submitLoading}
              />
            </div>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AdminBusinessForm;
