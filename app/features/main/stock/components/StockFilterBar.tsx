import { useRef } from "react";

import { Icons } from "@/app/icons";

interface StockFilterBarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const StockFilterBar = ({
  categories,
  selectedCategory,
  onSelectCategory,
}: StockFilterBarProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 200;
      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="w-full bg-gray-200 rounded-lg p-2 flex items-center gap-2">
      <button
        onClick={() => scroll("left")}
        className="p-2 hover:bg-gray-300 rounded-full transition-colors"
      >
        <Icons name="ArrowLeftIcon" className="w-4 h-4 text-gray-600" />
      </button>

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
                ? "bg-primary-orange-main text-white shadow-md"
                : "text-gray-600 hover:text-primary-orange-main hover:bg-white/50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <button
        onClick={() => scroll("right")}
        className="p-2 hover:bg-gray-300 rounded-full transition-colors"
      >
        <Icons name="ArrowRightIcon" className="w-4 h-4 text-gray-600" />
      </button>
    </div>
  );
};
