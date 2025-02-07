import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TableColumn<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface TableAction<T> {
  label: string;
  onClick: (item: T) => void;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  disabled?: boolean;
  show?: (item: T) => boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  isLoading?: boolean;
  error?: string;
  noDataMessage?: string;
  selectable?: boolean;
  selectedItems?: string[];
  onSelectItem?: (id: string) => void;
  onSelectAll?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  idAccessor?: keyof T;
  className?: string;
}

export default function DataTable<T extends { [key: string]: any }>({
  data,
  columns,
  actions,
  isLoading = false,
  error,
  noDataMessage = "No data available",
  selectable = false,
  selectedItems = [],
  onSelectItem,
  onSelectAll,
  idAccessor = "_id",
  className,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full p-8 text-center text-gray-500">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8 text-center text-red-500">Error: {error}</div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full p-8 text-center text-gray-500">
        {noDataMessage}
      </div>
    );
  }

  const renderCell = (item: T, column: TableColumn<T>) => {
    if (typeof column.accessor === "function") {
      return column.accessor(item);
    }
    return item[column.accessor] ?? "N/A";
  };

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full bg-white border rounded-md shadow">
        <thead className="bg-gray-100">
          <tr>
            {selectable && (
              <th className="p-3 border">
                <input
                  type="checkbox"
                  onChange={onSelectAll}
                  checked={selectedItems.length === data.length}
                  className="w-4 h-4"
                />
              </th>
            )}
            {columns.map((column, index) => (
              <th
                key={index}
                className={cn(
                  "text-left p-3 border font-medium",
                  column.className
                )}
              >
                {column.header}
              </th>
            ))}
            {actions && actions.length > 0 && (
              <th className="text-left p-3 border font-medium">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr key={item[idAccessor] || rowIndex} className="hover:bg-gray-50">
              {selectable && (
                <td className="p-3 border text-center">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item[idAccessor])}
                    onChange={() => onSelectItem?.(item[idAccessor])}
                    className="w-4 h-4"
                  />
                </td>
              )}
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className={cn("p-3 border", column.className)}
                >
                  {renderCell(item, column)}
                </td>
              ))}
              {actions && actions.length > 0 && (
                <td className="p-3 border">
                  <div className="flex gap-1">
                    {actions.map(
                      (action, actionIndex) =>
                        (!action.show || action.show(item)) && (
                          <Button
                            key={actionIndex}
                            onClick={() => action.onClick(item)}
                            disabled={action.disabled}
                            variant={action.variant || "default"}
                            size="sm"
                          >
                            {action.label}
                          </Button>
                        )
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
