import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getStatusClasses } from "@/lib/utils";
import React from "react";
import CustomPagination from "./custom-pagination";
import { AuthLoader } from "./loader";

interface Column<T> {
  header: string;
  accessor?: keyof T;
  render?: (value: any, row: any) => React.ReactNode;
  isStatus?: boolean;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  noDataMessage?: string;
  pagination?: {
    totalCount: number;
    filteredCount: number;
    totalPages: number;
    limit: number;
    page: number;
  };
}

export default function DataTable<T>({
  columns,
  data,
  isLoading = false,
  noDataMessage = "No data available.",
  pagination,
}: TableProps<T>) {
  if (isLoading) {
    return <AuthLoader isLoading={isLoading} />;
  }

  if (!data.length) {
    return <div className="p-4 text-center">{noDataMessage}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={index}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex} className="hover:bg-gray-50">
              {columns.map((column, colIndex) => {
                const value = row[column.accessor as keyof T];
                const statusClass = column.isStatus
                  ? getStatusClasses(value as string)
                  : "";

                return (
                  <TableCell
                    key={colIndex}
                    className={`p-2 text-start ${statusClass}`}
                  >
                    {column.render
                      ? column.render(value, row)
                      : value?.toString() ?? "N/A"}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Render pagination if pagination prop is provided */}
      {pagination && <CustomPagination pagination={pagination} />}
    </div>
  );
}
