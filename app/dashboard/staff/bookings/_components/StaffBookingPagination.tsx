"use client";
import PaginationWrapper from "@/components/Pagination/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

interface Props {
  currentPage: number;
  totalPages?: number;
  totalCount?: number;
}

const StaffBookingPagination = ({
  currentPage,
  totalCount,
  totalPages,
}: Props) => {
  const searchParams = useSearchParams();

  const { replace } = useRouter();

  const onPageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.delete("page");
    params.append("page", String(page));

    replace(`/dashboard/staff/bookings?${params}`);
  };
  return (
    <PaginationWrapper
      currentPage={currentPage}
      loading={false}
      onPageChange={onPageChange}
      totalCount={totalCount}
      totalPages={totalPages}
    />
  );
};

export default StaffBookingPagination;
