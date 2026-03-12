"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  placeholder: string;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const SearchBar = ({
  placeholder,
  searchTerm,
  onSearchChange,
}: SearchBarProps) => {
  return (
    <div className="relative w-full">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 h-12 bg-white rounded-xl border-none text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF5C39] transition-all placeholder:text-gray-400"
      />
      <div className="absolute top-1/2 -translate-y-1/2 left-4 pointer-events-none">
        <Search className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  );
};
