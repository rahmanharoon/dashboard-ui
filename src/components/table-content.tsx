import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { tableHeaders } from "@/lib/constants";
import { aedHeaderKeys, formatAed } from "@/lib/utils";
import TablePagination from "./table-pagination";
import { Badge } from "./ui/badge";

interface ITableData {
  data: Record<string, string | number>[];
  goNext: (totalItems: number) => void;
  goPrev: (totalItems: number) => void;
  pageNo: number;
  size: number;
  goTo: (page: number, totalItems: number) => void;
  totalItems: number;
  onChangeSize: (size: number) => void;
}

const statusColor: Record<
  string,
  | "success"
  | "secondary"
  | "destructive"
  | "pending"
  | "link"
  | "default"
  | "outline"
  | "ghost"
> = {
  Completed: "success",
  Approved: "success",
  Low: "secondary",
  "In Progress": "pending",
  Planned: "secondary",
  Medium: "pending",
  High: "destructive",
  Rejected: "destructive",
  "On Hold": "pending",
  Pending: "pending",
};

const TableUI = (props: ITableData) => {
  const { data, ...rest } = props;
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-50 dark:bg-gray-800">
          {Object.values(tableHeaders).map((header) => (
            <TableHead className="text-center" key={header}>
              {header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row?.Record_ID}>
            {Object.keys(tableHeaders).map((headerKey) => {
              const headerLower = headerKey.toLocaleLowerCase();
              const value = row[headerKey];
              const isBadge =
                headerLower.includes("status") ||
                headerLower.includes("priority");
              const isDelta = headerLower.includes("delta");
              const isAedColumn = aedHeaderKeys.has(headerKey);
              const displayValue =
                isAedColumn && !isBadge ? formatAed(value) : value;
              const deltaNum =
                typeof value === "number"
                  ? value
                  : Number(String(value));
              return (
                <TableCell
                  key={`${row?.Record_ID} - ${value}`}
                  className={
                    isDelta
                      ? deltaNum < 0
                        ? "text-red-800"
                        : "text-green-700"
                      : ""
                  }
                >
                  {isBadge ? (
                    <Badge variant={statusColor[value]}>{value}</Badge>
                  ) : (
                    displayValue
                  )}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={Object.keys(tableHeaders).length}>
            <TablePagination {...rest} />
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default TableUI;
