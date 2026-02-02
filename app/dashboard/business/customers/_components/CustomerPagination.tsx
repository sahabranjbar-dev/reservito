import PaginationWrapper from "@/components/Pagination/Pagination";
import React from "react";

interface Props {
  currentPage: number;
  totalPages?: number;
  totalCount?: number;
  loading: boolean;
}

const CustomerPagination = ({
  currentPage,
  totalPages,
  totalCount,
  loading,
}: Props) => {
  const onPageChange = () => {};
  return (
    <PaginationWrapper
      currentPage={currentPage}
      loading={loading}
      onPageChange={onPageChange}
      totalCount={totalCount}
      totalPages={totalPages}
    />
  );
};

export default CustomerPagination;
