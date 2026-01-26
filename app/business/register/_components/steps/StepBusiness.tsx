import { BaseField, Combobox, TextCore } from "@/components";
import { Building } from "lucide-react";
import { businessOptions } from "../../meta/constants";
import { Header } from "./StepAccount";

export const StepBusiness = () => (
  <div className="space-y-8">
    <Header title="معرفی کسب‌وکار" subtitle="نوع فعالیت خود را مشخص کنید." />

    <BaseField
      name="businessName"
      component={TextCore}
      icon={<Building />}
      label="نام کسب‌وکار"
      required
    />

    <BaseField
      name="businessType"
      component={Combobox}
      options={businessOptions}
      label="نوع فعالیت"
      required
    />
  </div>
);
