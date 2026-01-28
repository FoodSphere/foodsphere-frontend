"use client";

import { useRef } from "react";

import { Icons } from "@/app/icons";

interface MenuFilterBarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const MenuFilterBar = ({
  categories,
  selectedCategory,
  onSelectCategory,
}: MenuFilterBarProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // ฟังก์ชันเลื่อนสำหรับการกดปุ่ม Arrow
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 200; // ระยะการเลื่อนแต่ละครั้ง
      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="w-full bg-gray-200 rounded-lg p-2 flex items-center gap-2">
      {/* ปุ่มเลื่อนซ้าย */}
      <button
        onClick={() => scroll("left")}
        className="p-2 hover:bg-gray-300 rounded-full transition-colors shrink-0"
      >
        <Icons name="ArrowLeftIcon" className="w-4 h-4 text-gray-600" />
      </button>

      {/* รายการหมวดหมู่ */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto no-scrollbar flex-1 items-center scroll-smooth"
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`whitespace-nowrap px-6 py-2 rounded-md text-sm font-medium transition-all ${
              selectedCategory === cat
                ? "bg-[#FF5C39] text-white shadow-md" // ใช้สีส้มหลัก
                : "text-gray-600 hover:text-[#FF5C39] hover:bg-white/50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ปุ่มเลื่อนขวา */}
      <button
        onClick={() => scroll("right")}
        className="p-2 hover:bg-gray-300 rounded-full transition-colors shrink-0"
      >
        <Icons name="ArrowRightIcon" className="w-4 h-4 text-gray-600" />
      </button>
    </div>
  );
};
