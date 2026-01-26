import { BaseField, TextCore } from "@/components";
import { Building2, Eye, EyeOff, Phone, User } from "lucide-react";
import { useMemo, useState } from "react";

export const StepAccount = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const passwordVisibleHandler = () => {
    setShowPassword((prev) => !prev);
  };

  const passwordIcon = useMemo(() => {
    const Icon = showPassword ? EyeOff : Eye;
    return (
      <Icon
        className="text-slate-400 cursor-pointer"
        size={24}
        onClick={passwordVisibleHandler}
      />
    );
  }, [showPassword]);

  return (
    <div className="space-y-6">
      <Header title="خوش آمدید!" subtitle="اطلاعات شخصی خود را وارد کنید." />

      <div>
        <BaseField
          name="username"
          component={TextCore}
          icon={<Building2 className="text-slate-400" size={24} />}
          label="نام کاربری"
          placeholder="نام کاربری کسب‌وکار را وارد کنید"
          required
        />
      </div>

      <BaseField
        name="ownerFullname"
        component={TextCore}
        icon={<User className="text-slate-400" size={24} />}
        label="نام و نام خانوادگی"
        placeholder="نام و نام خانوادگی مدیر کسب‌وکار را وارد کنید"
        required
        className="pl-12 overflow-hidden text-ellipsis"
      />

      <BaseField
        name="phone"
        component={TextCore}
        icon={<Phone className="text-slate-400" size={24} />}
        label="شماره موبایل"
        placeholder="شماره موبایل خود را وارد کنید"
        required
        className="pl-12 overflow-hidden text-ellipsis ltr"
      />

      <BaseField
        name="password"
        component={TextCore}
        icon={passwordIcon}
        label="رمز عبور"
        placeholder="رمز عبور را وارد کنید"
        type={showPassword ? "text" : "password"}
        required
        className="pl-12 overflow-hidden text-ellipsis"
      />
    </div>
  );
};

export const Header = ({ title, subtitle }: any) => (
  <div>
    <h2 className="text-2xl font-bold">{title}</h2>
    <p className="text-slate-500">{subtitle}</p>
  </div>
);
