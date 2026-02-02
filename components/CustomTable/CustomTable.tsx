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

  data?: T;
  fetch?: () => void;
}
const CustomTable = ({ columns, data }: ICustomTable) => {
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
          {data?.resultList?.map((item: any) => (
            <TableRow key={item?.id}>
              {columns.map((col, index) => (
                <TableCell
                  key={`${col.field}-${index}`}
                  className="text-center whitespace-nowrap"
                >
                  {col.render
                    ? col.render(item[col.field], item, { index })
                    : item[col.field]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomTable;
