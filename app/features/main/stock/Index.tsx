"use client";
import { useEffect, useState } from "react";

import { StockModal } from "@/app/components/featureComponents/StockModal";
import { Icons } from "@/app/icons";

import { StockCard } from "./components/StockCard";
// Import Custom Components
import { StockFilterBar } from "./components/StockFilterBar";
import { StockHistory, StockHistoryItem } from "./components/StockHistory";

// --- Type Definition ---
interface StockItem {
  id: string;
  imgUrl: string | null;
  title: string;
  amount: number;
  unit: string;
  category: string;
  isAvailable: boolean;
}

// --- Mock API Service (ใช้สำหรับทดสอบ) ---
const fetchStockData = async () => {
  // จำลอง Network Delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    items: [
      {
        id: "1",
        imgUrl:
          "https://images.unsplash.com/photo-1606728035784-c8a1678d2b27?auto=format&fit=crop&w=400",
        title: "Pork Belly",
        amount: 30,
        unit: "kg.",
        category: "Pork",
      },
      {
        id: "2",
        imgUrl:
          "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400",
        title: "Tomato",
        amount: 25,
        unit: "pcs.",
        category: "Vegetable",
      },
      {
        id: "3",
        imgUrl:
          "https://images.unsplash.com/photo-1587486913049-53fc88980fa1?auto=format&fit=crop&w=400",
        title: "Egg No.0",
        amount: 100,
        unit: "pcs.",
        category: "Egg",
      },
      {
        id: "4",
        imgUrl:
          "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&w=400",
        title: "Salmon",
        amount: 6,
        unit: "kg.",
        category: "Fish",
      },
    ] as StockItem[],
    history: [
      {
        id: "h1",
        itemCode: "Ingredient # 000099",
        imgUrl:
          "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&w=200",
        title: "Salmon",
        action: "Added",
        date: "10/03/2025",
        time: "05:48",
        amountChange: 6,
        unit: "kg.",
      },
      {
        id: "h2",
        itemCode: "Ingredient # 000009",
        imgUrl:
          "https://images.unsplash.com/photo-1606728035784-c8a1678d2b27?auto=format&fit=crop&w=200",
        title: "Pork Belly",
        action: "Consumed",
        date: "09/03/2025",
        time: "10:12",
        amountChange: -10,
        unit: "kg.",
      },
      {
        id: "h3",
        itemCode: "Ingredient # 000009",
        imgUrl:
          "https://images.unsplash.com/photo-1606728035784-c8a1678d2b27?auto=format&fit=crop&w=200",
        title: "Pork Belly",
        action: "Consumed",
        date: "09/03/2025",
        time: "10:12",
        amountChange: -10,
        unit: "kg.",
      },
      {
        id: "h3",
        itemCode: "Ingredient # 000009",
        imgUrl:
          "https://images.unsplash.com/photo-1606728035784-c8a1678d2b27?auto=format&fit=crop&w=200",
        title: "Pork Belly",
        action: "Consumed",
        date: "09/03/2025",
        time: "10:12",
        amountChange: -10,
        unit: "kg.",
      },
      {
        id: "h3",
        itemCode: "Ingredient # 000009",
        imgUrl:
          "https://images.unsplash.com/photo-1606728035784-c8a1678d2b27?auto=format&fit=crop&w=200",
        title: "Pork Belly",
        action: "Consumed",
        date: "09/03/2025",
        time: "10:12",
        amountChange: -10,
        unit: "kg.",
      },
      {
        id: "h3",
        itemCode: "Ingredient # 000009",
        imgUrl:
          "https://images.unsplash.com/photo-1606728035784-c8a1678d2b27?auto=format&fit=crop&w=200",
        title: "Pork Belly",
        action: "Consumed",
        date: "09/03/2025",
        time: "10:12",
        amountChange: -10,
        unit: "kg.",
      },
      {
        id: "h3",
        itemCode: "Ingredient # 000009",
        imgUrl:
          "https://images.unsplash.com/photo-1606728035784-c8a1678d2b27?auto=format&fit=crop&w=200",
        title: "Pork Belly",
        action: "Consumed",
        date: "09/03/2025",
        time: "10:12",
        amountChange: -10,
        unit: "kg.",
      },
      {
        id: "h3",
        itemCode: "Ingredient # 000009",
        imgUrl:
          "https://images.unsplash.com/photo-1606728035784-c8a1678d2b27?auto=format&fit=crop&w=200",
        title: "Pork Belly",
        action: "Consumed",
        date: "09/03/2025",
        time: "10:12",
        amountChange: -10,
        unit: "kg.",
      },
    ] as StockHistoryItem[],
  };
};

const CATEGORIES = [
  "All ingredient",
  "Pork",
  "Beef",
  "Chicken",
  "Fish",
  "Seafood",
  "Vegetable",
  "Fruit",
  "Beverage",
  "Others",
];

const StockRender = () => {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [historyItems, setHistoryItems] = useState<StockHistoryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All ingredient");
  const [isLoading, setIsLoading] = useState(true);

  // --- State สำหรับควบคุม Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);

  // --- Event Handlers ---
  // เปิด Modal สำหรับเพิ่มใหม่
  const handleOpenAddModal = () => {
    setEditingItem(null); // เคลียร์ค่าให้เป็น null เพื่อบอก Modal ว่าคือ "Add Mode"
    setIsModalOpen(true);
  };

  // เปิด Modal สำหรับแก้ไข
  const handleOpenEditModal = (item: StockItem) => {
    setEditingItem(item); // ส่งข้อมูล Item ไปเพื่อให้ Modal รู้ว่าเป็น "Edit Mode"
    setIsModalOpen(true);
  };

  const handleSaveStock = (formData: any) => {
    if (editingItem) {
      // Logic สำหรับ Update (Edit)
      setStockItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id ? { ...item, ...formData } : item
        )
      );
      console.log("Updated item:", formData);
    } else {
      // Logic สำหรับ Insert (Add)
      const newItem: StockItem = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9), // Mock ID
        isAvailable: true,
        category: "Others", // หรือรับค่าจาก Modal ถ้ามี
      };
      setStockItems((prev) => [newItem, ...prev]);
      console.log("Added new item:", newItem);
    }
    setIsModalOpen(false);
  };

  // --- API Fetching ---
  useEffect(() => {
    const initData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchStockData(); // เรียก API จริงตรงนี้
        setStockItems(data.items);
        setHistoryItems(data.history);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initData();
  }, []);

  // ฟังก์ชันสำหรับเปิด-ปิดสถานะ
  const handleToggleStatus = (id: string) => {
    setStockItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );

    // ตรงนี้อาจจะไปเรียก API เพื่อ Update Database จริงๆ ด้วย
    const item = stockItems.find((i) => i.id === id);
    console.log(
      `${item?.title} is now ${!item?.isAvailable ? "Open" : "Closed"}`
    );
  };

  // --- Filtering Logic ---
  const filteredItems =
    selectedCategory === "All ingredient"
      ? stockItems
      : stockItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-black tracking-tight">
            Stock
          </h1>
          <h2 className="text-xl font-medium text-gray-600 mt-1">Categories</h2>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="bg-primary-orange-main hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
        >
          <Icons name="PlusIcon" className="w-5 h-5 text-white" />
          Add Ingredient
        </button>
      </div>

      {/* 2. Main Content Layout */}
      <div className="flex flex-col xl:flex-row gap-6 items-start">
        {/* Left Side: Filter & Grid */}
        <div className="flex-1 w-full flex flex-col gap-6">
          {/* Filter Bar Component */}
          <StockFilterBar
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <StockCard
                  key={item.id}
                  id={item.id}
                  imgUrl={item.imgUrl}
                  title={item.title}
                  amount={item.amount}
                  unit={item.unit}
                  isAvailable={item.isAvailable} // ส่งสถานะไป
                  onEdit={() => handleOpenEditModal(item)}
                  onToggleStatus={() => handleToggleStatus(item.id)} // ใช้ฟังก์ชันใหม่
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Side: History Component */}
        <StockHistory historyItems={historyItems} />
      </div>

      <StockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        stockItem={editingItem}
        onSave={handleSaveStock}
      />
    </div>
  );
};

export default StockRender;
