import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useList } from "@/container/ListContainer/ListContainer";
import { ITableColumns } from "@/types/Table";

interface ICustomTable<T = any> {
  columns: ITableColumns[];
  data?: {
    resultList?: T[];
  };
  fetch?: () => void;
  RowForm?: any;
}
const CustomTable = ({ columns, data, RowForm }: ICustomTable) => {
  const hasData = !!data?.resultList?.length;
  const { editingRowId, isCreating } = useList();

  return (
    <div className="w-full overflow-x-auto">
      <Table className="w-full border rounded-lg overflow-hidden">
        <TableHeader>
          <TableRow>
            {columns.map((item, index) => (
              <TableHead
                key={`${item.field}-${index}`}
                className="text-center whitespace-nowrap bg-muted"
              >
                {item.title}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {isCreating && <RowForm data={data} />}
          {hasData ? (
            data!.resultList!.map((item: any, rowIndex: number) =>
              editingRowId === item.id ? (
                <RowForm key={item.id} data={item} />
              ) : (
                <TableRow key={item.id}>
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
              ),
            )
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
