"use client";

import { useEffect, useState } from "react";

import { Icons } from "@/app/icons";
import { deleteTable, updateTable } from "@/services/table/tableApi"; // นำเข้า updateTable

export interface TableData {
  id: string;
  name: string;
  hasCustomers: boolean;
  billId: string;
}

interface TableEditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  tables: TableData[];
}

export const TableEditDrawer = ({
  isOpen,
  onClose,
  onSuccess,
  tables,
}: TableEditDrawerProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);
  const [editName, setEditName] = useState(""); // State สำหรับชื่อโต๊ะใหม่
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setSearchQuery("");
    setSelectedTable(null);
    setEditName("");
    setError("");
    setIsDropdownOpen(false);
    setShowConfirmDelete(false);
  };

  const filteredTables = tables.filter((table) =>
    table.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectTable = (table: TableData) => {
    setSelectedTable(table);
    setSearchQuery(table.name);
    setEditName(table.name); // ตั้งค่าเริ่มต้นให้เท่ากับชื่อเดิม
    setIsDropdownOpen(false);
    setShowConfirmDelete(false);
    setError("");
  };

  // --- Logic สำหรับอัปเดตชื่อโต๊ะ ---
  const handleUpdate = async () => {
    if (!selectedTable || !editName.trim()) return;

    try {
      setIsUpdating(true);
      setError("");
      await updateTable(selectedTable.id, editName);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError("Failed to update table name. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  // --- Logic สำหรับลบโต๊ะ ---
  const handleDelete = async () => {
    if (!selectedTable) return;

    if (selectedTable.hasCustomers) {
      setError("Cannot remove table because it currently has customers.");
      setShowConfirmDelete(false);
      return;
    }

    try {
      setIsDeleting(true);
      setError("");
      await deleteTable(selectedTable.id);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError("Failed to delete table. Please try again.");
      setShowConfirmDelete(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      <div className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-6 border-b-2">
          <h2 className="text-2xl font-bold">Edit / Delete Table</h2>
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
              Select Table
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                  setSelectedTable(null);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                placeholder="Search table number..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-orange-main focus:border-transparent transition-all"
              />
            </div>

            {isDropdownOpen && filteredTables.length > 0 && (
              <ul className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white rounded-lg shadow-lg z-10 border border-gray-100">
                {filteredTables.map((table) => (
                  <li
                    key={table.id}
                    onClick={() => handleSelectTable(table)}
                    className="px-4 py-3 hover:bg-orange-50 cursor-pointer flex justify-between items-center"
                  >
                    <span className="font-medium text-gray-700">
                      Table {table.name}
                    </span>
                    {table.hasCustomers && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-semibold">
                        In Use
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 2. Edit & Delete Section */}
          {selectedTable && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
              {/* Edit Section */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Table Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-orange-main focus:border-transparent transition-all"
                />
              </div>

              {/* Delete Section */}
              <div className="pt-4 border-t border-gray-200">
                {!showConfirmDelete ? (
                  <button
                    type="button"
                    onClick={() => setShowConfirmDelete(true)}
                    disabled={selectedTable.hasCustomers}
                    className={`flex items-center justify-center gap-2 font-semibold text-sm transition-colors py-3 rounded-xl border w-full ${
                      selectedTable.hasCustomers
                        ? "text-gray-400 border-gray-200 bg-gray-50 cursor-not-allowed"
                        : "text-red-500 border-red-200 hover:bg-red-50 hover:text-red-700"
                    }`}
                  >
                    <Icons name="TrashIcon" className="w-4 h-4" />
                    Delete Table {selectedTable.name}
                  </button>
                ) : (
                  <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                    <p className="text-sm text-red-800 mb-4 font-medium">
                      Are you sure you want to delete Table {selectedTable.name}
                      ? This cannot be undone.
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex-1 bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-red-700 disabled:bg-gray-400"
                      >
                        {isDeleting ? "Deleting..." : "Yes, Delete"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowConfirmDelete(false)}
                        className="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="mt-auto pt-6 flex flex-col gap-3">
            <button
              onClick={handleUpdate}
              disabled={
                isUpdating ||
                !selectedTable ||
                !editName.trim() ||
                editName === selectedTable.name
              }
              className="w-full bg-primary-orange-main hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold py-3 rounded-xl shadow-md transition-all"
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-white border border-primary-orange-main text-primary-orange-main hover:bg-orange-50 font-bold py-3 rounded-xl transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
