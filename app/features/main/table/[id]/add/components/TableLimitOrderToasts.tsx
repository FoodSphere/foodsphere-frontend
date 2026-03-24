"use client";

import { useEffect } from "react";

import { Icons } from "@/app/icons"; // หากไม่มีไอคอนสามารถลบออกได้ครับ

interface TableLimitOrderToastsProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export function TableLimitOrderToasts({
  message,
  onClose,
  duration = 4000,
}: TableLimitOrderToastsProps) {
  // ให้ TableLimitOrderToasts ปิดตัวเองอัตโนมัติตามเวลาที่กำหนด
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed top-6 right-6 z-50 animate-fade-in-down flex items-center w-full max-w-sm p-4 space-x-3 text-gray-700 bg-white rounded-xl shadow-lg border-l-4 border-red-500">
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg">
        {/* ใช้ Icon หรือ SVG ธรรมดา */}
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
        </svg>
      </div>
      <div className="ml-3 text-sm font-medium text-gray-800 break-words flex-1">
        {message}
      </div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-red-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-red-100 inline-flex items-center justify-center h-8 w-8 transition-colors"
        onClick={onClose}
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <Icons name="CloseIcon" className="w-3 h-3" />
      </button>
    </div>
  );
}
