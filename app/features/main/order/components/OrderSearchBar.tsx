"use client";

// import { Icons } from "@/app/icons"; // ลบ import นี้ออกเพื่อป้องกัน error

interface OrderSearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const OrderSearchBar = ({
  searchTerm,
  onSearchChange,
}: OrderSearchBarProps) => {
  return (
    <div className="relative w-full max-w-sm">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search a name, order or etc"
        className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange-main/50"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        {/* ใช้ SVG icon โดยตรงแทนการ import `Icons` 
          เพื่อหลีกเลี่ยง_ "Element type is invalid" error 
          ในกรณีที่ import "SearchIcon" ไม่สำเร็จ
        */}
        {/* <Icons
          name="SearchIcon"
          className="w-5 h-5 text-gray-400"
          onError={(e: any) => {
            // Fallback ในกรณีที่ Icon ไม่มี
            e.target.style.display = 'none';
            const svg = e.target.closest('div').querySelector('svg');
            if (svg) svg.style.display = 'block';
          }}
        /> */}
        {/* Fallback SVG เผื่อ Icons component ไม่มี "SearchIcon" */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 text-gray-400"
          // style={{ display: 'none' }} // ไม่ต้องซ่อนแล้ว
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </div>
    </div>
  );
};
