"use client";
import React, { cloneElement, isValidElement, PropsWithChildren } from "react";
import { useList } from "../ListContainer/ListContainer";

type ListInjectedProps = {
  data: any;
  error: any;
  fetch: () => void;
  loading?: boolean;
};

const ListDataProvider = ({ children }: PropsWithChildren) => {
  const { data, error, fetch, loading } = useList();

  return (
    <>
      {React.Children.map(children, (child) => {
        if (!isValidElement(child)) return child;

        // ❗ Fragment رو دست‌نخورده برمی‌گردونیم
        if (child.type === React.Fragment) {
          return child;
        }

        return cloneElement(child as React.ReactElement<any>, {
          data,
          error,
          fetch,
          loading,
        });
      })}
    </>
  );
};

export default ListDataProvider;
