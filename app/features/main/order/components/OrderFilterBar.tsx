"use client";

import clsx from "clsx";

// กำหนด Type สำหรับสถานะทั้งหมด + "All"
export type FilterStatus = "All" | "Not Done" | "Cooking" | "Completed" | "Cancel";

// รายการปุ่มที่จะแสดง
const filterButtons: { label: string; value: FilterStatus }[] = [
  { label: "All menu", value: "All" },
  { label: "Not Done", value: "Not Done" },
  { label: "Cooking", value: "Cooking" },
  { label: "Completed", value: "Completed" },
  { label: "Canceled", value: "Cancel" },
];

interface OrderFilterBarProps {
  currentFilter: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
}

export const OrderFilterBar = ({
  currentFilter,
  onFilterChange,
}: OrderFilterBarProps) => {
  return (
    <div className="flex flex-row gap-2">
      {filterButtons.map((button) => (
        <button
          key={button.value}
          onClick={() => onFilterChange(button.value)}
          className={clsx(
            "px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200",
            {
              "bg-primary-orange-main text-white shadow-md":
                currentFilter === button.value,
              "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50":
                currentFilter !== button.value,
            }
          )}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
};