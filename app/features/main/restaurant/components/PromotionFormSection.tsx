import React, { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Image as ImageIcon,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";

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
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [newSetItems, setNewSetItems] = useState<SetItem[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleClearForm = () => {
    setSetName("");
    setDescription("");
    setSpecialPrice("");
    setNewSetItems([]);
    setSelectedItemId("");
    setSelectedTagIds([]);
    setImagePreview(null);
    setImageFile(null);
  };

  const totalOriginalPrice = newSetItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const handleAddTag = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tagId = Number(e.target.value);
    if (!tagId) return;
    if (!selectedTagIds.includes(tagId)) {
      setSelectedTagIds([...selectedTagIds, tagId]);
    }
    e.target.value = ""; // Reset select after picking
  };

  const handleRemoveTag = (tagId: number) => {
    setSelectedTagIds(selectedTagIds.filter((id) => id !== tagId));
  };

  const handleAddItem = () => {
    if (!selectedItemId) return;
    const item = availableMenus.find((i) => String(i.id) === selectedItemId);
    if (item) {
      const menuIdNum = Number(item.id);
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
    setSelectedItemId(""); // Clear selection
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

  const handleSaveSet = async () => {
    if (!setName || newSetItems.length === 0) {
      alert("Please enter set name and add at least one menu item.");
      return;
    }

    setIsSaving(true);
    try {
      if (!editingPromotion) {
        const payload: ICreatePromotionMenuRequest = {
          name: setName,
          display_name: setName,
          description: description,
          status: 1,
          price: parseFloat(specialPrice) || 0,
          components: newSetItems.map((item) => ({
            menu_id: Number(item.menu_id),
            quantity: Number(item.qty),
          })),
          tags: selectedTagIds.map((id) => ({ tag_id: Number(id) })),
        };
        const res = await createPromotionMenuWithImage(payload, imageFile);
        if (res?.statusCode === 200 || res?.statusCode === 201) {
          alert("Promotion menu created successfully!");
          handleClearForm();
          onSuccess();
        } else {
          alert("Failed to create promotion menu.");
        }
      } else {
        const payload: IUpdatePromotionMenuRequest = {
          name: setName,
          display_name: setName,
          description: description,
          status: 1,
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
          alert("Promotion menu updated successfully!");
          onCancel();
          onSuccess();
        } else {
          alert("Failed to update promotion menu.");
        }
      }
    } catch (error) {
      console.error("Error saving promotion:", error);
      alert("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
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
              Set Name
            </label>
            <input
              value={setName}
              onChange={(e) => setSetName(e.target.value)}
              placeholder="e.g. Valentine's Dinner"
              className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-white focus:bg-white focus:border-primary-orange-main focus:ring-4 focus:ring-orange-50 transition-all outline-none text-gray-900"
            />
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

          {/* Tags Selection */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">
              Promotion Tags
            </label>
            <div className="relative">
              <select
                onChange={handleAddTag}
                defaultValue=""
                className="w-full h-12 px-4 appearance-none rounded-xl border border-gray-200 bg-gray-50 hover:bg-white focus:bg-white focus:border-primary-orange-main focus:ring-4 focus:ring-orange-50 transition-all outline-none text-gray-900 cursor-pointer"
              >
                <option value="" disabled>
                  Select tags...
                </option>
                {availableTags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronDown className="w-5 h-5" />
              </div>
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

        {/* Menu Items Area */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <label className="block text-sm font-semibold text-gray-700">
            Select Menu Items
          </label>
          <div className="flex gap-0 rounded-xl border border-gray-200 focus-within:border-primary-orange-main focus-within:ring-4 focus-within:ring-orange-50 transition-all bg-white relative overflow-hidden">
            <div className="relative flex-1">
              <select
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
                className="w-full h-12 pl-4 pr-10 bg-transparent outline-none appearance-none font-medium text-gray-700 cursor-pointer"
              >
                <option value="" disabled>
                  {isLoadingData
                    ? "Loading menus..."
                    : "Search or Select a Dish..."}
                </option>
                {availableMenus.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.price}.-)
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronDown className="w-5 h-5" />
              </div>
            </div>
            <button
              onClick={handleAddItem}
              disabled={!selectedItemId}
              className="w-14 h-12 bg-gray-900 hover:bg-black disabled:bg-gray-200 text-white flex items-center justify-center transition-colors border-l border-gray-200"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

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
                          newSetItems.filter((i) => i.menu_id !== item.menu_id)
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
              Set Price
            </label>
            <input
              type="number"
              value={specialPrice}
              onChange={(e) => setSpecialPrice(e.target.value)}
              placeholder="0.00"
              className="w-full h-12 px-4 rounded-xl border border-orange-200 bg-orange-50 focus:bg-white focus:border-primary-orange-main focus:ring-4 focus:ring-orange-100 transition-all outline-none text-primary-orange-main font-black text-xl"
            />
          </div>
        </div>
      </div>

      {/* Footer / Submit Button */}
      <div className="p-6 pt-0 bg-white">
        <button
          onClick={handleSaveSet}
          disabled={isSaving}
          className="w-full h-12 rounded-xl text-lg font-bold bg-primary-orange-main hover:bg-orange-600 active:scale-[0.98] disabled:bg-gray-300 disabled:active:scale-100 text-white shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center"
        >
          {isSaving
            ? editingPromotion
              ? "Updating..."
              : "Creating..."
            : editingPromotion
              ? "Update Changes"
              : "Create Promotion"}
        </button>
      </div>
    </div>
  );
};
