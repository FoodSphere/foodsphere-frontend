"use client";

import { useEffect, useState } from "react";

import { Icons } from "@/app/icons";
import { createTable } from "@/services/table/tableApi";

interface TableAddDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const TableAddDrawer = ({
  isOpen,
  onClose,
  onSuccess,
}: TableAddDrawerProps) => {
  const [tableName, setTableName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTableName("");
      setError("");
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (!tableName.trim()) {
      setError("Table name is required.");
      return;
    }

    try {
      setIsSaving(true);
      setError("");
      await createTable(tableName);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError("Failed to create table. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      <div className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-6 border-b-2">
          <h2 className="text-2xl font-bold">Add New Table</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-100 rounded-full"
          >
            <Icons name="CloseIcon" className="w-6 h-6 text-red-500" />
          </button>
        </div>

        <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Table Name
            </label>
            <input
              type="text"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              placeholder="e.g. 01, A1, VIP"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-orange-main focus:border-transparent transition-all"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="mt-auto pt-6 flex flex-col gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving || !tableName.trim()}
              className="w-full bg-primary-orange-main hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold py-3 rounded-xl shadow-md transition-all"
            >
              {isSaving ? "Saving..." : "Create Table"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-white border border-primary-orange-main text-primary-orange-main hover:bg-orange-50 font-bold py-3 rounded-xl transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
