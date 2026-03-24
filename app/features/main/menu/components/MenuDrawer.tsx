"use client";
import { useEffect, useRef, useState } from "react";

import { ConfirmDeleteModal } from "@/app/components/featureComponents/ConfirmDeleteModal";
import { Badge } from "@/app/components/ui/badge";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Icons } from "@/app/icons";
import { IMenuTag } from "@/types/menuType";
import { IIngredientResponse } from "@/types/stockType";

export interface Ingredient {
  name: string;
  amount: number;
}

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  menuItem?: {
    id: number;
    name: string;
    image_url: string | null;
    price: number;
    currency: string;
    ingredients: Ingredient[];
    tags: { tag_id: number; name: string }[];
    status: number;
  } | null;
  onSave: (item: any, file: File | null) => void;
  onDelete?: (id: number) => void;
  availableTags: IMenuTag[];
  availableIngredients: IIngredientResponse[];
}

export const MenuDrawer = ({
  isOpen,
  onClose,
  menuItem,
  onSave,
  onDelete,
  availableTags,
  availableIngredients,
}: MenuDrawerProps) => {
  // Form States
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  // Searchable Dropdown States
  const [tagSearch, setTagSearch] = useState("");
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);

  const [ingSearch, setIngSearch] = useState("");
  const [isIngDropdownOpen, setIsIngDropdownOpen] = useState(false);

  // Refs for Click Outside Logic
  const tagWrapperRef = useRef<HTMLDivElement>(null);
  const ingWrapperRef = useRef<HTMLDivElement>(null);

  // Image States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const isEditMode = !!menuItem;

  // --- Click Outside Handler ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // ปิด Tag Dropdown ถ้าคลิกข้างนอก
      if (
        tagWrapperRef.current &&
        !tagWrapperRef.current.contains(event.target as Node)
      ) {
        setIsTagDropdownOpen(false);
      }
      // ปิด Ingredient Dropdown ถ้าคลิกข้างนอก
      if (
        ingWrapperRef.current &&
        !ingWrapperRef.current.contains(event.target as Node)
      ) {
        setIsIngDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (menuItem) {
        setPreviewUrl(menuItem.image_url);
        setName(menuItem.name);
        setPrice(menuItem.price);
        setTags(menuItem.tags?.map((t: any) => t.name) || []); // ดึงแค่ชื่อมาแสดง
        setIngredients(menuItem.ingredients || []);
      } else {
        setPreviewUrl(null);
        setName("");
        setPrice("");
        setTags([]);
        setIngredients([]);
        setSelectedFile(null);
      }
      setTagSearch("");
      setIngSearch("");
    }
  }, [isOpen, menuItem]);

  // Cleanup Image URL
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(
      {
        id: menuItem?.id,
        name: name,
        amount: Number(price),
        unit: "Bahts",
        ingredients,
        tags,
      },
      selectedFile
    );
    onClose();
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
    if (menuItem && onDelete) {
      onDelete(menuItem.id);
      setIsConfirmModalOpen(false); // ปิด Modal ยืนยัน
      onClose(); // ปิด Drawer
    }
  };

  // --- Ingredient Logic ---
  const filteredIngredients = availableIngredients.filter(
    (ing) =>
      ing.name.toLowerCase().includes(ingSearch.toLowerCase()) &&
      !ingredients.some((i) => i.name === ing.name)
  );

  const addIngredient = (ingName: string) => {
    setIngredients([...ingredients, { name: ingName, amount: 1 }]);
    setIngSearch("");
    setIsIngDropdownOpen(false);
  };

  const removeIngredient = (index: number) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  const updateIngredient = (index: number, value: number) => {
    const newIngredients = [...ingredients];
    newIngredients[index].amount = value;
    setIngredients(newIngredients);
  };

  // --- Tag Logic ---
  const filteredTags = availableTags.filter(
    (t) =>
      t.name.toLowerCase().includes(tagSearch.toLowerCase()) &&
      !tags.includes(t.name)
  );

  const addTag = (tagName: string) => {
    if (!tags.includes(tagName)) {
      setTags([...tags, tagName]);
    }
    setTagSearch("");
    setIsTagDropdownOpen(false);
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 z-50 w-full md:w-[600px] bg-[#F5F5F5] shadow-2xl flex flex-col transition-transform">
        {/* Header */}
        <div className="px-8 py-6 bg-white border-b border-gray-200 flex justify-between items-center shrink-0">
          <h2 className="text-2xl font-extrabold text-gray-900">
            {isEditMode ? "Edit Menu" : "Add Menu"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
          >
            <Icons name="CloseIcon" className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="flex flex-col gap-8">
            {/* Image Upload Section */}
            <div className="flex flex-col items-center">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group relative w-48 h-48 bg-white rounded-3xl border-2 border-dashed border-gray-300 hover:border-primary-orange-main cursor-pointer flex items-center justify-center overflow-hidden transition-all shadow-sm"
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={name}
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
              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={
                    isEditMode ? "Edit menu name..." : "Add menu name..."
                  }
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-orange-main transition-all shadow-sm"
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-orange-main transition-all shadow-sm"
                />
              </div>

              {/* Tags (Searchable Dropdown) */}
              <div className="space-y-2 relative" ref={tagWrapperRef}>
                <label className="text-sm font-semibold text-gray-700">
                  Tags
                </label>
                <div className="bg-white border border-gray-200 min-h-[50px] rounded-xl p-2 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-primary-orange-main shadow-sm transition-all items-center">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      className="bg-primary-orange-main/80 text-white px-3 py-1.5 rounded-lg border-none flex items-center gap-1"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-500 ml-1"
                      >
                        <Icons name="CloseIcon" className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                  <input
                    type="text"
                    value={tagSearch}
                    onChange={(e) => {
                      setTagSearch(e.target.value);
                      setIsTagDropdownOpen(true);
                    }}
                    onFocus={() => setIsTagDropdownOpen(true)}
                    placeholder="Search tags..."
                    className="flex-1 bg-transparent border-none outline-none text-base min-w-[120px] px-1 h-8"
                  />
                </div>

                {isTagDropdownOpen && filteredTags.length > 0 && (
                  <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                    {filteredTags.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => addTag(t.name)}
                        className="px-4 py-2 hover:bg-orange-50 cursor-pointer text-sm text-gray-700"
                      >
                        {t.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Ingredients (Searchable Dropdown) */}
              <div className="space-y-2 relative" ref={ingWrapperRef}>
                <label className="text-sm font-semibold text-gray-700">
                  Ingredients
                </label>
                <div className="mb-3">
                  <input
                    type="text"
                    value={ingSearch}
                    onChange={(e) => {
                      setIngSearch(e.target.value);
                      setIsIngDropdownOpen(true);
                    }}
                    onFocus={() => setIsIngDropdownOpen(true)}
                    placeholder="Search and add ingredient..."
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-orange-main transition-all shadow-sm text-sm"
                  />
                  {isIngDropdownOpen && filteredIngredients.length > 0 && (
                    <div className="absolute left-0 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                      {filteredIngredients.map((ing) => (
                        <div
                          key={ing.id}
                          onClick={() => addIngredient(ing.name)}
                          className="px-4 py-2 hover:bg-orange-50 cursor-pointer text-sm text-gray-700 flex justify-between"
                        >
                          <span>{ing.name}</span>
                          <span className="text-xs text-gray-400">
                            ({ing.unit})
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected Ingredients List */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <ScrollArea className="max-h-[250px] overflow-y-auto pr-2">
                    <div className="space-y-3">
                      {ingredients.map((ingredient, index) => (
                        <div key={index} className="flex gap-3 items-center">
                          <div className="flex-1 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm text-primary-orange-main">
                            {ingredient.name}
                          </div>
                          <div className="flex items-center bg-gray-50 rounded-lg h-[38px] px-2 w-[100px] border border-gray-200 focus-within:border-primary-orange-main focus-within:bg-white transition-all">
                            <input
                              type="number"
                              value={ingredient.amount}
                              onChange={(e) =>
                                updateIngredient(index, Number(e.target.value))
                              }
                              className="w-full text-center outline-none bg-transparent text-sm"
                            />
                            <div className="flex flex-col ml-1">
                              <button
                                onClick={() =>
                                  updateIngredient(index, ingredient.amount + 1)
                                }
                                className="text-gray-400 hover:text-primary-orange-main leading-none text-[10px]"
                              >
                                ▲
                              </button>
                              <button
                                onClick={() =>
                                  updateIngredient(
                                    index,
                                    Math.max(0, ingredient.amount - 1)
                                  )
                                }
                                className="text-gray-400 hover:text-primary-orange-main leading-none text-[10px]"
                              >
                                ▼
                              </button>
                            </div>
                          </div>
                          <button
                            onClick={() => removeIngredient(index)}
                            className="text-gray-400 hover:text-red-500 p-2 transition-colors"
                          >
                            <Icons name="TrashIcon" className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
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
              {isEditMode ? "Save Changes" : "Create Menu"}
            </button>
          </div>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Menu"
        message={`Are you sure you want to delete "${menuItem?.name || "this menu"}"? This action cannot be undone.`}
      />
    </>
  );
};
