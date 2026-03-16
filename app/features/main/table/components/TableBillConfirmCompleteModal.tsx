"use client";

import { Icons } from "@/app/icons";

interface TableBillConfirmCompleteModalProps {
  isOpen: boolean; // Changed Boolean to boolean for convention
  onClose: () => void;
  onConfirm: () => void;
}

export const TableBillConfirmCompleteModal = ({
  isOpen,
  onClose,
  onConfirm,
}: TableBillConfirmCompleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-80 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-[400px] rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-center p-8">
        {/* Icon */}
        <div className="mx-auto w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
            <Icons name="CheckIcon" className="w-8 h-8 text-primary-orange-main" />
          </div>
        </div>

        {/* Text Content */}
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
          Complete Bill?
        </h2>
        <p className="text-gray-500 font-medium mb-8 text-sm">
          Are you sure you want to complete this bill? This action cannot be undone.
        </p>

        {/* Footer Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="w-full bg-primary-orange-main hover:bg-orange-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <Icons name="CheckIcon" className="w-6 h-6" />
            Complete Bill
          </button>

          <button
            onClick={onClose}
            className="w-full bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold py-4 rounded-2xl transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
