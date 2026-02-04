"use client";

import { ListHeader } from "@/components";
import ListContainer from "@/container/ListContainer/ListContainer";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { getBusinessStaff } from "../_meta/actions/businessActions";
import BusinessStaffList from "./BusinessStaffList";

interface Props {
  businessId: string;
}

const BusinessStaffs = ({ businessId }: Props) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["business-staffs", businessId],
    queryFn: async () => {
      if (!businessId) return;
      const result = await getBusinessStaff(businessId);
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    enabled: !!businessId,
  });

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground text-center p-4 flex justify-center items-center gap-2">
        <Loader2 className="animate-spin" />
        در حال دریافت اطلاعات...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-500 text-center p-4">
        خطا در دریافت همکاران
      </div>
    );
  }

  if (!data || data?.resultList.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        هنوز همکاری برای این کسب‌وکار ثبت نشده است.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">همکاران کسب‌وکار</h2>
      </div>

      <div className="border rounded-md">
        <ListContainer data={data}>
          <ListHeader
            hasRefresh
            onRefresh={() => {
              refetch();
            }}
          />

          <BusinessStaffList
            data={data}
            loading={isLoading}
            businessId={businessId}
          />
        </ListContainer>
      </div>
    </div>
  );
};

export default BusinessStaffs;
