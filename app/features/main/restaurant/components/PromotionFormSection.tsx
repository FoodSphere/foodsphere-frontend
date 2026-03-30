import React, { useEffect, useRef, useState } from "react";
import { Image as ImageIcon, Search, Trash2, Upload, X } from "lucide-react";

import {
  createPromotionMenuWithImage,
  updatePromotionMenuWithImage,
} from "@/services/promotion/promotionApi";
import {
  ICreatePromotionMenuRequest,
  IMenuResponse,
  IMenuTag,
  IUpdatePromotionMenuRequest,
} from "@/types/menuType";

import { PromotionConfirmModal } from "./PromotionConfirmModal";
import { UIPromotion } from "./PromotionMenuCard";

interface PromotionFormSectionProps {
  availableMenus: IMenuResponse[];
  availableTags: IMenuTag[];
  isLoadingData: boolean;
  editingPromotion: UIPromotion | null;
  onSuccess: () => void;
  onCancel: () => void;
}

type SetItem = { menu_id: number; name: string; price: number; qty: number };

export const PromotionFormSection: React.FC<PromotionFormSectionProps> = ({
  availableMenus,
  availableTags,
  isLoadingData,
  editingPromotion,
  onSuccess,
  onCancel,
}) => {
  const [setName, setSetName] = useState("");
  const [description, setDescription] = useState("");
  const [specialPrice, setSpecialPrice] = useState<string>("");
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [newSetItems, setNewSetItems] = useState<SetItem[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({
    name: false,
    price: false,
    items: false,
  });

  // --- State สำหรับ Searchable Dropdown ---
  const [tagSearch, setTagSearch] = useState("");
  const [isTagOpen, setIsTagOpen] = useState(false);
  const tagDropdownRef = useRef<HTMLDivElement>(null);

  const [menuSearch, setMenuSearch] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuDropdownRef = useRef<HTMLDivElement>(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    if (editingPromotion) {
      setSetName(editingPromotion.name);
      setDescription(editingPromotion.description);
      setSpecialPrice(editingPromotion.specialPrice.toString());
      setSelectedTagIds(editingPromotion.tagIds || []);
      setImagePreview(editingPromotion.image_url);
      setImageFile(null);
      setNewSetItems(
        editingPromotion.items.map((item) => ({
          menu_id: item.menu_id,
          name: item.name,
          price: item.price,
          qty: item.quantity,
        }))
      );
    } else {
      handleClearForm();
    }
  }, [editingPromotion]);

  // Click Outside Listener สำหรับปิด Dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuDropdownRef.current &&
        !menuDropdownRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
      if (
        tagDropdownRef.current &&
        !tagDropdownRef.current.contains(event.target as Node)
      ) {
        setIsTagOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClearForm = () => {
    setSetName("");
    setDescription("");
    setSpecialPrice("");
    setNewSetItems([]);
    setSelectedTagIds([]);
    setImagePreview(null);
    setImageFile(null);
    setMenuSearch("");
    setTagSearch("");
    setErrors({ name: false, price: false, items: false });
  };

  const totalOriginalPrice = newSetItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const filteredTags = availableTags.filter((tag) =>
    tag.name.toLowerCase().includes(tagSearch.toLowerCase())
  );

  const filteredMenus = availableMenus.filter((menu) => {
    const isNormalMenu = !menu.components || menu.components.length === 0;
    const isMatchSearch = menu.name
      .toLowerCase()
      .includes(menuSearch.toLowerCase());
    return isNormalMenu && isMatchSearch;
  });

  const handleRemoveTag = (tagId: number) => {
    setSelectedTagIds(selectedTagIds.filter((id) => id !== tagId));
  };

  const handleAddItemById = (menuIdNum: number) => {
    const item = availableMenus.find((i) => Number(i.id) === menuIdNum);
    if (item) {
      const existing = newSetItems.find((i) => i.menu_id === menuIdNum);
      if (existing) {
        setNewSetItems(
          newSetItems.map((i) =>
            i.menu_id === menuIdNum ? { ...i, qty: Number(i.qty) + 1 } : i
          )
        );
      } else {
        setNewSetItems([
          ...newSetItems,
          {
            menu_id: menuIdNum,
            name: item.name,
            price: Number(item.price),
            qty: 1,
          },
        ]);
      }
    }
  };

  const handleUpdateItemQty = (menuId: number, delta: number) => {
    setNewSetItems((prev) =>
      prev.map((item) => {
        if (item.menu_id === menuId) {
          const newQty = Math.max(1, item.qty + delta);
          return { ...item, qty: newQty };
        }
        return item;
      })
    );
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRequestSave = () => {
    // ตรวจสอบความถูกต้องของข้อมูล (Validation)
    const currentErrors = {
      name: !setName.trim(), // ถ้าว่างให้เป็น true (มี error)
      price: !specialPrice || parseFloat(specialPrice) <= 0,
      items: newSetItems.length === 0,
    };

    setErrors(currentErrors);

    // ถ้ามีช่องไหน error ให้ return ออกไปเลย ไม่เปิด Modal
    if (currentErrors.name || currentErrors.price || currentErrors.items) {
      return;
    }

    setIsConfirmModalOpen(true);
  };

  const executeSaveSet = async () => {
    setIsSaving(true);
    try {
      if (!editingPromotion) {
        const payload: ICreatePromotionMenuRequest = {
          name: setName,
          display_name: setName,
          description: description,
          status: 1,
          stock_availability: true, // สำหรับเมนู Promotion หลัก
          price: parseFloat(specialPrice) || 0,
          components: newSetItems.map((item) => ({
            menu_id: Number(item.menu_id),
            quantity: Number(item.qty),
          })),
          tags: selectedTagIds.map((id) => ({ tag_id: Number(id) })),
        };
        const res = await createPromotionMenuWithImage(payload, imageFile);
        if (res?.statusCode === 200 || res?.statusCode === 201) {
          handleClearForm();
          onSuccess();
        } else {
          console.error("Failed to create promotion menu.");
        }
      } else {
        const payload: IUpdatePromotionMenuRequest = {
          name: setName,
          display_name: setName,
          description: description,
          status: 1,
          stock_availability: true, // สำหรับเมนู Promotion หลัก
          price: parseFloat(specialPrice) || 0,
          components: newSetItems.map((item) => ({
            menu_id: Number(item.menu_id),
            quantity: Number(item.qty),
          })),
          tags: selectedTagIds.map((id) => ({ tag_id: Number(id) })),
          ingredients: [],
        };

        const res = await updatePromotionMenuWithImage(
          editingPromotion.id,
          payload,
          imageFile
        );
        if (res?.statusCode === 200 || res?.statusCode === 204) {
          onCancel();
          onSuccess();
        } else {
          console.error("Failed to update promotion menu.");
        }
      }
    } catch (error) {
      console.error("Error saving promotion:", error);
    } finally {
      setIsSaving(false);
      setIsConfirmModalOpen(false);
    }
  };

  return (
    <>
      <div
        className={`bg-white rounded-[32px] shadow-xl border overflow-hidden sticky top-8 transition-all duration-300 ${
          editingPromotion
            ? "border-primary-orange-main shadow-orange-100 ring-4 ring-orange-50"
            : "border-gray-100 shadow-gray-200/50"
        }`}
      >
        {/* Header */}
        <div
          className={`p-6 flex justify-between items-center transition-colors duration-300 ${
            editingPromotion
              ? "bg-primary-orange-main text-white"
              : "bg-gray-900 text-white"
          }`}
        >
          <h2 className="text-xl font-bold tracking-wide">
            {editingPromotion ? "Update Promotion" : "Create Promotion"}
          </h2>
          {editingPromotion && (
            <button
              onClick={onCancel}
              className="text-white hover:bg-white/20 p-1.5 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="p-6 space-y-6">
          {/* Image Upload Area */}
          <div
            className="group relative w-full h-48 bg-gray-50 rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 hover:border-primary-orange-main hover:bg-orange-50/50 transition-all cursor-pointer flex flex-col items-center justify-center text-center"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium backdrop-blur-sm">
                  <Upload className="w-5 h-5 mr-2" /> Change Image
                </div>
              </>
            ) : (
              <div className="text-gray-400 group-hover:text-primary-orange-main transition-colors">
                <div className="bg-white p-3 rounded-full shadow-sm inline-block mb-3">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold">Click to upload image</p>
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">
                Set Name <span className="text-red-500">*</span>
              </label>
              <input
                value={setName}
                onChange={(e) => {
                  setSetName(e.target.value);
                  if (errors.name)
                    setErrors((prev) => ({ ...prev, name: false })); // พิมพ์ปุ๊บหายแดงปั๊บ
                }}
                placeholder="e.g. Valentine's Dinner"
                className={`w-full h-12 px-4 rounded-xl border bg-gray-50 hover:bg-white focus:bg-white focus:ring-4 transition-all outline-none text-gray-900 ${
                  errors.name
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-200 focus:border-primary-orange-main focus:ring-orange-50"
                }`}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">
                  Please enter a set name.
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">
                Description
              </label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description..."
                className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-white focus:bg-white focus:border-primary-orange-main focus:ring-4 focus:ring-orange-50 transition-all outline-none text-gray-900"
              />
            </div>

            {/* Tags Selection (Searchable) */}
            <div className="space-y-1.5" ref={tagDropdownRef}>
              <label className="block text-sm font-semibold text-gray-700">
                Promotion Tags
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={tagSearch}
                  onChange={(e) => setTagSearch(e.target.value)}
                  onFocus={() => setIsTagOpen(true)}
                  placeholder="Search and select tags..."
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-white focus:bg-white focus:border-primary-orange-main focus:ring-4 focus:ring-orange-50 transition-all outline-none text-gray-900"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <Search className="w-5 h-5" />
                </div>

                {isTagOpen && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-xl max-h-48 overflow-y-auto py-1">
                    {filteredTags.length > 0 ? (
                      filteredTags.map((tag) => (
                        <div
                          key={tag.id}
                          onClick={() => {
                            const tagIdNum = Number(tag.id);
                            if (!selectedTagIds.includes(tagIdNum)) {
                              setSelectedTagIds([...selectedTagIds, tagIdNum]);
                            }
                            setTagSearch("");
                            setIsTagOpen(false);
                          }}
                          className="px-4 py-2.5 hover:bg-orange-50 text-gray-700 cursor-pointer text-sm transition-colors"
                        >
                          {tag.name}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500 text-center">
                        No tags found
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Selected Tags Display */}
              {selectedTagIds.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedTagIds.map((tagId) => {
                    const tagInfo = availableTags.find((t) => t.id === tagId);
                    return tagInfo ? (
                      <span
                        key={tagId}
                        className="px-3 py-1 bg-orange-100 text-orange-800 rounded-lg text-sm font-medium flex items-center gap-1.5"
                      >
                        {tagInfo.name}
                        <button
                          onClick={() => handleRemoveTag(tagId)}
                          className="hover:bg-orange-200 text-orange-600 hover:text-orange-900 p-0.5 rounded-full transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Menu Items Area (Searchable) */}
          <div
            className="space-y-3 pt-4 border-t border-gray-100"
            ref={menuDropdownRef}
          >
            <label className="block text-sm font-semibold text-gray-700">
              Select Menu Items
            </label>
            <div className="relative">
              <input
                type="text"
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                onFocus={() => setIsMenuOpen(true)}
                placeholder={
                  isLoadingData ? "Loading menus..." : "Search a Dish..."
                }
                disabled={isLoadingData}
                className={`w-full h-12 px-4 pr-10 rounded-xl border bg-gray-50 hover:bg-white focus:bg-white focus:ring-4 transition-all outline-none text-gray-900 ${
                  errors.items
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-200 focus:border-primary-orange-main focus:ring-orange-50"
                }`}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <Search className="w-5 h-5" />
              </div>

              {isMenuOpen && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto py-1">
                  {filteredMenus.length > 0 ? (
                    filteredMenus.map((item) => {
                      // เช็คว่าเมนูพร้อมใช้งานไหม
                      const isAvailable = item.stock_availability;

                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            // ถ้าไม่พร้อมใช้งาน ให้หยุดการทำงาน (กดไม่ได้)
                            if (!isAvailable) return;

                            handleAddItemById(Number(item.id));
                            setMenuSearch("");
                            setIsMenuOpen(false);
                          }}
                          className={`px-4 py-2.5 text-sm transition-colors flex justify-between items-center ${
                            isAvailable
                              ? "hover:bg-orange-50 text-gray-700 cursor-pointer"
                              : "bg-gray-50 text-gray-400 cursor-not-allowed" // ใส่สไตล์สำหรับกดไม่ได้
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-medium ${!isAvailable && "text-gray-400 opacity-70"}`}
                            >
                              {item.name}
                            </span>
                            {/* แสดง Badge ถ้าเมนูของหมด */}
                            {!isAvailable && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-md tracking-wide">
                                ไม่พร้อมใช้งาน
                              </span>
                            )}
                          </div>
                          <span
                            className={`text-xs font-semibold ${
                              isAvailable ? "text-gray-400" : "text-gray-300"
                            }`}
                          >
                            ฿{item.price}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                      No menus found
                    </div>
                  )}
                </div>
              )}
            </div>
            {errors.items && (
              <p className="text-xs text-red-500 mt-1">
                Please select at least one menu item.
              </p>
            )}

            {/* Selected Items List */}
            {newSetItems.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-3 mt-3 border border-gray-100 space-y-2">
                {newSetItems.map((item) => (
                  <div
                    key={item.menu_id}
                    className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-lg p-0.5">
                        <button
                          onClick={() => handleUpdateItemQty(item.menu_id, -1)}
                          className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        >
                          -
                        </button>
                        <span className="w-5 text-center text-sm font-bold text-gray-700">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => handleUpdateItemQty(item.menu_id, 1)}
                          className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-semibold text-gray-800 text-sm">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 text-sm font-medium">
                        ฿{item.price * item.qty}
                      </span>
                      <button
                        onClick={() =>
                          setNewSetItems(
                            newSetItems.filter(
                              (i) => i.menu_id !== item.menu_id
                            )
                          )
                        }
                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="pt-3 pb-1 flex justify-between items-center px-1">
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                    Original Value
                  </span>
                  <span className="font-bold text-gray-500 text-sm line-through">
                    ฿{totalOriginalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Pricing Area */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div className="space-y-1.5">
              <label className="block text-xs text-gray-500 font-bold uppercase tracking-wider">
                Total Original
              </label>
              <div className="h-12 px-4 bg-gray-50 border border-gray-100 rounded-xl flex items-center text-gray-400 font-bold text-lg">
                {totalOriginalPrice > 0
                  ? `฿${totalOriginalPrice.toLocaleString()}`
                  : "-"}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs text-primary-orange-main font-bold uppercase tracking-wider">
                Set Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={specialPrice}
                onChange={(e) => {
                  setSpecialPrice(e.target.value);
                  if (errors.price)
                    setErrors((prev) => ({ ...prev, price: false }));
                }}
                placeholder="0.00"
                className={`w-full h-12 px-4 rounded-xl border bg-orange-50 focus:bg-white focus:ring-4 transition-all outline-none font-black text-xl ${
                  errors.price
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100 text-red-500"
                    : "border-orange-200 focus:border-primary-orange-main focus:ring-orange-100 text-primary-orange-main"
                }`}
              />
              {errors.price && (
                <p className="text-xs text-red-500 mt-1">
                  Please enter a valid price.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer / Submit Button */}
        <div className="p-6 pt-0 bg-white">
          <button
            onClick={handleRequestSave}
            disabled={isSaving}
            className="w-full h-12 rounded-xl text-lg font-bold bg-primary-orange-main hover:bg-orange-600 active:scale-[0.98] disabled:bg-gray-300 disabled:active:scale-100 text-white shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center"
          >
            {editingPromotion ? "Update Changes" : "Create Promotion"}
          </button>
        </div>
      </div>

      <PromotionConfirmModal
        isOpen={isConfirmModalOpen}
        title={editingPromotion ? "Update Promotion" : "Create Promotion"}
        message={
          editingPromotion
            ? "Are you sure you want to update this promotion's details?"
            : "Are you sure you want to create this new promotion?"
        }
        confirmText={editingPromotion ? "Update" : "Create"}
        cancelText="Cancel"
        isDestructive={false}
        isLoading={isSaving}
        onConfirm={executeSaveSet}
        onCancel={() => setIsConfirmModalOpen(false)}
      />
    </>
  );
};
