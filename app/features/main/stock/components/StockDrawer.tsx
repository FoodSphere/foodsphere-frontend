"use client";
import { useEffect, useRef, useState } from "react";

import { ConfirmDeleteModal } from "@/app/components/featureComponents/ConfirmDeleteModal";
import { Badge } from "@/app/components/ui/badge";
import { Icons } from "@/app/icons";
import { getStockTags } from "@/services/stock/stockTagApi";

// --- Type Definitions ---
interface TagOption {
  id: number;
  name: string;
}

// ปรับให้ตรงกับโครงสร้างที่เราแก้ใน StockRender
interface StockItem {
  id: number;
  image_url: string | null;
  name: string;
  stock: number;
  unit: string;
  description?: string;
  tags: { tag_id: number; name: string }[];
  status: number;
}

interface StockDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  stockItem?: StockItem | null;
  onSave: (data: any, file: File | null) => void;
  onDelete?: (id: number) => void;
  availableTags: TagOption[];
}

export const StockDrawer = ({
  isOpen,
  onClose,
  stockItem,
  onSave,
  onDelete,
  availableTags = [],
}: StockDrawerProps) => {
  // Form States
  const [name, setName] = useState("");
  const [stock, setStock] = useState<number | string>(0);
  const [unit, setUnit] = useState("กิโล");
  const [description, setDescription] = useState("");

  // Tag & Unit Dropdown States
  const [dbTags, setDbTags] = useState<TagOption[]>([]);
  const [selectedTags, setSelectedTags] = useState<TagOption[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);

  // Image States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const tagWrapperRef = useRef<HTMLDivElement>(null);
  const unitWrapperRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditMode = !!stockItem;
  const units = ["กิโล", "กรัม", "ชิ้น", "แพ็ค", "ลิตร"];

  // 1. Fetch Tags จาก DB เผื่อมีการอัปเดตใหม่
  useEffect(() => {
    if (isOpen) {
      const fetchTags = async () => {
        try {
          const res = await getStockTags();
          if (res && Array.isArray(res)) {
            const formattedTags = res.map((t: any) => ({
              id: t.id || t.tag_id,
              name: t.name,
            }));
            setDbTags(formattedTags);
          }
        } catch (error) {
          console.error("Failed to fetch tags:", error);
        }
      };
      fetchTags();
    }
  }, [isOpen]);

  // 2. Initialize Form (ปรับ Field ให้ตรงกับ Backend)
  useEffect(() => {
    if (isOpen) {
      if (stockItem) {
        // --- กรณีแก้ไข (Edit Mode) ---
        setName(stockItem.name || ""); // เปลี่ยนจาก title เป็น name
        setStock(stockItem.stock || 0); // เปลี่ยนจาก amount เป็น stock
        setUnit(stockItem.unit || "กิโล");
        setDescription(stockItem.description || "");

        // Map tags จาก {tag_id, name} เป็น {id, name} สำหรับ UI
        const mappedTags = stockItem.tags
          ? stockItem.tags.map((t) => ({ id: t.tag_id, name: t.name }))
          : [];
        setSelectedTags(mappedTags);

        setPreviewUrl(stockItem.image_url); // เปลี่ยนจาก imgUrl เป็น image_url
      } else {
        // --- กรณีเพิ่มใหม่ (Add Mode) ---
        setName("");
        setStock(0);
        setUnit("กิโล");
        setDescription("");
        setSelectedTags([]);
        setTagInput("");
        setSelectedFile(null);
        setPreviewUrl(null);
      }
    }
  }, [isOpen, stockItem]);

  // 3. Cleanup Image URL (กัน Memory Leak)
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Handle Click Outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tagWrapperRef.current &&
        !tagWrapperRef.current.contains(event.target as Node)
      ) {
        setShowTagDropdown(false);
      }
      if (
        unitWrapperRef.current &&
        !unitWrapperRef.current.contains(event.target as Node)
      ) {
        setShowUnitDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sourceTags = dbTags.length > 0 ? dbTags : availableTags;
  const filteredTags = sourceTags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(tagInput.toLowerCase()) &&
      !selectedTags.some((selected) => selected.id === tag.id)
  );

  const handleSave = () => {
    // สร้าง Payload ให้ตรงกับ IUpdateIngredientRequest/ICreateIngredientRequest
    const payload = {
      name,
      stock: Number(stock),
      // ส่งเป็นโครงสร้าง { tag_id: number }[] ตามที่ backend ต้องการ
      tags: selectedTags.map((t) => ({ tag_id: t.id })),
      unit,
      description,
    };
    onSave(payload, selectedFile);
    onClose();
  };

  const addTag = (tag: TagOption) => {
    if (!selectedTags.find((t) => t.id === tag.id)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setTagInput("");
    setShowTagDropdown(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDeleteClick = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (stockItem && onDelete) {
      onDelete(stockItem.id);
      setIsConfirmModalOpen(false); // ปิด Modal ยืนยัน
      onClose(); // ปิด Drawer
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 z-50 w-full md:w-[600px] bg-[#F5F5F5] shadow-2xl flex flex-col transition-transform">
        {/* Header */}
        <div className="px-8 py-6 bg-white border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-extrabold text-gray-900">
            {isEditMode ? "Edit Ingredient" : "New Ingredient"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
          >
            <Icons name="CloseIcon" className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="flex flex-col gap-8">
            {/* Image Upload */}
            <div className="flex flex-col items-center">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group relative w-48 h-48 bg-white rounded-3xl border-2 border-dashed border-gray-300 hover:border-primary-orange-main cursor-pointer flex items-center justify-center overflow-hidden transition-all shadow-sm"
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 group-hover:text-primary-orange-main flex flex-col items-center">
                    <Icons name="PlusIcon" className="w-10 h-10 mb-2" />
                    <span className="text-sm font-medium">Upload Image</span>
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>

            <div className="space-y-6">
              {/* Ingredient Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Ingredient Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-orange-main transition-all shadow-sm"
                  placeholder="e.g. Wagyu Beef"
                />
              </div>

              {/* Stock & Unit */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-orange-main transition-all shadow-sm"
                  />
                </div>

                <div className="space-y-2 relative" ref={unitWrapperRef}>
                  <label className="text-sm font-semibold text-gray-700">
                    Unit
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowUnitDropdown(!showUnitDropdown)}
                    className={`w-full px-4 py-3 rounded-xl bg-white border border-gray-200 flex justify-between items-center shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-orange-main ${showUnitDropdown ? "ring-2 ring-primary-orange-main" : ""}`}
                  >
                    <span className={unit ? "text-gray-900" : "text-gray-400"}>
                      {unit || "Select unit"}
                    </span>
                    <Icons
                      name="ArrowDownIcon"
                      className={`w-4 h-4 transition-transform ${showUnitDropdown ? "rotate-180" : ""}`}
                    />
                  </button>
                  {showUnitDropdown && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-[70] animate-in fade-in zoom-in-95 duration-200">
                      {units.map((u) => (
                        <button
                          key={u}
                          onClick={() => {
                            setUnit(u);
                            setShowUnitDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors hover:bg-orange-50 ${unit === u ? "text-primary-orange-main bg-orange-50" : "text-gray-700"}`}
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Description
                </label>
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-orange-main transition-all shadow-sm"
                  placeholder="Additional details..."
                />
              </div>

              {/* Category Tags */}
              <div className="space-y-2 relative" ref={tagWrapperRef}>
                <label className="text-sm font-semibold text-gray-700">
                  Category Tags
                </label>
                <div className="bg-white border border-gray-200 min-h-[50px] rounded-xl p-2 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-primary-orange-main shadow-sm transition-all">
                  {selectedTags.map((tag) => (
                    <Badge
                      key={tag.id}
                      className="bg-primary-orange-main/80 text-white px-3 py-1.5 rounded-lg border-none flex items-center gap-1"
                    >
                      {tag.name}
                      <button
                        onClick={() =>
                          setSelectedTags(
                            selectedTags.filter((t) => t.id !== tag.id)
                          )
                        }
                        className="hover:text-red-500"
                      >
                        <Icons name="CloseIcon" className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                  <input
                    value={tagInput}
                    onChange={(e) => {
                      setTagInput(e.target.value);
                      setShowTagDropdown(true);
                    }}
                    onFocus={() => setShowTagDropdown(true)}
                    className="flex-1 bg-transparent border-none outline-none text-base min-w-[120px] px-1"
                    placeholder={
                      selectedTags.length === 0 ? "Select category..." : ""
                    }
                  />
                </div>
                {showTagDropdown && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-[60] max-h-60 overflow-y-auto">
                    {filteredTags.length > 0 ? (
                      filteredTags.map((tag) => (
                        <button
                          key={tag.id}
                          onClick={() => addTag(tag)}
                          className="w-full text-left px-4 py-3 hover:bg-orange-50 text-sm font-medium border-b border-gray-50 last:border-0"
                        >
                          {tag.name}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-gray-400 text-center text-sm">
                        No tags found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-white border-t border-gray-200 flex justify-between gap-4">
          {/* ส่วนปุ่ม Delete (แสดงเฉพาะตอน Edit) */}
          <div>
            {isEditMode && (
              <button
                onClick={handleDeleteClick}
                className="px-4 py-3 rounded-xl border-2 border-red-100 text-red-500 hover:bg-red-50 font-bold transition-colors flex items-center gap-2"
              >
                <Icons name="TrashIcon" className="w-5 h-5" /> Delete
              </button>
            )}
          </div>

          {/* ส่วนปุ่ม Cancel & Save */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="px-8 py-3 rounded-xl text-gray-600 font-semibold hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-10 py-3 bg-primary-orange-main hover:bg-[#E64A26] text-white font-bold rounded-xl shadow-lg transition-all"
            >
              {isEditMode ? "Save Changes" : "Create Ingredient"}
            </button>
          </div>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Ingredient"
        message={`Are you sure you want to delete "${stockItem?.name || "this ingredient"}"? This action cannot be undone.`}
      />
    </>
  );
};
