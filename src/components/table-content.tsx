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
import { aedHeaderKeys, currencyFormatter } from "@/lib/utils";
import TablePagination from "./table-pagination";
import { Badge } from "./ui/badge";
import { DirhamSymbol } from "./dirham-symbol";

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
    <div className="flex flex-col rounded-md border border-border overflow-hidden">
      <div className="overflow-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800">
              {Object.values(tableHeaders).map((header) => (
                <TableHead className="text-center whitespace-nowrap" key={header}>
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
                    isAedColumn && !isBadge ? currencyFormatter(value) : value;
                  const deltaNum =
                    typeof value === "number"
                      ? value
                      : Number(String(value));
                  const deltaClass = isDelta
                    ? deltaNum < 0
                      ? "text-red-800"
                      : "text-green-700"
                    : "";
                  return (
                    <TableCell
                      key={`${row?.Record_ID} - ${value}`}
                      className={`whitespace-nowrap ${deltaClass}`}
                    >
                      {isBadge ? (
                        <Badge variant={statusColor[value]}>{value}</Badge>
                      ) : isAedColumn ? (
                        <>
                          <span className={`font-mono font-medium text-foreground tabular-nums ${deltaClass}`}>
                            <DirhamSymbol />
                          </span>
                          {displayValue}
                        </>
                      ) : (
                        displayValue
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TableFooter className="w-full flex flex-1 p-2">
        <TablePagination {...rest} />
      </TableFooter>
    </div>
  );
};

export default TableUI;