import {
  QueryFunction,
  QueryObserverResult,
  RefetchOptions,
  SkipToken,
} from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";

export interface IListContainer<TQueryFnData = any> {
  url?: string;
  params?: any;
  queryKey?: readonly unknown[];
  enabled?: boolean;
  queryFn?: QueryFunction<TQueryFnData> | SkipToken;
  data?: any;
}

export interface IListContainerContext<TData = any, TError = any> {
  data?: any;
  loading?: boolean;
  fetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<TData, TError>>;
  error?: any;
  url?: string;
  setSearchParams: Dispatch<SetStateAction<any>>;
}

export type SortDirection = "desc" | "asc";
