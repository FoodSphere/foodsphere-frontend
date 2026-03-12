"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  Image as ImageIcon,
  Pencil,
  Plus,
  Trash2,
  Upload,
  UtensilsCrossed,
  X,
} from "lucide-react";

import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
// --- API Imports ---
import { getMenus } from "@/services/menu/menuApi";
import { getMenuTags } from "@/services/menu/menuTagApi";
import {
  createPromotionMenuWithImage,
  getPromotionMenus, // เพิ่ม Import ตรงนี้
} from "@/services/promotion/promotionApi";
import {
  ICreatePromotionMenuRequest,
  IMenuResponse,
  IMenuTag,
  IPromotionMenuResponse,
} from "@/types/menuType";

// --- Type Definition ---
type SetItem = { menu_id: number; name: string; price: number; qty: number };

// Type สำหรับจัดฟอร์แมตข้อมูลแสดงผลฝั่งซ้าย (UI State)
type UIPromotion = {
  id: number;
  name: string;
  description: string;
  image_url: string;
  status: number;
  specialPrice: number;
  originalPrice: number;
  items: { menu_id: number; name: string; quantity: number }[];
};

export const ManagePromotionView = () => {
  // --- States ---
  // ใช้ UIPromotion แทน Mock Data เดิม
  const [promotions, setPromotions] = useState<UIPromotion[]>([]);

  // API Data States
  const [availableMenus, setAvailableMenus] = useState<IMenuResponse[]>([]);
  const [availableTags, setAvailableTags] = useState<IMenuTag[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Form States
  const [editingId, setEditingId] = useState<string | null>(null);
  const [setName, setSetName] = useState("");
  const [description, setDescription] = useState("");
  const [specialPrice, setSpecialPrice] = useState<string>("");

  // Selections
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [newSetItems, setNewSetItems] = useState<SetItem[]>([]);

  // Image States
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSaving, setIsSaving] = useState(false);

  // --- Fetch Data ---
  const fetchMasterData = async () => {
    try {
      setIsLoadingData(true);
      // โหลด Menus, Tags และ Promotions พร้อมกัน
      const [menusRes, tagsRes, promotionsRes] = await Promise.all([
        getMenus(),
        getMenuTags(),
        getPromotionMenus(), // ดึง Promotions จาก API
      ]);

      const menus = menusRes?.data || [];
      if (menusRes?.data) setAvailableMenus(menus);
      if (tagsRes) setAvailableTags(tagsRes);

      // --- ทำการ Mapping ข้อมูล Promotion ---
      if (promotionsRes?.data) {
        const mappedPromotions: UIPromotion[] = promotionsRes.data.map(
          (promo: IPromotionMenuResponse) => {
            let originalPrice = 0;

            // ใส่ fallback (promo.components || []) กันพัง
            const items = (promo.components || []).map((comp) => {
              const menuItem = menus.find(
                (m: IMenuResponse) => m.id === comp.menu_id
              );
              const itemPrice = menuItem?.price || 0;
              const itemName = menuItem?.name || "Unknown Item";

              originalPrice += itemPrice * comp.quantity;

              return {
                menu_id: comp.menu_id,
                name: itemName,
                quantity: comp.quantity,
              };
            });

            return {
              id: promo.id,
              name: promo.name,
              description: promo.description,
              image_url: promo.image_url,
              status: promo.status,
              specialPrice: promo.price,
              originalPrice: originalPrice,
              items: items,
            };
          }
        );
        setPromotions(mappedPromotions);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchMasterData();
  }, []);

  const totalOriginalPrice = newSetItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  // --- Handlers ---
  const handleAddTag = (tagIdStr: string) => {
    const tagId = Number(tagIdStr);
    if (!selectedTagIds.includes(tagId)) {
      setSelectedTagIds([...selectedTagIds, tagId]);
    }
  };

  const handleRemoveTag = (tagId: number) => {
    setSelectedTagIds(selectedTagIds.filter((id) => id !== tagId));
  };

  const handleAddItem = () => {
    if (!selectedItemId) return;
    const item = availableMenus.find((i) => String(i.id) === selectedItemId);

    if (item) {
      const menuIdNum = Number(item.id); // บังคับแปลงเป็น Number
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setSetName("");
    setDescription("");
    setSpecialPrice("");
    setNewSetItems([]);
    setSelectedItemId("");
    setSelectedTagIds([]);
    setImagePreview(null);
    setImageFile(null);
  };

  const handleSaveSet = async () => {
    if (!setName || newSetItems.length === 0) {
      alert("Please enter set name and add at least one menu item.");
      return;
    }

    setIsSaving(true);
    try {
      if (!editingId) {
        const payload: ICreatePromotionMenuRequest = {
          name: setName,
          display_name: setName,
          description: description,
          price: parseFloat(specialPrice) || 0,
          components: newSetItems.map((item) => ({
            menu_id: Number(item.menu_id),
            quantity: Number(item.qty),
          })),
          tags: selectedTagIds.map((id) => ({ tag_id: Number(id) })),
        };

        console.log("📤 Payload to send:", payload); // <-- ใส่ Log ดูว่า Data ครบไหมก่อนยิง

        const res = await createPromotionMenuWithImage(payload, imageFile);

        if (res?.statusCode === 200 || res?.statusCode === 201) {
          alert("Promotion menu created successfully!");
          handleCancelEdit();
          fetchMasterData();
        } else {
          alert("Failed to create promotion menu.");
        }
      } else {
        console.log("Update Mode (To be implemented)");
      }
    } catch (error) {
      console.error("Error saving promotion:", error);
      alert("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pb-10">
      {/* --- Left Column: Active Promotions List --- */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Active Promotions
            </h2>
            <p className="text-gray-500">Manage your set menus and bundles.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {isLoadingData ? (
            <div className="text-center py-10 text-gray-500">
              Loading promotions...
            </div>
          ) : promotions.length === 0 ? (
            <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              No promotions found. Create one on the right!
            </div>
          ) : (
            promotions.map((promo) => (
              <Card
                key={promo.id}
                className="p-4 flex flex-col sm:flex-row gap-5 overflow-hidden shadow-sm hover:shadow-md transition-all border-gray-100"
              >
                {/* Image */}
                <div className="w-full sm:w-40 h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                  {promo.image_url ? (
                    <img
                      src={promo.image_url}
                      alt={promo.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {promo.name}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {promo.description}
                        </p>
                      </div>
                      <Badge
                        variant={promo.status === 1 ? "default" : "secondary"}
                      >
                        {promo.status === 1 ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    {/* Components Badge */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {promo.items.map((item, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-100 border border-gray-200 text-gray-700 px-2 py-1 rounded-md font-medium"
                        >
                          {item.quantity}x {item.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Prices */}
                  <div className="mt-4 flex items-end justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-gray-500 uppercase font-bold">
                        Total Value
                      </span>
                      <span className="text-sm text-gray-400 line-through font-medium">
                        {promo.originalPrice.toLocaleString()}.-
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-primary-orange-main uppercase font-bold">
                        Special Price
                      </span>
                      <span className="text-2xl font-black text-primary-orange-main leading-none">
                        {promo.specialPrice.toLocaleString()}.-
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* --- Right Column: Create/Edit Form --- */}
      <div className="lg:col-span-1">
        <Card
          className={`shadow-xl border-none rounded-[32px] overflow-hidden sticky top-8 transition-all duration-300 ${editingId ? "ring-2 ring-primary-orange-main shadow-orange-200" : ""}`}
        >
          <CardHeader
            className={`${editingId ? "bg-primary-orange-main" : "bg-gray-900"} text-white p-6 transition-colors duration-300`}
          >
            <CardTitle className="text-lg">
              {editingId ? "Update Set Menu" : "Create Pairing Set"}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 space-y-5 bg-white">
            {/* Image Upload */}
            <div
              className="group relative w-full h-48 bg-gray-50 rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 hover:border-primary-orange-main transition-all cursor-pointer flex flex-col items-center justify-center text-center"
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
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium backdrop-blur-sm">
                    <Upload className="w-5 h-5 mr-2" /> Change Image
                  </div>
                </>
              ) : (
                <div className="text-gray-400 group-hover:text-primary-orange-main transition-colors">
                  <ImageIcon className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm font-semibold">Click to upload image</p>
                </div>
              )}
            </div>

            {/* Set Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="set-name">Set Name</Label>
                <Input
                  id="set-name"
                  value={setName}
                  onChange={(e) => setSetName(e.target.value)}
                  placeholder="e.g. Valentine's Dinner"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description..."
                />
              </div>

              {/* --- Tags Selection (New) --- */}
              <div className="space-y-2">
                <Label>Promotion Tags</Label>
                <Select onValueChange={handleAddTag}>
                  <SelectTrigger className="bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Select tags..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-[9999]">
                    {availableTags.map((tag) => (
                      <SelectItem key={tag.id} value={String(tag.id)}>
                        {tag.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* Selected Tags Display */}
                {selectedTagIds.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedTagIds.map((tagId) => {
                      const tagInfo = availableTags.find((t) => t.id === tagId);
                      return tagInfo ? (
                        <Badge
                          key={tagId}
                          variant="secondary"
                          className="bg-orange-100 text-orange-800 flex items-center gap-1"
                        >
                          {tagInfo.name}
                          <X
                            className="w-3 h-3 cursor-pointer hover:text-red-500"
                            onClick={() => handleRemoveTag(tagId)}
                          />
                        </Badge>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* --- Menu Selection Area (Updated to use real data) --- */}
            <div className="space-y-3 pt-2">
              <Label className="flex items-center justify-between">
                Select Menu Items
              </Label>
              <div className="flex gap-0 shadow-sm rounded-xl border border-orange-200 focus-within:ring-2 focus-within:ring-primary-orange-main transition-all bg-white relative">
                <div className="flex-1">
                  <Select
                    onValueChange={setSelectedItemId}
                    value={selectedItemId}
                  >
                    <SelectTrigger className="h-12 border-none bg-transparent focus:ring-0 w-full text-left">
                      <SelectValue
                        placeholder={
                          isLoadingData
                            ? "Loading menus..."
                            : "Search or Select a Dish..."
                        }
                      />
                    </SelectTrigger>
                    <SelectContent
                      className="max-h-60 bg-white z-[9999]"
                      position="popper"
                      sideOffset={5}
                    >
                      {availableMenus.map((item) => (
                        <SelectItem
                          key={item.id}
                          value={String(item.id)}
                          className="py-3 cursor-pointer"
                        >
                          <span className="font-semibold text-gray-800">
                            {item.name}
                          </span>
                          <span className="text-gray-400 text-xs ml-2">
                            ({item.price}.-)
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleAddItem}
                  disabled={!selectedItemId}
                  className="h-12 w-14 rounded-none rounded-r-xl bg-primary-orange-main text-white"
                >
                  <Plus className="w-6 h-6" />
                </Button>
              </div>

              {/* Selected Items List */}
              {newSetItems.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-3 space-y-2 mt-2 border border-gray-100">
                  {newSetItems.map((item) => (
                    <div
                      key={item.menu_id}
                      className="flex justify-between items-center text-sm bg-white p-3 rounded-lg shadow-sm border border-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 bg-orange-100 text-primary-orange-main rounded-full flex items-center justify-center text-xs font-bold">
                          {item.qty}
                        </div>
                        <span className="font-medium text-gray-700">
                          {item.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400 text-xs font-medium">
                          {item.price * item.qty}.-
                        </span>
                        <button
                          onClick={() =>
                            setNewSetItems(
                              newSetItems.filter(
                                (i) => i.menu_id !== item.menu_id
                              )
                            )
                          }
                          className="text-gray-300 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500 px-1">
                    <span>Original Value:</span>
                    <span className="font-bold text-gray-900 text-sm">
                      {totalOriginalPrice.toLocaleString()}.-
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label className="text-gray-500 text-xs uppercase font-bold">
                  Total Original
                </Label>
                <div className="h-12 px-4 bg-gray-100 rounded-xl flex items-center text-gray-500 font-bold text-lg">
                  {totalOriginalPrice > 0
                    ? totalOriginalPrice.toLocaleString()
                    : "-"}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-primary-orange-main text-xs uppercase font-bold">
                  Set Price
                </Label>
                <Input
                  type="number"
                  value={specialPrice}
                  onChange={(e) => setSpecialPrice(e.target.value)}
                  placeholder="0.00"
                  className="h-12 bg-orange-50 border-orange-200 text-orange-700 font-bold text-xl"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-6 pt-0 bg-white grid gap-3">
            <Button
              onClick={handleSaveSet}
              disabled={isSaving}
              className="w-full h-12 rounded-xl text-lg font-bold bg-primary-orange-main hover:bg-orange-600 text-white shadow-lg"
            >
              {isSaving
                ? "Creating..."
                : editingId
                  ? "Update Changes"
                  : "Create Promotion"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
