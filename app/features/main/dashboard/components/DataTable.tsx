// DataTable.tsx
import React from 'react';

// นิยามโครงสร้างของ "Column Definition"
export interface ColumnDef<T> {
  header: string;
  accessor: keyof T; // บังคับให้ accessor ต้องเป็น key ที่มีอยู่ใน T
  render?: (item: T) => React.ReactNode; // ฟังก์ชัน render (ถ้ามี)
}

// นิยาม Props ของ DataTable Component
export interface DataTableProps<T> {
  title: string;
  viewAllUrl: string;
  columns: ColumnDef<T>[];
  data: T[];
}

// ใช้ Generic <T extends object> เพื่อบอกว่า T ต้องเป็น object เท่านั้น
function DataTable<T extends object>({ title, viewAllUrl, columns, data }: DataTableProps<T>) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <a href={viewAllUrl} className="text-sm font-medium text-blue-600 hover:underline">
          View all
        </a>
      </div>

      {/* Table Content */}
      <div className="w-full">
        {/* Table Header */}
        <div className="grid grid-cols-4 gap-4 pb-2 border-b border-gray-200 text-left text-sm font-semibold text-gray-500" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`}}>
          {columns.map((col) => (
            <div key={col.header}>{col.header}</div>
          ))}
        </div>

        {/* Table Body */}
        <div>
          {data.map((item, rowIndex) => (
            <div 
              key={rowIndex} 
              className="grid grid-cols-4 gap-4 py-3 text-sm text-gray-700 border-b border-gray-100 last:border-b-0"
              style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`}}
            >
              {columns.map((col) => (
                <div key={col.header} className="truncate">
                  {/* หัวใจหลัก: ถ้ามีฟังก์ชัน render ให้ใช้ render, ถ้าไม่มีให้แสดงข้อมูลปกติ */}
                  {col.render ? col.render(item) : String(item[col.accessor])}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DataTable;