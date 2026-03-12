"use client";
import { useEffect, useRef, useState } from "react";

import { MenuDrawer } from "@/app/features/main/menu/components/MenuDrawer";
import { Icons } from "@/app/icons";
import {
  createMenuWithImage,
  deleteMenu,
  getMenus,
  updateMenuWithImage,
} from "@/services/menu/menuApi";
import { getMenuTags } from "@/services/menu/menuTagApi";
import { getIngredients } from "@/services/stock/stockApi";
import { IMenuResponse } from "@/types/menuType";

import { MenuAddTagDrawer } from "./components/MenuAddTagDrawer";
import { MenuCard } from "./components/MenuCard";
import { MenuEditTagDrawer } from "./components/MenuEditTagDrawer";
import { MenuFilterBar } from "./components/MenuFilterBar";

// --- Types ---
export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}
export interface IMenuItem {
  id: number;
  image_url: string | null;
  name: string;
  price: number;
  currency: string;
  ingredients: Ingredient[];
  tags: { tag_id: number; name: string }[];
  status: number;
}

export default function MenuRender() {
  const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);

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

  // State สำหรับเก็บ Master Data ไว้ map ID
  const [stockIngredients, setStockIngredients] = useState<any[]>([]);
  const [availableTags, setAvailableTags] = useState<any[]>([]);

  // --- Filtering Logic ---
  const filteredItems =
    selectedCategory === ALL_CATEGORY
      ? menuItems
      : menuItems.filter((item) =>
          item.tags.some((tag) => tag.name === selectedCategory)
        );

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
  const handleToggleStatus = (id: number) => {
    setMenuItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, status: item.status === 0 ? 1 : 0 } // สมมติ 0=Open, 1=Closed
          : item
      )
    );

    // ตรงนี้อาจจะไปเรียก API เพื่อ Update Database จริงๆ ด้วย
    const item = menuItems.find((i) => i.id === id);
    // Logic เรียก API update status (ถ้ามี)
    console.log(`Toggled status for ${item?.name}`);
  };

  const handleSaveMenu = async (formData: any, file: File | null) => {
    try {
      // --- 1. เตรียมข้อมูล Payload (ใช้ร่วมกันทั้ง Create และ Update) ---

      // Map Tags
      const mappedTags = formData.tags
        .map((tagName: string) => {
          const foundTag = availableTags.find((t) => t.name === tagName);
          return foundTag ? { tag_id: foundTag.id } : null;
        })
        .filter(Boolean);

      // Map Ingredients
      const mappedIngredients = formData.ingredients
        .map((ing: any) => {
          const foundIng = stockIngredients.find((s) => s.name === ing.name);
          return foundIng
            ? { ingredient_id: foundIng.id, amount: Number(ing.amount) }
            : null;
        })
        .filter(Boolean);

      // สร้าง Payload ตาม Interface IUpdateMenuRequest / ICreateMenuRequest
      const apiPayload = {
        name: formData.name,
        price: Number(formData.amount),
        ingredients: mappedIngredients,
        tags: mappedTags,
        display_name: formData.name,
        description: "รายละเอียดเมนู",
      };

      // --- 2. เช็คว่าเป็น Update หรือ Create ---
      if (editingItem) {
        // --- Logic Update ---
        // เรียก Service Update พร้อมส่ง ID ของเมนูที่กำลังแก้ไขไป
        await updateMenuWithImage(editingItem.id, apiPayload, file);
      } else {
        // --- Logic Create ---
        await createMenuWithImage(apiPayload, file);
      }

      // --- 3. Refresh Data หลังจาก Save/Update สำเร็จ ---
      await fetchMenusData();
    } catch (error) {
      console.error("Failed to save menu", error);
      alert("Failed to save menu");
    }

    setIsModalOpen(false);
  };

  const handleDeleteMenu = async (id: number) => {
    try {
      // เรียก Service
      await deleteMenu(id);

      console.log("Deleted successfully");

      // Update UI: ลบออกจาก State ทันทีไม่ต้องรอ fetch ใหม่ (Optimistic update)
      setMenuItems((prev) => prev.filter((item) => item.id !== id));

      // ปิด Modal (เผื่อไว้ กรณีเรียกจากที่อื่น)
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Failed to delete menu", error);
      alert("Failed to delete menu");
    }
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
        setAvailableTags(tagsData); // <-- เก็บ Master Data ไว้ส่งให้ Drawer
        const tagNames = tagsData.map((tag: any) => tag.name);
        setCategories([ALL_CATEGORY, ...tagNames]);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const fetchIngredientsData = async () => {
    try {
      const res: any = await getIngredients();
      if (res && res.data && Array.isArray(res.data)) {
        setStockIngredients(res.data); // <-- เก็บ Master Data ไว้ส่งให้ Drawer
      }
    } catch (error) {
      console.error("Error fetching ingredients:", error);
    }
  };

  const handleTagUpdated = async () => {
    await fetchTagsData(); // Refresh dropdown
  };

  const fetchMenusData = async () => {
    try {
      const res = await getMenus();

      if (res && res.data && Array.isArray(res.data)) {
        const apiData: IMenuResponse[] = res.data;

        // แปลงข้อมูลจาก API ให้เข้ากับหน้าบ้าน (UI)
        const mappedMenus: IMenuItem[] = apiData.map((item) => ({
          id: item.id,
          image_url: item.image_url === "string" ? null : item.image_url, // เช็คถ้าเป็นค่า default "string" ให้เป็น null
          name: item.name,
          price: item.price,
          currency: "บาท",
          // Map Ingredients
          ingredients: item.ingredients
            ? item.ingredients.map((ing) => ({
                name: ing.ingredient.name,
                amount: ing.amount,
                unit: ing.ingredient.unit,
              }))
            : [],
          // API ส่ง tags: {tag_id, name}[] เราใช้ตามนั้นเลย
          tags: item.tags || [],
          status: item.status, // ใช้ status ตรงๆ (0, 1)
        }));

        setMenuItems(mappedMenus);
      }
    } catch (error) {
      console.error("Error fetching menus:", error);
    }
  };

  // --- API Fetching ---
  useEffect(() => {
    const initData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          fetchMenusData(),
          fetchTagsData(),
          fetchIngredientsData(),
        ]);
      } catch (error) {
        console.error("Error initializing data:", error);
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
              className="bg-white border border-primary-orange-main text-primary-orange-main hover:bg-orange-50 px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <Icons
                name="SettingIcon"
                className="w-5 h-5 text-primary-orange-main"
              />
              Manage Category
              <Icons
                name="ArrowDownIcon"
                className={`w-5 h-5 text-primary-orange-main transition-transform ${isCategoryMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown Menu */}
            {isCategoryMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <button
                  onClick={() => {
                    setIsTagDrawerOpen(true);
                    setIsCategoryMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-orange-50 text-gray-700 font-medium flex items-center gap-2"
                >
                  <Icons
                    name="PlusIcon"
                    className="w-4 h-4 text-primary-orange-main"
                  />
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
                  <Icons
                    name="PencilIcon"
                    className="w-4 h-4 text-primary-orange-main"
                  />
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-6">
              {filteredItems.map((item) => (
                <MenuCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  image_url={item.image_url}
                  price={item.price}
                  currency={item.currency}
                  ingredients={item.ingredients}
                  status={item.status === 0}
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
      </div>

      <MenuDrawer
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        menuItem={editingItem as any}
        onSave={handleSaveMenu}
        onDelete={handleDeleteMenu}
        availableTags={availableTags}
        availableIngredients={stockIngredients}
      />

      {/* Add Tag Drawer */}
      <MenuAddTagDrawer
        isOpen={isTagDrawerOpen}
        onClose={() => setIsTagDrawerOpen(false)}
        onSuccess={handleTagUpdated}
      />

      {/* Edit Tag Drawer */}
      <MenuEditTagDrawer
        isOpen={isEditTagDrawerOpen}
        onClose={() => setIsEditTagDrawerOpen(false)}
        onSuccess={handleTagUpdated}
      />
    </div>
  );
}
