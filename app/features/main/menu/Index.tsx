"use client";
import { useMemo, useState } from "react";

import { MenuModal } from "@/app/components/featureComponents/MenuModal";
import { Icons } from "@/app/icons";

import { MenuCard } from "./components/MenuCard";
import { MenuFilterBar } from "./components/MenuFilterBar";
import { MenuHistory, MenuHistoryItem } from "./components/MenuHistory";

// --- Types ---
export interface Ingredient {
  title: string;
  amount: number;
}

export interface MenuItem {
  id: string;
  imgUrl: string | null;
  title: string;
  amount: number; // Price
  unit: string; // Currency
  ingredients: Ingredient[];
  category: string;
  isAvailable: boolean;
}

const CATEGORIES = [
  "All menu",
  "Appetizer",
  "Main Dish",
  "Dessert",
  "Beverage",
  "Stir Fried",
  "Fried",
  "Grilled",
  "Soup",
  "Steam",
  "Seafood",
  "Other",
];

// Mock Data History
const MOCK_HISTORY: MenuHistoryItem[] = [
  {
    id: "h1",
    menuIdDisplay: "10/03/2025",
    title: "Wagyu Steak",
    imgUrl: "https://images.unsplash.com/photo-1546241072-48010ad28c2c",
    action: "New",
    date: "10/03/2025",
    time: "18:00",
  },
  {
    id: "h2",
    menuIdDisplay: "Menu # 000121",
    title: "Sea Bass Steak",
    imgUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2",
    action: "Edited",
    date: "10/03/2025",
    time: "17:48",
  },
  {
    id: "h3",
    menuIdDisplay: "Menu # 000052",
    title: "Wine",
    imgUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3",
    action: "Deleted",
    date: "08/03/2025",
    time: "07:19",
  },
];

export default function MenuRender() {
  // State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All menu");
  const [isLoading, setIsLoading] = useState(false); // เพิ่ม isLoading State

  // History State (ถ้าต้องการให้ update ได้ในอนาคต)
  const [historyItems, setHistoryItems] =
    useState<MenuHistoryItem[]>(MOCK_HISTORY);

  // Mock Data (แยกขาดจาก Stock)
  const [menus, setMenus] = useState<MenuItem[]>([
    {
      id: "1",
      title: "Sea Bass Steak",
      amount: 350,
      unit: "Baht",
      imgUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2",
      ingredients: [{ title: "Fish", amount: 1 }],
      category: "Main Dish",
      isAvailable: true,
    },
    {
      id: "2",
      title: "Wagyu Steak",
      amount: 1200,
      unit: "Baht",
      imgUrl: "https://images.unsplash.com/photo-1546241072-48010ad28c2c",
      ingredients: [{ title: "Wagyu", amount: 1 }],
      category: "Grilled",
      isAvailable: true,
    },
    {
      id: "3",
      title: "Sea Bass Steak",
      amount: 350,
      unit: "Baht",
      imgUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2",
      ingredients: [{ title: "Fish", amount: 1 }],
      category: "Main Dish",
      isAvailable: true,
    },
    {
      id: "4",
      title: "Wagyu Steak",
      amount: 1200,
      unit: "Baht",
      imgUrl: "https://images.unsplash.com/photo-1546241072-48010ad28c2c",
      ingredients: [{ title: "Wagyu", amount: 1 }],
      category: "Grilled",
      isAvailable: true,
    },
    {
      id: "5",
      title: "Sea Bass Steak",
      amount: 350,
      unit: "Baht",
      imgUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2",
      ingredients: [{ title: "Fish", amount: 1 }],
      category: "Main Dish",
      isAvailable: true,
    },
    {
      id: "6",
      title: "Wagyu Steak",
      amount: 1200,
      unit: "Baht",
      imgUrl: "https://images.unsplash.com/photo-1546241072-48010ad28c2c",
      ingredients: [{ title: "Wagyu", amount: 1 }],
      category: "Grilled",
      isAvailable: true,
    },
  ]);

  // --- Logic for Filtering ---
  const filteredItems = useMemo(() => {
    if (selectedCategory === "All menu") {
      return menus;
    }
    return menus.filter((item) => item.category === selectedCategory);
  }, [menus, selectedCategory]);

  // --- Handlers ---
  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleToggleStatus = (id: string) => {
    setMenus((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isAvailable: !m.isAvailable } : m))
    );
  };

  const handleSave = (data: any) => {
    if (editingItem) {
      // Edit Mode
      setMenus((prev) =>
        prev.map((m) => (m.id === editingItem.id ? { ...m, ...data } : m))
      );
      // Optional: Add to History here
    } else {
      // Add Mode
      const newItem = {
        ...data,
        id: Date.now().toString(),
        isAvailable: true,
        // ถ้า Modal ไม่ได้ส่ง category มา ให้ default ไว้ก่อน หรือบังคับเลือกใน Modal
        category: data.category || "Other",
      };
      setMenus((prev) => [...prev, newItem]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-black tracking-tight">
            Menu
          </h1>
          <h2 className="text-xl font-medium text-gray-600 mt-1">Categories</h2>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-[#FF5C39] hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95"
        >
          <Icons name="PlusIcon" className="w-5 h-5 text-white" />
          Add Menu
        </button>
      </div>

      {/* 2. Main Content Layout */}
      <div className="flex flex-col xl:flex-row gap-6 items-start">
        {/* Left Side: Filter & Grid */}
        <div className="flex-1 w-full flex flex-col gap-6">
          {/* Filter Bar Component */}
          <MenuFilterBar
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* Grid Area */}
          {isLoading ? (
            <div className="w-full h-60 flex items-center justify-center text-gray-400">
              Loading...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 place-items-center sm:place-items-start">
              {filteredItems.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item} // ส่งทั้ง item object ไปเลยตาม Interface ของ MenuCard
                  onEdit={() => handleOpenEdit(item)}
                  onToggleStatus={() => handleToggleStatus(item.id)}
                />
              ))}

              {filteredItems.length === 0 && (
                <div className="col-span-full w-full py-10 text-center text-gray-400">
                  No menu items found in this category.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: History Component */}
        <div className="w-full xl:w-[400px] shrink-0">
          <MenuHistory historyItems={historyItems} />
        </div>
      </div>

      <MenuModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        menuItem={editingItem}
        onSave={handleSave}
      />
    </div>
  );
}
