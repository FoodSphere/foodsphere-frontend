"use client";

import clsx from "clsx";

export type FilterStatus =
  | "All"
  | "Not Done"
  | "Cooking"
  | "Completed"
  | "Cancel";

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
    <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
      {/* Increased padding (p-2) and rounded-xl */}
      <div className="bg-gray-100 p-2 rounded-xl flex flex-row gap-2 w-max min-w-fit border border-gray-200">
        {filterButtons.map((button) => (
          <button
            key={button.value}
            onClick={() => onFilterChange(button.value)}
            className={clsx(
              // Increased padding (px-6 py-2.5) and font size (text-base)
              "px-6 py-2.5 rounded-lg text-base font-medium transition-all duration-200 whitespace-nowrap",
              {
                "bg-[#F26E4F] text-white shadow-md transform scale-105":
                  currentFilter === button.value,
                "bg-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-200/50":
                  currentFilter !== button.value,
              }
            )}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
};