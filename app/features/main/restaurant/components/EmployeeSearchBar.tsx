"use client";

import React from "react";
import { Search } from "lucide-react";

interface EmployeeSearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const EmployeeSearchBar = ({
  searchTerm,
  onSearchChange,
}: EmployeeSearchBarProps) => {
  return (
    <div className="relative w-full md:w-[350px] lg:w-[400px]">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search employee name..."
        className="w-full pl-5 pr-12 py-3 bg-white border border-gray-300 rounded-xl text-base shadow-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all placeholder:text-gray-400"
      />
      <div className="absolute top-1/2 -translate-y-1/2 right-4 pointer-events-none">
        <Search className="w-6 h-6 text-gray-400" />
      </div>
    </div>
  );
};
