import PaginationWrapper from "@/components/Pagination/Pagination";
import { useRouter, useSearchParams } from "next/navigation";

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
  const searchParams = useSearchParams();

  const { replace } = useRouter();
  const onPageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.delete("page");
    params.append("page", String(page));

    replace(`/dashboard/business/customers?${params}`);
  };
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
