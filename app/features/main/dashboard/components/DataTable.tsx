import React from "react";

export interface ColumnDef<T> {
  header: string;
  accessor: keyof T;
  render?: (item: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  title: string;
  columns: ColumnDef<T>[];
  data: T[];
  headerAction?: React.ReactNode;
}

function DataTable<T extends object>({
  title,
  columns,
  data,
  headerAction,
}: DataTableProps<T>) {
  return (
    <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] w-full flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">
          {title}
        </h3>
        <div className="flex items-center gap-3">
          {/* แสดง Filter Dropdown (ถ้ามี) */}
          {headerAction}
        </div>
      </div>

      {/* Table Content */}
      <div className="w-full flex-1 overflow-x-auto">
        <div className="min-w-[500px]">
          <div
            className="grid gap-4 pb-3 border-b border-gray-200 text-left text-xs font-bold text-gray-400 uppercase tracking-wider"
            style={{
              gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
            }}
          >
            {columns.map((col) => (
              <div key={col.header}>{col.header}</div>
            ))}
          </div>

          <div className="mt-2">
            {data.length > 0 ? (
              data.map((item, rowIndex) => (
                <div
                  key={rowIndex}
                  className="grid gap-4 py-3.5 text-sm text-gray-700 border-b border-gray-50 hover:bg-gray-50/50 transition-colors rounded-xl px-2 -mx-2 items-center"
                  style={{
                    gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
                  }}
                >
                  {columns.map((col) => (
                    <div key={col.header} className="truncate font-medium">
                      {col.render
                        ? col.render(item)
                        : String(item[col.accessor])}
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-gray-400 text-sm font-medium">
                No data available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
