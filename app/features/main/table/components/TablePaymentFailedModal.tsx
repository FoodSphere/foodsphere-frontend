"use client";

import { Icons } from "@/app/icons";

interface TablePaymentFailedModalProps {
  isOpen: boolean;
  tableName: string;
  status: string;
  paymentMethod: string;
  error: string;
  onClose: () => void;
}

export const TablePaymentFailedModal = ({
  isOpen,
  tableName,
  status,
  paymentMethod,
  error,
  onClose,
}: TablePaymentFailedModalProps) => {
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
        {/* Success Icon */}
        <div className="mx-auto w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            {/* หากไม่มี CheckIcon ให้ใช้ SVG ด้านล่างแทนได้ครับ */}
            <Icons name="CloseIcon" className="w-8 h-8 text-red-600" />
          </div>
        </div>

        {/* Text Content */}
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
          Payment Failed!
        </h2>
        <p className="text-gray-500 font-medium mb-6">
          The transaction has been failed. Please try again.
        </p>

        <div className="bg-gray-50 rounded-xl p-4 mb-8 text-left">
          <div className="flex justify-between mb-2">
            <span className="text-gray-500 text-sm">Table</span>
            <span className="text-gray-900 text-sm font-bold uppercase">
              {tableName}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-500 text-sm">Status</span>
            <span className="text-red-600 text-sm font-bold uppercase">
              {status}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">Payment Method</span>
            <span className="text-gray-900 text-sm font-bold">
              {paymentMethod}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full bg-black hover:bg-black/80 text-white font-bold py-4 rounded-2xl shadow-lg shadow-black/30 transition-all active:scale-[0.98]"
        >
          Done
        </button>
      </div>
    </div>
  );
};
