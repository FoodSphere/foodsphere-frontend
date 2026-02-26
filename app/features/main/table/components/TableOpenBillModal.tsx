"use client";

import { useState } from "react";

import { Icons } from "@/app/icons";

interface TableOpenBillModalProps {
  isOpen: boolean;
  tableId: string;
  tableName: string;
  onClose: () => void;
  onConfirm: (tableId: string, guests: number) => void;
}

export const TableOpenBillModal = ({
  isOpen,
  tableId,
  tableName,
  onClose,
  onConfirm,
}: TableOpenBillModalProps) => {
  const [guestCount, setGuestCount] = useState(1);

  if (!isOpen) return null;

  const handleIncrement = () => setGuestCount((prev) => prev + 1);
  const handleDecrement = () =>
    setGuestCount((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/60 animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-110 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header Section */}
        <div className="bg-primary-orange-main p-8 text-center text-white">
          <div className="inline-flex p-3 bg-white/20 rounded-full mb-4">
            <Icons name="TableIcon" className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold mb-1">Open Bill</h2>
          <p className="text-orange-100 font-medium tracking-wide uppercase text-sm">
            Table {tableName}
          </p>
        </div>

        {/* Body Section */}
        <div className="p-8 flex flex-col items-center">
          <label className="text-gray-500 font-semibold mb-6 text-lg">
            How many guests?
          </label>

          <div className="flex items-center gap-10">
            <button
              onClick={handleDecrement}
              className="w-14 h-14 rounded-2xl border-2 border-gray-100 flex items-center justify-center hover:bg-gray-50 active:scale-90 transition-all text-gray-400 hover:text-primary-orange-main hover:border-primary-orange-main"
            >
              <Icons name="MinusIcon" className="w-6 h-6" />
            </button>

            <div className="flex flex-col items-center min-w-20">
              <span className="text-6xl font-black text-gray-800 tabular-nums">
                {guestCount}
              </span>
              <span className="text-gray-400 text-xs font-bold uppercase mt-1">
                Persons
              </span>
            </div>

            <button
              onClick={handleIncrement}
              className="w-14 h-14 rounded-2xl border-2 border-gray-100 flex items-center justify-center hover:bg-gray-50 active:scale-90 transition-all text-gray-400 hover:text-primary-orange-main hover:border-primary-orange-main"
            >
              <Icons name="PlusIcon" className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 pb-8 flex flex-col gap-3">
          <button
            onClick={() => onConfirm(tableId, guestCount)}
            className="w-full bg-primary-orange-main hover:bg-orange-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <Icons name="CheckIcon" className="w-6 h-6" />
            Confirm Open Bill
          </button>

          <button
            onClick={onClose}
            className="w-full bg-white text-primary-orange-main font-semibold hover:border hover:border-primary-orange-main hover:bg-orange-50 py-3 rounded-xl transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
