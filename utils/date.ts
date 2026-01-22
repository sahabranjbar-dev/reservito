import { format } from "date-fns";
import { faIR } from "date-fns/locale";

export function toPersianDate(date: Date) {
  return format(date, "yyyy/MM/dd", { locale: faIR });
}

export function toPersianWeekday(date: Date) {
  return format(date, "EEEE", { locale: faIR });
}

export function startOfMonth(date: Date) {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfMonth(date: Date) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1);
  d.setDate(0);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export const getPersianMonthLabel = (date: Date) => {
  return new Intl.DateTimeFormat("fa-IR", {
    month: "long",
  }).format(date);
};
