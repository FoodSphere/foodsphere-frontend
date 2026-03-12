"use client";

import { useEffect, useState } from "react";

import { Icons } from "@/app/icons";
import {
  deleteStockTag,
  getStockTags,
  updateStockTag,
} from "@/services/stock/stockTagApi";
import { IStockTag } from "@/types/stockType";

interface StockEditTagDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const StockEditTagDrawer = ({
  isOpen,
  onClose,
  onSuccess,
}: StockEditTagDrawerProps) => {
  const [tags, setTags] = useState<IStockTag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<IStockTag | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [editName, setEditName] = useState("");
  const [error, setError] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchTags();
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setSearchQuery("");
    setSelectedTag(null);
    setEditName("");
    setError("");
    setIsDropdownOpen(false);
    setShowConfirmDelete(false);
  };

  const fetchTags = async () => {
    try {
      setIsLoading(true);
      const data = await getStockTags();
      if (Array.isArray(data)) {
        setTags(data);
      }
    } catch (err) {
      console.error("Error fetching tags:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectTag = (tag: IStockTag) => {
    setSelectedTag(tag);
    setSearchQuery(tag.name);
    setEditName(tag.name);
    setIsDropdownOpen(false);
    setShowConfirmDelete(false);
  };

  // --- Logic สำหรับแก้ไข ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTag || !editName.trim()) return;

    try {
      setIsSaving(true);
      setError("");
      await updateStockTag(String(selectedTag.id), editName);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError("Failed to update tag.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- Logic สำหรับลบ ---
  const handleDelete = async () => {
    if (!selectedTag) return;

    try {
      setIsDeleting(true);
      setError("");
      await deleteStockTag(String(selectedTag.id));
      onSuccess();
      onClose();
    } catch (err: any) {
      setError("Failed to delete tag. It might be in use.");
      setShowConfirmDelete(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      <div className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-6 border-b-2">
          <h2 className="text-2xl font-bold">Edit Category</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-100 rounded-full"
          >
            <Icons name="CloseIcon" className="w-6 h-6 text-red-500" />
          </button>
        </div>

        <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">
          {/* 1. Searchable Dropdown */}
          <div className="flex flex-col gap-2 relative">
            <label className="text-sm font-medium text-gray-700">
              Select Category
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                  setSelectedTag(null);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                placeholder="Search category..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-orange-main focus:border-transparent transition-all"
              />
            </div>

            {isDropdownOpen && filteredTags.length > 0 && (
              <ul className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white rounded-lg shadow-lg z-10">
                {filteredTags.map((tag) => (
                  <li
                    key={tag.id}
                    onClick={() => handleSelectTag(tag)}
                    className="px-4 py-3 hover:bg-orange-50 cursor-pointer"
                  >
                    {tag.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 2. Edit Section */}
          {selectedTag && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  New Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-orange-main focus:border-transparent transition-all"
                />
              </div>

              {/* Delete Button Area */}
              <div className="pt-4 border-t-2">
                {!showConfirmDelete ? (
                  <button
                    type="button"
                    onClick={() => setShowConfirmDelete(true)}
                    className="flex items-center gap-2 text-red-500 hover:text-red-700 font-semibold text-sm transition-colors"
                  >
                    <Icons name="TrashIcon" className="w-4 h-4" />
                    Delete this category
                  </button>
                ) : (
                  <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                    <p className="text-sm text-red-800 mb-3 font-medium">
                      Are you sure? This cannot be undone.
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-red-700 disabled:bg-gray-400"
                      >
                        {isDeleting ? "Deleting..." : "Yes, Delete"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowConfirmDelete(false)}
                        className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-bold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <div className="mt-auto pt-6 flex flex-col gap-3">
            <button
              onClick={handleSubmit}
              disabled={isSaving || !selectedTag || !editName.trim()}
              className="w-full bg-primary-orange-main hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold py-3 rounded-xl shadow-md transition-all"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-white border border-primary-orange-main text-primary-orange-main hover:bg-orange-50 font-bold py-3 rounded-xl"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
