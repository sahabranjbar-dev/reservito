"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Calendar, Loader2, Save } from "lucide-react";
import React, { useEffect, useReducer, useState } from "react";

import { Combobox, SwitchComponent, TimePicker } from "@/components";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  UpsertStaffExceptions,
  upsertStaffExceptions,
} from "@/app/actions/staff-exception.action";
import { Separator } from "@/components/ui/separator";
import { ExceptionType } from "@/constants/enums";
import {
  convertToFarsiDigits,
  getCurrentDate,
  getFullDate,
} from "@/utils/common";
import { toast } from "sonner";
import ExceptionCalendar, { RangeValue } from "./_components/ExceptionCalendar";
import { getStaffExceptions, getStaffList } from "./_meta/actions";
import { EXCEPTIONS_TYPE_OPTIONS } from "./_meta/constants";

/* ---------------------------------- types --------------------------------- */

type CalendarMode = "single" | "multiple" | "range";

interface TimeRange {
  startTime?: string | null;
  endTime?: string | null;
}

interface ExceptionFormState {
  mode: CalendarMode;

  singleDate: string | null;
  multipleDates: string[];
  range: RangeValue;
  time: TimeRange;
  exceptionType: ExceptionType | null;

  isClosed: boolean;
  reason: string;
}

type Action =
  | { type: "SET_MODE"; payload: CalendarMode }
  | { type: "SET_SINGLE_DATE"; payload: string | null }
  | { type: "SET_MULTIPLE_DATES"; payload: string[] }
  | { type: "SET_RANGE"; payload: RangeValue }
  | { type: "SET_TIME"; payload: TimeRange }
  | { type: "SET_EXCEPTION_TYPE"; payload: ExceptionType }
  | { type: "TOGGLE_CLOSED"; payload: boolean }
  | { type: "SET_REASON"; payload: string }
  | { type: "RESET_FORM" };

/* -------------------------------- reducer -------------------------------- */

/* ------------------------------ helpers ------------------------------ */

const isCloseType = (type: ExceptionType | null) =>
  type === ExceptionType.ONE_DAY_CLOSE ||
  type === ExceptionType.MULTI_DAYS_CLOSE ||
  type === ExceptionType.RANGE_DAYS_CLOSE;

const isChangeType = (type: ExceptionType | null) =>
  type === ExceptionType.ONE_DAY_CHANGE ||
  type === ExceptionType.MULTI_DAYS_CHANGE ||
  type === ExceptionType.RANGE_DAYS_CHANGE;

/* ------------------------------ component ------------------------------ */

const BusinessDashboardExceptions = () => {
  const { data: staffExceptions, mutateAsync: staffExceptionsMutate } =
    useMutation({
      mutationFn: async (data: { staffId: string }) => {
        const result = await getStaffExceptions(data);

        if (!result.success) {
          toast.error("دریافت اطلاعات همکاران با خطا مواجه شد");
          throw new Error("دریافت اطلاعات همکاران با خطا مواجه شد");
        }

        return result.StaffExceptions;
      },
    });

  const initialState: ExceptionFormState = {
    mode: "single",

    singleDate: null,
    multipleDates: [],
    range: { start: null, end: null },
    time: { startTime: null, endTime: null },
    exceptionType: ExceptionType.ONE_DAY_CLOSE,

    isClosed: false,
    reason: "",
  };
  function reducer(
    state: ExceptionFormState,
    action: Action,
  ): ExceptionFormState {
    switch (action.type) {
      case "SET_MODE":
        return { ...state, mode: action.payload };

      case "SET_SINGLE_DATE":
        return { ...state, singleDate: action.payload };

      case "SET_MULTIPLE_DATES":
        return { ...state, multipleDates: action.payload };

      case "SET_RANGE":
        return { ...state, range: action.payload };

      case "SET_TIME":
        return { ...state, time: action.payload };

      case "SET_EXCEPTION_TYPE":
        return {
          ...state,
          exceptionType: action.payload,
          isClosed: action.payload === ExceptionType.ONE_DAY_CLOSE,
          reason: "",
        };

      case "TOGGLE_CLOSED":
        return { ...state, isClosed: action.payload };

      case "SET_REASON":
        return { ...state, reason: action.payload };

      case "RESET_FORM":
        return initialState;

      default:
        return state;
    }
  }
  const [state, dispatch] = useReducer(reducer, initialState);

  const [staffId, setStaffId] = useState<string | null>(null);

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (data: UpsertStaffExceptions) => {
      const result = await upsertStaffExceptions(data);

      if (!result.success && result.message) {
        if (typeof result.message === "object") {
          result.message?.forEach(({ message }: { message: string }) => {
            toast.error(message);
            throw new Error(message);
          });
        } else {
          toast.error(result.message);
          throw new Error(result.message);
        }
      }

      toast.success(result.message ?? "عملیات با موفقیت انجام شد");
      return result;
    },
  });

  const {
    data: staffList,
    isLoading: staffListLoading,
    isFetching: staffListFetching,
  } = useQuery({
    queryKey: ["staff-option-exception"],
    queryFn: async () => {
      const result = await getStaffList();

      if (!result.success) {
        toast.error("دریافت اطلاعات همکاران با خطا مواجه شد");
        throw new Error("دریافت اطلاعات همکاران با خطا مواجه شد");
      }

      return result.resolvedStaffOption;
    },
  });

  useEffect(() => {
    if (!staffId) return;
    staffExceptionsMutate({ staffId });
  }, [staffExceptionsMutate, staffId]);

  const renderSelectedDates = () => {
    if (state.mode === "single" && state.singleDate)
      return `تاریخ انتخاب شده: ${getFullDate(new Date(state.singleDate))}`;

    if (state.mode === "multiple" && state.multipleDates.length)
      return (
        <div className="space-y-1">
          {state.multipleDates.map((d, i) => (
            <div key={d} className="text-sm">
              {convertToFarsiDigits(String(i + 1))} {getFullDate(new Date(d))}
            </div>
          ))}
        </div>
      );

    if (state.mode === "range" && state.range.start && state.range.end)
      return `از ${getFullDate(
        new Date(state.range.start),
      )} تا ${getFullDate(new Date(state.range.end))}`;

    return "تاریخی انتخاب نشده";
  };
  const submitHandler = async () => {
    if (!staffId) {
      toast.error("لطفاً یک همکار را انتخاب کنید");
      return;
    }
    let payload: Omit<UpsertStaffExceptions, "staffId"> = {
      mode: "single",
    };
    if (state.exceptionType === ExceptionType.ONE_DAY_CHANGE) {
      payload = {
        startTime: state?.time?.startTime,
        endTime: state?.time?.endTime,
        mode: "single",
        singleDate: state?.singleDate,
        isClosed: false,
      };
    } else if (state.exceptionType === ExceptionType.MULTI_DAYS_CHANGE) {
      payload = {
        startTime: state?.time?.startTime,
        endTime: state?.time?.endTime,
        mode: "multiple",
        isClosed: false,
        multipleDates: state?.multipleDates,
      };
    } else if (state.exceptionType === ExceptionType.RANGE_DAYS_CHANGE) {
      payload = {
        startTime: state?.time?.startTime,
        endTime: state?.time?.endTime,
        mode: "range",
        isClosed: false,
        range: { from: state?.range?.start, to: state?.range?.end },
      };
    } else if (state.exceptionType === ExceptionType.ONE_DAY_CLOSE) {
      payload = {
        mode: "single",
        isClosed: true,
        singleDate: state?.singleDate,
        reason: state?.reason,
      };
    } else if (state.exceptionType === ExceptionType.MULTI_DAYS_CLOSE) {
      payload = {
        mode: "multiple",
        isClosed: true,
        reason: state?.reason,
        multipleDates: state?.multipleDates,
      };
    } else if (state.exceptionType === ExceptionType.RANGE_DAYS_CLOSE) {
      payload = {
        mode: "range",
        isClosed: true,
        reason: state?.reason,
        range: { from: state?.range?.start, to: state?.range?.end },
      };
    }

    await mutateAsync({
      ...payload,
      staffId,
    }).finally(async () => {
      await staffExceptionsMutate({ staffId });
    });
  };

  const exceptionTypeChangeHandler = (value: ExceptionType) => {
    let mode: CalendarMode = "single";

    if (
      value === ExceptionType.MULTI_DAYS_CLOSE ||
      value === ExceptionType.MULTI_DAYS_CHANGE
    )
      mode = "multiple";

    if (
      value === ExceptionType.RANGE_DAYS_CLOSE ||
      value === ExceptionType.RANGE_DAYS_CHANGE
    )
      mode = "range";

    dispatch({ type: "SET_EXCEPTION_TYPE", payload: value });
    dispatch({ type: "SET_MODE", payload: mode });
  };

  const normalizedExceptions = React.useMemo(() => {
    if (!staffExceptions) return [];

    return staffExceptions.map((e) => ({
      ...e,
      date: new Date(e.date).toISOString()?.slice(0, 10),
      isClosed: e.isClosed,
    }));
  }, [staffExceptions]);

  useEffect(() => {
    if (
      state.exceptionType !== ExceptionType.ONE_DAY_CLOSE ||
      !state.singleDate ||
      !normalizedExceptions.length
    )
      return;

    const found = normalizedExceptions.find((e) => e.date === state.singleDate);

    dispatch({
      type: "TOGGLE_CLOSED",
      payload: !!found?.isClosed,
    });
  }, [state.singleDate, state.exceptionType, normalizedExceptions]);

  useEffect(() => {
    if (
      state.exceptionType !== ExceptionType.ONE_DAY_CHANGE ||
      !state.singleDate ||
      !normalizedExceptions.length
    )
      return;

    const found = normalizedExceptions.find((e) => e.date === state.singleDate);

    dispatch({
      type: "SET_TIME",
      payload: {
        startTime: found?.startTime,
        endTime: found?.endTime,
      },
    });
  }, [state.singleDate, state.exceptionType, normalizedExceptions]);

  return (
    <div className="p-4 m-4">
      <>
        <div className="flex justify-start items-center gap-2 my-4">
          <Calendar className="w-5 h-5 text-indigo-600" />
          <h3> روزهای تعطیل / استثنا</h3>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="staff" className="mb-2">
                ارائه‌دهندگان
                <span className="text-red-500">*</span>
              </Label>
              {staffListLoading || staffListFetching ? (
                <div className="flex justify-center items-center border p-1 rounded-md">
                  <Loader2 className="animate-spin" />
                </div>
              ) : (
                <Combobox
                  options={staffList}
                  id="staff"
                  label="ارائه‌دهندگان این خدمت"
                  onChange={(value) => {
                    setStaffId(value);
                  }}
                />
              )}
            </div>
            <div>
              <Label htmlFor="staff" className="mb-2">
                نوع تغییر
                <span className="text-red-500">*</span>
              </Label>

              <Combobox
                value={state.exceptionType}
                options={EXCEPTIONS_TYPE_OPTIONS}
                label="نوع تغییر"
                onChange={exceptionTypeChangeHandler}
              />
            </div>
          </div>
          <Separator />

          {!!staffId && !!state.mode && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {state.mode === "single" && (
                <ExceptionCalendar
                  mode="single"
                  value={state.singleDate ?? getCurrentDate()}
                  exceptions={normalizedExceptions}
                  onChange={(d) => {
                    if (typeof d !== "string") return;
                    dispatch({ type: "SET_SINGLE_DATE", payload: d });
                  }}
                />
              )}

              {state.mode === "multiple" && (
                <ExceptionCalendar
                  mode="multiple"
                  value={state.multipleDates}
                  exceptions={normalizedExceptions}
                  onChange={(d) => {
                    if (!Array.isArray(d)) return;
                    dispatch({ type: "SET_MULTIPLE_DATES", payload: d });
                  }}
                />
              )}

              {state.mode === "range" && (
                <ExceptionCalendar
                  mode="range"
                  value={state.range || { end: null, start: "" }}
                  exceptions={normalizedExceptions}
                  onChange={(r) => {
                    if (Array.isArray(r) || typeof r === "string") return;
                    if (!r?.start) return;
                    dispatch({ type: "SET_RANGE", payload: r });
                  }}
                />
              )}

              <Card className="bg-indigo-50/30 border-indigo-100">
                <CardHeader>
                  <CardTitle className="text-base">اطلاعات استثنا</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="p-3 bg-white rounded-lg border text-sm">
                    {renderSelectedDates()}
                  </div>

                  {isCloseType(state.exceptionType) && (
                    <>
                      <SwitchComponent
                        text="تعطیل"
                        name="isClose"
                        checked={state.isClosed}
                        onChange={(v) =>
                          dispatch({
                            type: "TOGGLE_CLOSED",
                            payload: v,
                          })
                        }
                      />

                      {state.isClosed && (
                        <div>
                          <Label className="text-xs">
                            دلیل تعطیلی (اختیاری)
                          </Label>
                          <Textarea
                            name="reason"
                            value={state.reason}
                            onChange={(e) =>
                              dispatch({
                                type: "SET_REASON",
                                payload: e.target.value,
                              })
                            }
                          />
                        </div>
                      )}
                    </>
                  )}

                  {isChangeType(state.exceptionType) && (
                    <div className="grid grid-cols-2 gap-3">
                      <TimePicker
                        name="startTime"
                        className="input"
                        value={state?.time?.startTime || ""}
                        onChange={(time) => {
                          dispatch({
                            type: "SET_TIME",
                            payload: {
                              startTime: time,
                              endTime: state.time.endTime,
                            },
                          });
                        }}
                      />
                      <TimePicker
                        name="endTime"
                        className="input"
                        value={state?.time?.endTime || ""}
                        onChange={(time) => {
                          dispatch({
                            type: "SET_TIME",
                            payload: {
                              startTime: state.time.startTime,
                              endTime: time,
                            },
                          });
                        }}
                      />
                    </div>
                  )}

                  <Button
                    disabled={isPending}
                    className="w-full gap-2"
                    variant={
                      isCloseType(state.exceptionType)
                        ? "destructive"
                        : "default"
                    }
                    onClick={submitHandler}
                  >
                    {isPending ? "در حال ذخیره..." : "ثبت تغییر"}
                    <Save size={16} />
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </>
    </div>
  );
};

export default BusinessDashboardExceptions;
