import { BaseField, CheckboxContainer, TextCore } from "@/components";

const ServiceFormFields = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <BaseField
        component={TextCore}
        name="title"
        label="عنوان سرویس"
        required
      />

      <BaseField
        component={TextCore}
        name="duration"
        label="مدت زمان (دقیقه)"
        number
        formatter
        required
      />
      <BaseField
        component={TextCore}
        name="price"
        label="قیمت"
        required
        number
        formatter
      />

      <BaseField component={CheckboxContainer} name="isActive" text="فعال" />
    </div>
  );
};

export default ServiceFormFields;
