import {
  BaseField,
  Combobox,
  DatePicker,
  Modal,
  TimePicker,
} from "@/components";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, PenLine, X } from "lucide-react";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";

interface EditModalProps {
  date: Date;
  index: number;
}

interface RuleOption {
  farsiTitle: string;
  id: string;
}

const RULE_OPTIONS: RuleOption[] = [
  { farsiTitle: "تعطیلی امروز", id: "DAY_OFF" },
  { farsiTitle: "تغییر ساعت یک روز", id: "CUSTOM_DAY" },
  { farsiTitle: "تعطیلی بازه", id: "RANGE_OFF" },
  { farsiTitle: "تغییر ساعت بازه", id: "RANGE_CUSTOM" },
];

const EditModal = ({ date, index }: EditModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { setValue, watch } = useFormContext();

  const ruleType = watch(`calendarRules.${index}.type`);
  const formattedDate = date.toLocaleDateString("fa");

  const isDayOff = ruleType === "DAY_OFF";
  const isTimeOneDay = ruleType === "CUSTOM_DAY";
  const isOffRange = ruleType === "RANGE_OFF";
  const isTimeRange = ruleType === "RANGE_CUSTOM";

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleCancel = () => {
    setValue(`calendarRules.${index}.type`, undefined);
    handleClose();
  };

  const handleSubmit = () => {
    setValue(`calendarRules.${index}.startDate`, date.toISOString());
    setValue(`calendarRules.${index}.id`, index);
    handleClose();
  };

  const renderFormFields = () => {
    if (isTimeOneDay) {
      return (
        <>
          <BaseField
            label="شروع ساعت کاری امروز"
            component={TimePicker}
            name={`calendarRules.${index}.startTime`}
          />
          <BaseField
            label="پایان ساعت کاری امروز"
            component={TimePicker}
            name={`calendarRules.${index}.endTime`}
          />
        </>
      );
    }

    if (isOffRange) {
      return (
        <>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            تاریخ شروع: {formattedDate}
          </div>
          <BaseField
            name={`calendarRules.${index}.endDate`}
            component={DatePicker}
            label="تاریخ پایان"
          />
        </>
      );
    }

    if (isTimeRange) {
      return (
        <>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            تاریخ شروع: {formattedDate}
          </div>
          <BaseField
            name={`calendarRules.${index}.endDate`}
            component={DatePicker}
            label="تاریخ پایان"
          />
          <BaseField
            label="شروع ساعت کاری امروز"
            component={TimePicker}
            name={`calendarRules.${index}.startTime`}
          />
          <BaseField
            label="پایان ساعت کاری امروز"
            component={TimePicker}
            name={`calendarRules.${index}.endTime`}
          />
        </>
      );
    }

    return null;
  };

  return (
    <>
      <Button
        variant="link"
        type="button"
        size="sm"
        className="h-8 px-2"
        leftIcon={<PenLine className="w-3 h-3" />}
        onClick={handleOpen}
      >
        ویرایش
      </Button>

      <Modal
        title={formattedDate}
        open={isOpen}
        onOpenChange={setIsOpen}
        hideActions
        width="md:max-w-4xl"
      >
        <div className="space-y-4">
          <BaseField
            label="نوع تغییر"
            component={Combobox}
            name={`calendarRules.${index}.type`}
            options={RULE_OPTIONS}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderFormFields()}
          </div>

          <div
            className={cn(
              "flex justify-start items-center gap-2 justify-self-end"
            )}
          >
            <Button
              rightIcon={<X />}
              type="button"
              onClick={handleCancel}
              variant="destructive"
            >
              انصراف
            </Button>
            <Button onClick={handleSubmit} rightIcon={<Check />} type="button">
              ثبت تغییرات
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EditModal;
