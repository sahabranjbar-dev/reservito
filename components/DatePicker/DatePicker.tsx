"use client";
import { useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { faIR } from "react-day-picker/persian";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";

interface Props {
  label?: string;
  onChange?: (v: any) => void;
  value: Date | undefined;
}

const DatePicker = ({ label, onChange, value, ...res }: Props) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!value}
          className="data-[empty=true]:text-muted-foreground min-w-70 w-full justify-start text-left font-normal"
        >
          <CalendarIcon />
          {value ? (
            typeof value === "object" ? (
              value?.toLocaleDateString("fa")
            ) : (
              new Date(value).toLocaleDateString("fa")
            )
          ) : (
            <span>{`${label} را انتخاب کنید`}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          {...res}
          locale={faIR}
          mode="single"
          selected={value}
          onSelect={(selected) => {
            onChange?.(selected);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
