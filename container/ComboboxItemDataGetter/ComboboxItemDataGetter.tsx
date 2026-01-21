"use client";

import api from "@/lib/axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { cloneElement, PropsWithChildren } from "react";
import { IComboboxItemDataGetter } from "./meta/types";

const ComboboxItemDataGetter = ({
  children,
  url,
  queryKey,
  enabled,
  params,
}: PropsWithChildren<IComboboxItemDataGetter>) => {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    refetch,
  } = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const response = await api.get(url, {
        params: { ...params, page: pageParam },
      });
      return response.data;
    },
    enabled,
    getNextPageParam: (lastPage) =>
      lastPage?.page < lastPage?.totalPages ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
  });

  if (!React.isValidElement(children)) {
    // If children is not a valid React element, render it as-is (or null)
    return <>{children}</>;
  }

  return cloneElement(children as React.ReactElement<any>, {
    data: { resultList: data?.pages?.flatMap((i) => i?.resultList) },
    loading: isFetching || isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    refetch,
  });
};

export default ComboboxItemDataGetter;
