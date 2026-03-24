"use client";

import { Icons } from "@/app/icons";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  isLoading?: boolean;
}

export const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  isLoading = false,
}: ConfirmDeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop: ตั้ง z-index ให้สูงกว่า Drawer (Drawer ปกติ z-50 เราเลยใช้ z-[100] เผื่อไว้) */}
      <div
        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-opacity flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal Box */}
        <div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()} // ป้องกันการกดข้างในแล้ว modal ปิด
        >
          <div className="p-6 flex flex-col items-center text-center">
            {/* Icon Warning */}
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-sm">
              <Icons name="TrashIcon" className="w-8 h-8 text-red-500" />
            </div>

            {/* Text Content */}
            <h3 className="text-xl font-extrabold text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              {message}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-3 w-full">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-100 text-gray-600 font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className="flex-1 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg shadow-red-500/30 transition-all disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
