export const outParser = (data: any) => {
  return {
    title: data?.title,
    duration: data?.duration,
    price: data?.price,
    isActive: data?.isActive,
    workingHours: data?.workingHours,
    calendarRules: data?.calendarRules,
  };
};

export const inParser = (data: any) => {
  if (!data) return null;
  return {
    ...data,
    selectedDate: data?.calendarRules?.map((item: any) => item?.startDate),
  };
};
