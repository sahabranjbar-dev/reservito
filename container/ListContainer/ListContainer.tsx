"use client";

import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren, useContext, useState } from "react";
import { ListContainerContext } from "./context/ListContainerContext";
import { IListContainer } from "./meta/types";
import { useSearchParams } from "next/navigation";

const ListContainer = ({
  children,
  url,
  params = {},
  queryKey,
  enabled = true,
}: PropsWithChildren<IListContainer>) => {
  const searchParamsFromURL = useSearchParams();
  const page = searchParamsFromURL.get("page") ?? "1";
  const pageSize = searchParamsFromURL.get("pageSize") ?? "10";

  const [searchParams, setSearchParams] = useState<Record<string, string>>({
    page,
    pageSize,
  });

  const resolvedParams = { ...params, ...searchParams };

  const { data, error, refetch, isFetching, isLoading } = useQuery({
    queryKey: [...queryKey, resolvedParams],
    queryFn: async () => {
      const response = await api.get(url, { params: resolvedParams });
      return response.data;
    },
    enabled,
  });

  return (
    <ListContainerContext.Provider
      value={{
        data,
        error,
        loading: isFetching || isLoading,
        fetch: refetch,
        url,
        setSearchParams,
      }}
    >
      <main className="bg-white p-2 rounded-lg">{children}</main>
    </ListContainerContext.Provider>
  );
};

export const useList = () => {
  const context = useContext(ListContainerContext);
  if (!context) throw new Error("useList must be used within ListContainer");
  return context;
};

export default ListContainer;
