"use client";

import { useState } from "react";

import { Icons } from "@/app/icons";
import { createMenuTag } from "@/services/menu/menuTagApi";

interface AddTagDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // callback เพื่อบอกให้หน้าหลักโหลดข้อมูลใหม่
}

export const MenuAddTagDrawer = ({
  isOpen,
  onClose,
  onSuccess,
}: AddTagDrawerProps) => {
  const [tagName, setTagName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagName.trim()) return;

    try {
      setIsLoading(true);
      setError("");

      await createMenuTag(tagName);

      setTagName(""); // Reset form
      onSuccess(); // Refresh categories in parent
      onClose(); // Close drawer
    } catch (err: any) {
      console.error("Failed to create tag:", err);
      setError("Failed to create tag. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay: คลิกด้านนอกเพื่อปิด */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2">
          <h2 className="text-2xl font-bold">Add Category</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-100 rounded-full transition-colors"
          >
            <Icons name="CloseIcon" className="w-6 h-6 text-red-500" />
          </button>
        </div>

        {/* Content */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 p-6 flex flex-col gap-6"
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="tagName"
              className="text-sm font-medium text-gray-700"
            >
              Category Name
            </label>
            <input
              id="tagName"
              type="text"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              placeholder="e.g. Seafood, Dairy"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-orange-main focus:border-transparent transition-all"
              autoFocus
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          {/* Footer Actions */}
          <div className="mt-auto flex flex-col gap-3">
            <button
              type="submit"
              disabled={isLoading || !tagName.trim()}
              className="w-full bg-primary-orange-main hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold py-3 rounded-xl transition-all shadow-md flex justify-center items-center"
            >
              {isLoading ? "Saving..." : "Create Category"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-white border border-primary-orange-main text-primary-orange-main hover:bg-orange-50 font-bold py-3 rounded-xl transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
