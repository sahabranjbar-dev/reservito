import { BaseField } from "@/components";
import { Textarea } from "@/components/ui/textarea";
import { Check, Globe, MapPin } from "lucide-react";
import { Header } from "./StepAccount";

export const StepLocation = () => (
  <div className="space-y-6">
    <Header title="موقعیت مکانی" subtitle="آدرس دقیق فروشگاه را وارد کنید." />

    <BaseField
      name="address"
      component={Textarea}
      icon={<MapPin />}
      maxLength={200}
      label="آدرس"
      required
    />

    <div className="h-48 border-dashed border-2 rounded-xl flex items-center justify-center text-slate-400">
      <Globe />
    </div>

    <div className="flex items-center gap-2 bg-green-50 p-4 rounded-xl">
      <Check className="text-green-600" />
      <span>۱۴ روز استفاده رایگان</span>
    </div>
  </div>
);
