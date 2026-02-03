import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ITableColumns } from "@/types/Table";

interface ICustomTable<T = any> {
  columns: ITableColumns[];
  data?: {
    resultList?: T[];
  };
  fetch?: () => void;
}

const CustomTable = ({ columns, data }: ICustomTable) => {
  const hasData = !!data?.resultList?.length;

  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-fit">
        <TableHeader>
          <TableRow>
            {columns.map((item) => (
              <TableHead
                key={item.field}
                className="text-center whitespace-nowrap"
              >
                {item.title}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {hasData ? (
            data!.resultList!.map((item: any, rowIndex: number) => (
              <TableRow key={item?.id ?? rowIndex}>
                {columns.map((col, colIndex) => (
                  <TableCell
                    key={`${col.field}-${colIndex}`}
                    className="text-center whitespace-nowrap"
                  >
                    {col.render
                      ? col.render(item[col.field], item, { index: rowIndex })
                      : (item[col.field] ?? "—")}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center py-6 text-muted-foreground"
              >
                داده‌ای وجود ندارد
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomTable;
