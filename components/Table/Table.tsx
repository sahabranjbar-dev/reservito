"use client";

import clsx from "clsx";
import {
  AlertTriangle,
  ArrowDownNarrowWide,
  ArrowDownWideNarrow,
} from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";
import { ITable, ITableColumns } from "@/types/Table";
import { useList } from "../../container/ListContainer/ListContainer";
import { MultiselectDialogContext } from "../MultiselectDialogField/MultiselectDialogField";
import PaginationWrapper from "../Pagination/Pagination";
import { Skeleton } from "../ui/skeleton";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/* ---------------------------------- */
/* Media Query Hook                   */
/* ---------------------------------- */

/* ---------------------------------- */
/* Table Component                    */
/* ---------------------------------- */
function Table({
  className,
  columns,
}: ITable & Omit<React.ComponentProps<"table">, "loading">) {
  const isMobile = useMediaQuery();

  const [sort, setSort] = React.useState<{
    sortField?: string;
    sortDirection?: "asc" | "desc";
  }>({});

  const { data, loading, error, setSearchParams } = useList();
  const listData = data?.resultList;

  const handleSort = (field: string) => {
    if (field === "rowNumber" || field === "id") return;

    setSort((prev) => ({
      sortField: field,
      sortDirection: prev.sortDirection === "asc" ? "desc" : "asc",
    }));
  };

  const { onChange, setSelectItem, selectItem, multiselectLov } =
    React.useContext(MultiselectDialogContext);

  const tableRowOnClickHandler = (item: any) => {
    setSelectItem((prev) => {
      let newArr = [];

      if (prev.some((i) => i.id === item.id)) {
        // remove
        newArr = prev.filter((i) => i.id !== item.id);
      } else {
        // add
        newArr = [...prev, item];
      }

      return newArr; // فقط state آپدیت کن
    });
  };

  React.useEffect(() => {
    onChange?.(selectItem);
  }, [selectItem]);

  const renderCellContent = (
    column: ITableColumns,
    item: any,
    rowIndex: number
  ) => {
    const value = item?.[column.field];

    if (typeof column.render === "function") {
      try {
        return column.render(value, item, { index: rowIndex });
      } catch (e) {
        console.error("render error:", column.field, e);
        return "خطا";
      }
    }

    if (column?.hasDateFormatter && value) {
      try {
        return new Date(value).toLocaleDateString("fa");
      } catch {
        return "تاریخ نامعتبر";
      }
    }

    return value ?? "---";
  };

  /* ---------------------------------- */
  /* Mobile View (Card)                 */
  /* ---------------------------------- */
  if (isMobile) {
    return (
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="border rounded-lg p-4 space-y-3 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          ))
        ) : error ? (
          <div className="flex flex-col items-center gap-2 text-red-600 py-6">
            <AlertTriangle className="w-8 h-8" />
            <p>خطا در دریافت اطلاعات</p>
          </div>
        ) : listData?.length ? (
          listData.map((item: any, rowIndex: number) => (
            <div
              key={rowIndex}
              className="border rounded-lg p-4 space-y-3 shadow-sm"
            >
              {columns.map((column) => (
                <div
                  key={column.field}
                  className="flex justify-between gap-4 text-sm"
                >
                  <span className="text-gray-500 font-medium">
                    {column.title}
                  </span>
                  <span className="text-gray-900 max-w-xs truncate">
                    {renderCellContent(column, item, rowIndex)}
                  </span>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            هیچ داده‌ای برای نمایش وجود ندارد
          </p>
        )}

        {!error && (
          <PaginationWrapper
            loading={loading ?? true}
            currentPage={data?.page}
            totalCount={data?.totalItems}
            totalPages={data?.totalPages}
            onPageChange={(page) => setSearchParams?.({ page: String(page) })}
          />
        )}
      </div>
    );
  }

  /* ---------------------------------- */
  /* Desktop Table View                 */
  /* ---------------------------------- */
  return (
    <div className="relative w-full border rounded-md shadow-sm">
      <div className="overflow-x-auto">
        <table
          className={cn(
            "min-w-[900px] w-full text-sm caption-bottom  overflow-x-scroll",
            className
          )}
        >
          <TableHeader>
            <TableRow className="bg-muted/30">
              {columns.map(
                ({ field, title, sortable = true, width }, index) => (
                  <TableHead
                    key={index}
                    style={{
                      width: width || "auto",
                      minWidth: width || "100px",
                    }}
                    onClick={() => sortable && handleSort(field)}
                    className={clsx(
                      "text-center whitespace-nowrap",
                      sortable && "cursor-pointer"
                    )}
                  >
                    <div className="inline-flex items-center gap-2">
                      {title}
                      {sortable && sort.sortField === field && (
                        <>
                          {sort.sortDirection === "asc" ? (
                            <ArrowDownNarrowWide size={16} />
                          ) : (
                            <ArrowDownWideNarrow size={16} />
                          )}
                        </>
                      )}
                    </div>
                  </TableHead>
                )
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((col, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-5 w-full bg-gray-300/50 rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : error ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="py-6">
                  <div className="flex flex-col items-center gap-2 text-red-600">
                    <AlertTriangle className="w-8 h-8" />
                    <p>مشکلی رخ داده است</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : listData?.length ? (
              listData.map((item: any, index: number) => (
                <TableRow
                  onClick={() => tableRowOnClickHandler(item)}
                  className={clsx(
                    {
                      "cursor-pointer": multiselectLov,
                    },
                    selectItem.some((i) => i.id === item.id) &&
                      "bg-secondary hover:bg-secondary"
                  )}
                  key={index}
                >
                  {columns.map((column, index) => (
                    <TableCell
                      key={index}
                      className="text-center max-w-xs overflow-scroll"
                    >
                      {renderCellContent(column, item, index)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="py-6 text-center"
                >
                  داده‌ای وجود ندارد
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </table>
      </div>

      {!error && (
        <div className="border-t p-4">
          <PaginationWrapper
            loading={loading ?? true}
            currentPage={data?.page}
            totalCount={data?.totalItems}
            totalPages={data?.totalPages}
            onPageChange={(page) => setSearchParams?.({ page: String(page) })}
          />
        </div>
      )}
    </div>
  );
}

/* ---------------------------------- */
/* UI Primitives (بدون تغییر منطقی)   */
/* ---------------------------------- */
function TableHeader(props: React.ComponentProps<"thead">) {
  return <thead {...props} />;
}

function TableBody(props: React.ComponentProps<"tbody">) {
  return <tbody {...props} />;
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      className={cn("border-b hover:bg-muted/50 transition-colors", className)}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      className={cn(
        "h-10 px-2 font-medium text-foreground text-left",
        className
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      className={cn("p-2 align-middle whitespace-nowrap", className)}
      {...props}
    />
  );
}

export { Table, TableBody, TableCell, TableHead, TableHeader, TableRow };
