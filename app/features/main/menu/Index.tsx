"use client";
import { useEffect, useRef, useState } from "react";

import { MenuModal } from "@/app/features/main/menu/components/MenuModal";
import { Icons } from "@/app/icons";
import { getMenuTags } from "@/services/menu/menuTagApi";

import { MenuAddTagDrawer } from "./components/MenuAddTagDrawer";
import { MenuCard } from "./components/MenuCard";
import { MenuFilterBar } from "./components/MenuFilterBar";
import { MenuHistory, MenuHistoryItem } from "./components/MenuHistory";

// --- Types ---
export interface Ingredient {
  title: string;
  amount: number;
}
export interface IMenuItem {
  id: string;
  imgUrl: string | null;
  title: string;
  price: number;
  currency: string;
  ingredients: Ingredient[];
  category: string[];
  isAvailable: boolean;
}

// --- Mock API Service (ใช้สำหรับทดสอบ) ---
const fetchMenuData = async () => {
  // จำลอง Network Delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    items: [
      {
        id: "1",
        imgUrl:
          "https://images.unsplash.com/photo-1606728035784-c8a1678d2b27?auto=format&fit=crop&w=400",
        title: "Soi Ju Muu",
        price: 150,
        currency: "Baht",
        category: ["Pork"],
        ingredients: [],
        isAvailable: true,
      },
      {
        id: "2",
        imgUrl:
          "https://images.unsplash.com/photo-1606728035784-c8a1678d2b27?auto=format&fit=crop&w=400",
        title: "Soi Ju Muu",
        price: 150,
        currency: "Baht",
        category: ["Pork"],
        ingredients: [],
        isAvailable: true,
      },
      {
        id: "3",
        imgUrl:
          "https://images.unsplash.com/photo-1606728035784-c8a1678d2b27?auto=format&fit=crop&w=400",
        title: "Soi Ju Muu",
        price: 150,
        currency: "Baht",
        category: ["Pork"],
        ingredients: [],
        isAvailable: true,
      },
      {
        id: "4",
        imgUrl:
          "https://images.unsplash.com/photo-1606728035784-c8a1678d2b27?auto=format&fit=crop&w=400",
        title: "Soi Ju Muu",
        price: 150,
        currency: "Baht",
        category: ["Pork"],
        ingredients: [],
        isAvailable: true,
      },
    ] as IMenuItem[],
    history: [
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
    ] as MenuHistoryItem[],
  };
};

export default function MenuRender() {
  const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);
  const [historyItems, setHistoryItems] = useState<MenuHistoryItem[]>([]);

  const ALL_CATEGORY = "All menu";
  const [categories, setCategories] = useState<string[]>([ALL_CATEGORY]);
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY);

  const [isLoading, setIsLoading] = useState(true);

  // --- State สำหรับควบคุม Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IMenuItem | null>(null);

  // --- Tag Drawer States ---
  const [isTagDrawerOpen, setIsTagDrawerOpen] = useState(false); // For Add
  const [isEditTagDrawerOpen, setIsEditTagDrawerOpen] = useState(false); // For Edit

  // --- Menu Dropdown State (Manage Categories) ---
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  // --- Filtering Logic ---
  const filteredItems =
    selectedCategory === ALL_CATEGORY
      ? menuItems
      : menuItems.filter((item) => item.category.includes(selectedCategory));

  // --- Event Handlers ---
  // เปิด Modal สำหรับเพิ่มใหม่
  const handleOpenAddModal = () => {
    setEditingItem(null); // เคลียร์ค่าให้เป็น null เพื่อบอก Modal ว่าคือ "Add Mode"
    setIsModalOpen(true);
  };

  // เปิด Modal สำหรับแก้ไข
  const handleOpenEdit = (item: IMenuItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  // ฟังก์ชันสำหรับเปิด-ปิดสถานะ
  const handleToggleStatus = (id: string) => {
    setMenuItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );

    // ตรงนี้อาจจะไปเรียก API เพื่อ Update Database จริงๆ ด้วย
    const item = menuItems.find((i) => i.id === id);
    console.log(
      `${item?.title} is now ${!item?.isAvailable ? "Open" : "Closed"}`
    );
  };

  const handleSaveMenu = (formData: any) => {
    if (editingItem) {
      // Logic สำหรับ Update (Edit)
      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id ? { ...item, ...formData } : item
        )
      );
      console.log("Updated item:", formData);
    } else {
      // Logic สำหรับ Insert (Add)
      const newItem: IMenuItem = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9), // Mock ID
        isAvailable: true,
        category: "Others", // หรือรับค่าจาก Modal ถ้ามี
      };
      setMenuItems((prev) => [newItem, ...prev]);
      console.log("Added new item:", newItem);
    }
    setIsModalOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryMenuRef.current &&
        !categoryMenuRef.current.contains(event.target as Node)
      ) {
        setIsCategoryMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // แยกฟังก์ชันดึง Tags ออกมาเพื่อให้เรียกซ้ำได้ (Refetch)
  const fetchTagsData = async () => {
    try {
      const tagsData = await getMenuTags();
      if (tagsData && Array.isArray(tagsData)) {
        const tagNames = tagsData.map((tag: any) => tag.name);
        setCategories([ALL_CATEGORY, ...tagNames]);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const handleTagUpdated = async () => {
    await fetchTagsData(); // Refresh dropdown
  };

  // --- API Fetching ---
  useEffect(() => {
    const initData = async () => {
      try {
        setIsLoading(true);
        // เรียก Stock Data และ Tags พร้อมกัน
        const [stockData] = await Promise.all([
          fetchMenuData(),
          fetchTagsData(), // เรียกฟังก์ชันที่แยกออกมา
        ]);

        setMenuItems(stockData.items);
        setHistoryItems(stockData.history);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initData();
  }, []);

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

        <div className="flex gap-3 relative z-10">
          {/* Manage Category Dropdown */}
          <div className="relative" ref={categoryMenuRef}>
            <button
              onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <Icons name="SettingIcon" className="w-5 h-5 text-gray-600" />
              Manage Category
              <Icons
                name="ArrowDownIcon"
                className={`w-4 h-4 transition-transform ${isCategoryMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown Menu */}
            {isCategoryMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <button
                  onClick={() => {
                    setIsTagDrawerOpen(true);
                    setIsCategoryMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-orange-50 text-gray-700 font-medium flex items-center gap-2"
                >
                  <Icons name="PlusIcon" className="w-4 h-4" />
                  New Category
                </button>
                <div className="h-px bg-gray-100 mx-2" />
                <button
                  onClick={() => {
                    setIsEditTagDrawerOpen(true);
                    setIsCategoryMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-orange-50 text-gray-700 font-medium flex items-center gap-2"
                >
                  <Icons name="PencilIcon" className="w-4 h-4" />
                  Edit Category
                </button>
              </div>
            )}
          </div>

          {/* Add Menu Button */}
          <button
            onClick={handleOpenAddModal}
            className="bg-primary-orange-main hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            <Icons name="PlusIcon" className="w-5 h-5 text-white" />
            Add Menu
          </button>
        </div>
      </div>

      {/* 2. Main Content Layout */}
      <div className="flex flex-col xl:flex-row gap-6 items-start">
        {/* Left Side: Filter & Grid */}
        <div className="flex-1 w-full flex flex-col gap-6">
          {/* Filter Bar Component */}
          <MenuFilterBar
            categories={categories}
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
                  imgUrl={item.imgUrl}
                  title={item.title}
                  price={item.price}
                  currency={item.currency}
                  ingredients={item.ingredients}
                  isAvailable={item.isAvailable}
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
        <div>
          <MenuHistory historyItems={historyItems} />
        </div>
      </div>

      <MenuModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        menuItem={editingItem}
        onSave={handleSaveMenu}
      />

      {/* Add Tag Drawer */}
      <MenuAddTagDrawer
        isOpen={isTagDrawerOpen}
        onClose={() => setIsTagDrawerOpen(false)}
        onSuccess={handleTagUpdated}
      />

      {/* Edit Tag Drawer */}
      <MenuAddTagDrawer
        isOpen={isEditTagDrawerOpen}
        onClose={() => setIsEditTagDrawerOpen(false)}
        onSuccess={handleTagUpdated}
      />
    </div>
  );
}
