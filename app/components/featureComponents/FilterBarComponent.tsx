"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/libs/utils";

import { Button } from "../ui/button";

// รายการเมนูตัวอย่าง
const menuCategories = [
  "All menu",
  "Appetizer",
  "Main Dish",
  "Dessert",
  "Beverage",
  "Stir Fried",
  "Fried",
  "Grilled",
  "Soup",
  "Steam",
  "Seafood",
  "Other",
];

export function FilterBarComponent() {
  const [activeCategory, setActiveCategory] = React.useState("All menu");
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  // Function ตรวจสอบว่าสามารถ scroll ได้หรือไม่
  const checkScrollability = React.useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1); // -1 for precision
    }
  }, []);

  // Effect สำหรับตรวจสอบเมื่อ component โหลดและเมื่อขนาดหน้าจอเปลี่ยน
  React.useEffect(() => {
    const container = scrollContainerRef.current;
    checkScrollability();
    window.addEventListener("resize", checkScrollability);
    container?.addEventListener("scroll", checkScrollability);

    return () => {
      window.removeEventListener("resize", checkScrollability);
      container?.removeEventListener("scroll", checkScrollability);
    };
  }, [checkScrollability]);

  // Function จัดการการ scroll
  const handleScroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === "left" ? -200 : 200;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto px-4">
      <div className="bg-gray-100 p-2 rounded-full shadow-sm flex items-center space-x-2">
        {/* Left Scroll Button */}
        {canScrollLeft && (
          <Button
            className="rounded-full h-9 w-9 flex-shrink-0"
            onClick={() => handleScroll("left")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}

        {/* Scrollable Menu Items */}
        <div
          ref={scrollContainerRef}
          className="flex items-center space-x-2 overflow-x-auto scrollbar-hide"
        >
          {menuCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-200 ease-in-out",
                "focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50",
                activeCategory === category
                  ? "bg-orange-500 text-white shadow"
                  : "text-gray-600 hover:bg-gray-200"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Right Scroll Button */}
        {canScrollRight && (
          <Button
            className="rounded-full h-9 w-9 flex-shrink-0"
            onClick={() => handleScroll("right")}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
}
