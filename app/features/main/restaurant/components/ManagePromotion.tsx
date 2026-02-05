"use client";

import React, { useRef, useState } from "react";
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

// --- Type Definition ---
type MenuItem = { id: string; name: string; price: number; category: string };
type SetItem = MenuItem & { qty: number };
type Promotion = {
  id: string;
  name: string;
  description: string;
  items: { name: string; qty: number }[];
  originalPrice: number;
  specialPrice: number;
  status: string;
  image: string;
};

// --- Mock Data ---
const availableMenuItems: MenuItem[] = [
  { id: "m1", name: "Wagyu Steak", price: 1200, category: "Main Dish" },
  { id: "m2", name: "Sea Bass Steak", price: 590, category: "Main Dish" },
  { id: "m3", name: "Truffle Soup", price: 290, category: "Soup" },
  { id: "m4", name: "Caesar Salad", price: 220, category: "Appetizer" },
  { id: "m5", name: "Red Wine (Glass)", price: 350, category: "Beverage" },
  { id: "m6", name: "Lemon Soda", price: 80, category: "Beverage" },
  { id: "m7", name: "Pad Kra Pao", price: 150, category: "Main Dish" },
  { id: "m8", name: "Tom Yum Kung", price: 350, category: "Soup" },
];

const initialPromotions: Promotion[] = [
  {
    id: "p1",
    name: "Steak & Wine Lover",
    description: "Perfect match for dinner",
    items: [
      { name: "Wagyu Steak", qty: 1 },
      { name: "Red Wine (Glass)", qty: 2 },
    ],
    originalPrice: 1900,
    specialPrice: 1590,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2069&auto=format&fit=crop",
  },
  {
    id: "p2",
    name: "Healthy Lunch Set",
    description: "Light meal for your day",
    items: [
      { name: "Sea Bass Steak", qty: 1 },
      { name: "Caesar Salad", qty: 1 },
      { name: "Lemon Soda", qty: 1 },
    ],
    originalPrice: 890,
    specialPrice: 699,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a7270028d?q=80&w=1868&auto=format&fit=crop",
  },
];

export const ManagePromotionView = () => {
  // State
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [setName, setSetName] = useState("");
  const [description, setDescription] = useState("");
  const [specialPrice, setSpecialPrice] = useState<string>("");
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [newSetItems, setNewSetItems] = useState<SetItem[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalOriginalPrice = newSetItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  // Handlers
  const handleAddItem = () => {
    if (!selectedItemId) return;
    const item = availableMenuItems.find((i) => i.id === selectedItemId);
    if (item) {
      const existing = newSetItems.find((i) => i.id === item.id);
      if (existing) {
        setNewSetItems(
          newSetItems.map((i) =>
            i.id === item.id ? { ...i, qty: i.qty + 1 } : i
          )
        );
      } else {
        setNewSetItems([...newSetItems, { ...item, qty: 1 }]);
      }
    }
  };

  const handleEditSet = (promo: Promotion) => {
    setEditingId(promo.id);
    setSetName(promo.name);
    setDescription(promo.description);
    setSpecialPrice(promo.specialPrice.toString());
    setImagePreview(promo.image); // Set current image

    const reconstructedItems: SetItem[] = [];
    promo.items.forEach((pItem) => {
      const foundItem = availableMenuItems.find((m) => m.name === pItem.name);
      if (foundItem) {
        reconstructedItems.push({ ...foundItem, qty: pItem.qty });
      }
    });
    setNewSetItems(reconstructedItems);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setSetName("");
    setDescription("");
    setSpecialPrice("");
    setNewSetItems([]);
    setSelectedItemId("");
    setImagePreview(null);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSet = () => {
    if (!setName || newSetItems.length === 0) return;

    const payload = {
      name: setName,
      description,
      items: newSetItems.map((i) => ({ name: i.name, qty: i.qty })),
      originalPrice: totalOriginalPrice,
      specialPrice: parseFloat(specialPrice) || 0,
      image:
        imagePreview ||
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2000&auto=format&fit=crop",
      status: "Active",
    };

    if (editingId) {
      setPromotions(
        promotions.map((p) => (p.id === editingId ? { ...p, ...payload } : p))
      );
    } else {
      const newId = `p${Date.now()}`;
      setPromotions([{ id: newId, ...payload }, ...promotions]);
    }
    handleCancelEdit();
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
          <Button variant="outline" className="border-gray-200 text-gray-600">
            <CalendarDays className="w-4 h-4 mr-2" /> Filter by Date
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className={`bg-white rounded-3xl p-5 shadow-sm border transition-all duration-300 flex flex-col md:flex-row gap-6 group
                ${editingId === promo.id ? "border-[#FF5C39] ring-1 ring-[#FF5C39] bg-orange-50/10" : "border-gray-100 hover:shadow-md"}
              `}
            >
              {/* Image */}
              <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden shrink-0 relative bg-gray-100">
                <img
                  src={promo.image}
                  alt={promo.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {editingId === promo.id && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold backdrop-blur-[1px]">
                    Editing...
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-900">
                      {promo.name}
                    </h3>
                    <div className="text-right">
                      <span className="block text-sm text-gray-400 line-through decoration-red-400 decoration-2">
                        ฿{promo.originalPrice.toLocaleString()}
                      </span>
                      <span className="block text-2xl font-extrabold text-[#FF5C39]">
                        ฿{promo.specialPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mt-1 mb-4">
                    {promo.description}
                  </p>

                  {/* FIXED: Larger Tags */}
                  <div className="flex flex-wrap gap-2">
                    {promo.items.map((item, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="bg-orange-50 text-orange-800 hover:bg-orange-100 font-semibold px-4 py-1.5 text-sm rounded-lg border border-orange-100"
                      >
                        {item.qty}x {item.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-50">
                  <Button
                    onClick={() => handleEditSet(promo)}
                    disabled={editingId === promo.id}
                    className={`flex-1 border transition-colors ${editingId === promo.id ? "bg-gray-100 text-gray-400 border-transparent" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-black"}`}
                  >
                    {editingId === promo.id ? "Currently Editing" : "Edit Set"}
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 px-3"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Right Column: Create/Edit Form --- */}
      <div className="lg:col-span-1">
        <Card
          className={`shadow-xl border-none rounded-[32px] overflow-hidden sticky top-8 transition-all duration-300 ${editingId ? "ring-2 ring-[#FF5C39] shadow-orange-200" : ""}`}
        >
          <CardHeader
            className={`${editingId ? "bg-[#FF5C39]" : "bg-gray-900"} text-white p-6 transition-colors duration-300`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${editingId ? "bg-white/20" : "bg-[#FF5C39]"}`}
                >
                  {editingId ? (
                    <Pencil className="w-5 h-5 text-white" />
                  ) : (
                    <UtensilsCrossed className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <CardTitle className="text-lg">
                    {editingId ? "Update Set Menu" : "Create Pairing Set"}
                  </CardTitle>
                  <p className="text-white/70 text-xs mt-1">
                    {editingId
                      ? "Modify existing bundle"
                      : "Design a new menu combo"}
                  </p>
                </div>
              </div>
              {editingId && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="hover:bg-white/20 text-white rounded-full h-8 w-8"
                  onClick={handleCancelEdit}
                >
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-5 bg-white">
            {/* FIXED: Image Upload Section */}
            <div
              className="group relative w-full h-48 bg-gray-50 rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 hover:border-[#FF5C39] transition-all cursor-pointer flex flex-col items-center justify-center text-center"
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
                <div className="text-gray-400 group-hover:text-[#FF5C39] transition-colors">
                  <div className="p-3 bg-white rounded-full inline-block shadow-sm mb-2 group-hover:scale-110 transition-transform">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold">Click to upload image</p>
                  <p className="text-xs opacity-70">PNG, JPG up to 5MB</p>
                </div>
              )}
            </div>

            {/* Set Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="set-name"
                  className="text-gray-700 font-semibold"
                >
                  Set Name
                </Label>
                <Input
                  id="set-name"
                  value={setName}
                  onChange={(e) => setSetName(e.target.value)}
                  placeholder="e.g. Valentine's Dinner"
                  className="bg-gray-50 border-gray-200 focus:ring-[#FF5C39]"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-gray-700 font-semibold"
                >
                  Description
                </Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description..."
                  className="bg-gray-50 border-gray-200 focus:ring-[#FF5C39]"
                />
              </div>
            </div>

            {/* Menu Selection Area */}
            <div className="space-y-3 pt-2">
              <Label className="text-gray-700 font-semibold flex items-center justify-between">
                Select Menu Items
                <span className="text-xs font-normal text-gray-400">
                  Add items to bundle
                </span>
              </Label>

              <div className="flex gap-0 shadow-sm rounded-xl border border-orange-200 focus-within:ring-2 focus-within:ring-[#FF5C39] focus-within:border-transparent transition-all bg-white relative">
                <div className="flex-1">
                  <Select
                    onValueChange={setSelectedItemId}
                    value={selectedItemId}
                  >
                    <SelectTrigger className="h-12 border-none bg-transparent focus:ring-0 text-gray-700 font-medium px-4 w-full text-left">
                      <SelectValue placeholder="Search or Select a Dish..." />
                    </SelectTrigger>
                    {/* FIXED: Added z-index and background to prevent transparency overlap */}
                    <SelectContent
                      className="max-h-60 bg-white z-[9999] shadow-xl border border-gray-100"
                      position="popper"
                      sideOffset={5}
                    >
                      {availableMenuItems.map((item) => (
                        <SelectItem
                          key={item.id}
                          value={item.id}
                          className="py-3 cursor-pointer hover:bg-orange-50 focus:bg-orange-50"
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
                  className="h-12 w-14 rounded-none rounded-r-xl bg-[#FF5C39] hover:bg-orange-600 text-white flex items-center justify-center"
                >
                  <Plus className="w-6 h-6" />
                </Button>
              </div>

              {/* Selected Items List */}
              {newSetItems.length > 0 ? (
                <div className="bg-gray-50 rounded-xl p-3 space-y-2 mt-2 border border-gray-100 animate-in slide-in-from-top-2">
                  {newSetItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center text-sm bg-white p-3 rounded-lg shadow-sm border border-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 bg-orange-100 text-[#FF5C39] rounded-full flex items-center justify-center text-xs font-bold">
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
                              newSetItems.filter((i) => i.id !== item.id)
                            )
                          }
                          className="text-gray-300 hover:text-red-500 transition-colors"
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
              ) : (
                <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                  <p className="text-sm font-medium text-gray-400">
                    No items selected
                  </p>
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
                <Label className="text-[#FF5C39] text-xs uppercase font-bold">
                  Set Price
                </Label>
                <Input
                  type="number"
                  value={specialPrice}
                  onChange={(e) => setSpecialPrice(e.target.value)}
                  placeholder="0.00"
                  className="h-12 bg-orange-50 border-orange-200 text-orange-700 font-bold text-xl focus:ring-[#FF5C39] placeholder:text-orange-200/50"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-6 pt-0 bg-white grid gap-3">
            <Button
              onClick={handleSaveSet}
              className={`w-full h-12 rounded-xl text-lg font-bold shadow-lg transition-all active:scale-95
                    ${
                      editingId
                        ? "bg-[#FF5C39] hover:bg-orange-600 shadow-orange-200 text-white"
                        : "bg-gray-900 hover:bg-black text-white shadow-gray-300"
                    }
                `}
            >
              {editingId ? "Update Changes" : "Create Promotion"}
            </Button>
            {editingId && (
              <Button
                variant="ghost"
                onClick={handleCancelEdit}
                className="w-full text-gray-500 hover:text-gray-800"
              >
                Cancel Editing
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
