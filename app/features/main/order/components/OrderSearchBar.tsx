"use client";

interface OrderSearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const OrderSearchBar = ({
  searchTerm,
  onSearchChange,
}: OrderSearchBarProps) => {
  return (
    // Increased width to 350px on desktop
    <div className="relative w-full md:w-[350px] lg:w-[400px]">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search a name, order or etc"
        // Increased padding (py-3) and font size (text-base)
        className="w-full pl-5 pr-12 py-3 bg-white border border-gray-300 rounded-xl text-base shadow-sm focus:outline-none focus:border-[#F26E4F] focus:ring-2 focus:ring-[#F26E4F]/20 transition-all placeholder:text-gray-400"
      />
      {/* Centered Icon */}
      <div className="absolute top-1/2 -translate-y-1/2 right-4 pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6 text-gray-400"
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