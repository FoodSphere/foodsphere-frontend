"use client";

import { Icons } from "@/app/icons";

interface TablePaymentSuccessModalProps {
  isOpen: boolean;
  tableName: string;
  status: string;
  amountTotal: number;
  paymentMethod: string;
  onClose: () => void;
}

export const TablePaymentSuccessModal = ({
  isOpen,
  tableName,
  status,
  amountTotal,
  paymentMethod,
  onClose,
}: TablePaymentSuccessModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-[400px] rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-center p-8">
        {/* Success Icon */}
        <div className="mx-auto w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            {/* หากไม่มี CheckIcon ให้ใช้ SVG ด้านล่างแทนได้ครับ */}
            <Icons name="CheckIcon" className="w-8 h-8 text-green-600" />
          </div>
        </div>

        {/* Text Content */}
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
          Payment Success!
        </h2>
        <p className="text-gray-500 font-medium mb-6">
          The transaction has been completed successfully. The table is now
          available.
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
            <span className="text-green-600 text-sm font-bold uppercase">
              {status}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-500 text-sm">Amount Paid</span>
            <span className="text-gray-900 text-sm font-bold">
              ฿{amountTotal.toFixed(2)}
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
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-600/30 transition-all active:scale-[0.98]"
        >
          Done
        </button>
      </div>
    </div>
  );
};
