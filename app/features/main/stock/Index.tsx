"use client";
import { useEffect, useRef, useState } from "react";

import { StockDrawer } from "@/app/features/main/stock/components/StockDrawer";
import { Icons } from "@/app/icons";
import {
  createIngredientWithImage,
  deleteIngredient,
  getIngredients,
  updateIngredientWithImage,
} from "@/services/stock/stockApi";
import { getStockTags } from "@/services/stock/stockTagApi";
import {
  IIngredientResponse,
  IUpdateIngredientRequest,
} from "@/types/stockType";

import { StockAddTagDrawer } from "./components/StockAddTagDrawer";
import { StockCard } from "./components/StockCard";
import { StockEditTagDrawer } from "./components/StockEditTagDrawer";
import { StockFilterBar } from "./components/StockFilterBar";

// --- Type Definition (ปรับให้ตรงกับ Backend) ---
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

const StockRender = () => {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);

  const ALL_CATEGORY = "All ingredient";
  const [categories, setCategories] = useState<string[]>([ALL_CATEGORY]);
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY);

  const [isLoading, setIsLoading] = useState(true);

  // --- State สำหรับควบคุม Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);

  // --- Tag Drawer States ---
  const [isTagDrawerOpen, setIsTagDrawerOpen] = useState(false);
  const [isEditTagDrawerOpen, setIsEditTagDrawerOpen] = useState(false);

  // --- Menu Dropdown State ---
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  // State สำหรับเก็บ Tag ทั้งหมด
  const [allTags, setAllTags] = useState<{ id: number; name: string }[]>([]);

  // --- Filtering Logic ---
  const filteredItems =
    selectedCategory === ALL_CATEGORY
      ? stockItems
      : stockItems.filter((item) =>
          item.tags.some((tag) => tag.name === selectedCategory)
        );

  // --- Event Handlers ---
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: StockItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleToggleStatus = (id: number) => {
    setStockItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, status: item.status === 0 ? 1 : 0 } // สมมติ 0=Open, 1=Closed
          : item
      )
    );

    const item = stockItems.find((i) => i.id === id);
    // Logic เรียก API update status (ถ้ามี)
    console.log(`Toggled status for ${item?.name}`);
  };

  const handleSaveStock = async (payload: any, file: File | null) => {
    // หมายเหตุ: payload ที่ส่งมาจาก StockDrawer ควรจะเปลี่ยน key ให้ตรงกันด้วย
    // หรือถ้า Drawer ยังส่งเป็น title/amount อยู่ ให้ map ตรงนี้ครับ
    // แต่เพื่อให้ตรงตาม Requirement ผมสมมติว่าเรา map ให้เป็น name/stock แล้ว

    // สร้าง Request Body ให้ตรงกับ IUpdateIngredientRequest / ICreateIngredientRequest
    const apiPayload: IUpdateIngredientRequest = {
      name: payload.name || payload.title, // รองรับทั้งชื่อใหม่และชื่อเก่า (เผื่อ Drawer ยังไม่แก้)
      stock: Number(payload.stock ?? payload.amount), // รองรับทั้งสองชื่อ
      unit: payload.unit,
      description: payload.description || "",
      // แปลง tags ให้เหลือแค่ { tag_id } ตามที่ API ต้องการ
      tags: payload.tags
        ? payload.tags.map((t: any) => ({
            tag_id: Number(t.tag_id || t.id), // รองรับทั้ง id และ tag_id
          }))
        : payload.category
          ? payload.category.map((c: any) => ({ tag_id: Number(c.id) }))
          : [],
    };

    try {
      if (editingItem) {
        // --- Logic Edit ---
        const res = await updateIngredientWithImage(
          editingItem.id,
          apiPayload,
          file
        );

        if (res && (res.statusCode === 200 || res.statusCode === 204)) {
          console.log("Updated successfully");
          await fetchIngredientsData();
        }
      } else {
        // --- Logic Add ---
        // type casting as any เพื่อเลี่ยง strict check เนื่องจาก create ใช้ interface เดียวกัน
        const res = await createIngredientWithImage(apiPayload as any, file);

        if (res && (res.statusCode === 200 || res.statusCode === 201)) {
          console.log("Created successfully");
          await fetchIngredientsData();
        }
      }
    } catch (error) {
      console.error("Failed to save ingredient", error);
      alert("Failed to save ingredient");
    }

    setIsModalOpen(false);
  };

  const handleDeleteIngredient = async (id: number) => {
    try {
      // เรียก Service
      await deleteIngredient(id);

      console.log("Deleted successfully");

      // Update UI: ลบออกจาก State ทันทีไม่ต้องรอ fetch ใหม่ (Optimistic update)
      // หรือจะเรียก fetchIngredientsData() อีกรอบก็ได้ครับ
      setStockItems((prev) => prev.filter((item) => item.id !== id));

      // ปิด Modal (เผื่อไว้ กรณีเรียกจากที่อื่น)
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Failed to delete ingredient", error);
      alert("Failed to delete ingredient");
    }
  };

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

  const fetchTagsData = async () => {
    try {
      const tagsData = await getStockTags();
      if (tagsData && Array.isArray(tagsData)) {
        const tagNames = tagsData.map((tag: any) => tag.name);
        setCategories([ALL_CATEGORY, ...tagNames]);

        const formattedTags = tagsData.map((tag: any) => ({
          id: tag.id || tag.tag_id,
          name: tag.name,
        }));
        setAllTags(formattedTags);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const handleTagUpdated = async () => {
    await fetchTagsData();
  };

  const fetchIngredientsData = async () => {
    try {
      const res = await getIngredients();

      if (res && res.data && Array.isArray(res.data)) {
        const apiData: IIngredientResponse[] = res.data;

        // Map API Data -> UI State (ชื่อตรงกันแล้ว Map ง่ายขึ้น)
        const mappedItems: StockItem[] = apiData.map((item) => ({
          id: item.id,
          image_url: item.image_url === "string" ? null : item.image_url,
          name: item.name,
          stock: item.stock,
          unit: item.unit,
          description: item.description,
          // API ส่ง tags: {tag_id, name}[] เราใช้ตามนั้นเลย
          tags: item.tags || [],
          status: item.status, // ใช้ status ตรงๆ (0, 1)
        }));

        setStockItems(mappedItems);
      }
    } catch (error) {
      console.error("Error fetching ingredients:", error);
    }
  };

  useEffect(() => {
    const initData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([fetchIngredientsData(), fetchTagsData()]);
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
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-black tracking-tight">
            Stock
          </h1>
          <h2 className="text-xl font-medium text-gray-600 mt-1">Categories</h2>
        </div>

        <div className="flex gap-3 relative z-10">
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
                className={`w-5 h-5 text-primary-orange-main transition-transform ${
                  isCategoryMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isCategoryMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
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

          <button
            onClick={handleOpenAddModal}
            className="bg-primary-orange-main hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            <Icons name="PlusIcon" className="w-5 h-5 text-white" />
            Add Ingredient
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 items-start">
        <div className="flex-1 w-full flex flex-col gap-6">
          <StockFilterBar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {isLoading ? (
            <div className="w-full h-60 flex items-center justify-center text-gray-400">
              Loading...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-6">
              {filteredItems.map((item) => (
                <StockCard
                  key={item.id}
                  // --- [สำคัญ] Map Props ใหม่ให้เข้ากับ StockCard ตัวเดิม ---
                  id={item.id} // StockCard รับ id เป็น string
                  img_url={item.image_url} // เปลี่ยน imgUrl -> image_url
                  name={item.name} // เปลี่ยน title -> name
                  stock={item.stock} // เปลี่ยน amount -> stock
                  unit={item.unit}
                  // สมมติว่า status 0 คือ Available
                  status={item.status === 0}
                  onEdit={() => handleOpenEditModal(item)}
                  onToggleStatus={() => handleToggleStatus(item.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <StockDrawer
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        stockItem={editingItem as any}
        onSave={handleSaveStock}
        onDelete={handleDeleteIngredient}
        availableTags={allTags}
      />

      <StockAddTagDrawer
        isOpen={isTagDrawerOpen}
        onClose={() => setIsTagDrawerOpen(false)}
        onSuccess={handleTagUpdated}
      />

      <StockEditTagDrawer
        isOpen={isEditTagDrawerOpen}
        onClose={() => setIsEditTagDrawerOpen(false)}
        onSuccess={handleTagUpdated}
      />
    </div>
  );
};

export default StockRender;
