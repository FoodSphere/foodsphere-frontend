"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { MenuCard } from "@/app/features/main/menu/components/MenuCard";
import { MenuFilterBar } from "@/app/features/main/menu/components/MenuFilterBar";
import { Icons } from "@/app/icons";
import { getActiveBillByTableId } from "@/services/bill/billApi";
import { getMenus } from "@/services/menu/menuApi";
import { getMenuTags } from "@/services/menu/menuTagApi";
import { createOrder } from "@/services/order/orderApi";
import { IMenuResponse } from "@/types/menuType";

import {
  OrderItem,
  TableAddOrderListSidebar,
} from "./components/TableAddOrderListSidebar";

const ALL_CATEGORY = "All menu";

export default function TableAddOrderRender() {
  const params = useParams();
  const router = useRouter();
  const tableId = (params?.id as string) || "1";

  // --- States ---
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [menuItems, setMenuItems] = useState<IMenuResponse[]>([]);
  const [categories, setCategories] = useState<string[]>([ALL_CATEGORY]);
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY);
  const [tableName, setTableName] = useState<string>(`Table ${tableId}`); // เก็บชื่อโต๊ะ
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Fetch API Data ---
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      // เพิ่มการดึงข้อมูล Table Info เข้าไปใน Promise.all
      await Promise.all([fetchTagsData(), fetchMenusData(), fetchTableInfo()]);
      setIsLoading(false);
    };

    fetchAllData();
  }, []);

  const fetchTableInfo = async () => {
    try {
      const res = await getActiveBillByTableId(Number(tableId));
      if (res && res.data) {
        const name =
          res.data.table_name || res.data.table?.name || `Table ${tableId}`;
        setTableName(name);
      }
    } catch (error) {
      console.error("Error fetching table info:", error);
    }
  };

  const fetchTagsData = async () => {
    try {
      const tagsData = await getMenuTags();
      if (tagsData && Array.isArray(tagsData)) {
        const tagNames = tagsData.map((tag) => tag.name);
        setCategories([ALL_CATEGORY, ...tagNames]);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const fetchMenusData = async () => {
    try {
      const res = await getMenus();
      if (res && res.data && Array.isArray(res.data)) {
        setMenuItems(res.data);
      }
    } catch (error) {
      console.error("Error fetching menus:", error);
    }
  };

  const filteredItems =
    selectedCategory === ALL_CATEGORY
      ? menuItems
      : menuItems.filter((item) =>
          item.tags?.some((tag) => tag.name === selectedCategory)
        );

  // --- Handlers ---
  const handleAddToOrder = (menuItem: IMenuResponse) => {
    setOrderItems((prev) => {
      const existingItem = prev.find(
        (item) => item.menuId === menuItem.id.toString()
      );
      if (existingItem) {
        return prev.map((item) =>
          item.menuId === menuItem.id.toString()
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const imageUrl =
          menuItem.image_url === "string" ? null : menuItem.image_url;

        return [
          ...prev,
          {
            id: Date.now().toString() + Math.random().toString(),
            menuId: menuItem.id.toString(),
            name: menuItem.name,
            price: menuItem.price,
            quantity: 1,
            imageUrl: imageUrl,
            note: "",
          },
        ];
      }
    });
  };

  const handleIncreaseQuantity = (itemId: string) => {
    setOrderItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecreaseQuantity = (itemId: string) => {
    setOrderItems((prev) =>
      prev.map((item) =>
        item.id === itemId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setOrderItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleUpdateNote = (itemId: string, note: string) => {
    setOrderItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, note } : item))
    );
  };

  const handleConfirmOrder = async () => {
    if (orderItems.length === 0) return;

    try {
      setIsSubmitting(true);

      const activeBillResponse = await getActiveBillByTableId(Number(tableId));

      if (!activeBillResponse || !activeBillResponse.data) {
        alert("ไม่พบบิลที่เปิดอยู่สำหรับโต๊ะนี้ กรุณาเปิดบิลก่อนสั่งอาหาร");
        setIsSubmitting(false);
        return;
      }

      const billId = activeBillResponse.data.id;

      for (const item of orderItems) {
        const payload = {
          items: [
            {
              menu_id: Number(item.menuId),
              quantity: item.quantity,
              note: item.note || "",
            },
          ],
          status: 0,
        };

        await createOrder(billId, payload);
      }

      // --- ลบ Alert ออกตามที่ต้องการ ---
      setOrderItems([]);
      router.back();
    } catch (error) {
      console.error("Failed to confirm order:", error);
      alert("เกิดข้อผิดพลาดในการส่งออเดอร์ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setOrderItems([]);
  };

  return (
    <div className="flex flex-col min-h-screen mr-[400px]">
      {/* 1. Header */}
      <div className="bg-white pt-6 px-6 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors shadow-sm"
        >
          <Icons name="ArrowLeftIcon" className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-black tracking-tight flex items-center gap-3">
            Order Menu
            <span className="bg-primary-orange-main text-white px-4 py-2 rounded-lg text-2xl font-bold">
              {tableName}
            </span>
          </h1>
        </div>
      </div>

      {/* 2. Main Content */}
      <div className="flex-1 flex flex-col p-6 gap-6 overflow-hidden">
        <h2 className="text-xl font-medium text-gray-600 mt-1">Categories</h2>
        {!isLoading && (
          <MenuFilterBar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        )}

        <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-40 text-gray-400">
              <p>Loading menus...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <MenuCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  image_url={
                    item.image_url === "string" ? null : item.image_url
                  }
                  price={item.price}
                  currency="THB"
                  mode="order"
                  onAdd={() => handleAddToOrder(item)}
                />
              ))}

              {filteredItems.length === 0 && (
                <div className="col-span-full py-12 text-center text-gray-400 font-medium">
                  No menus found in this category.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. Right Sidebar */}
      <div className="w-[400px] bg-white h-full fixed right-0 top-0 z-20">
        <div className="h-full p-4">
          <TableAddOrderListSidebar
            tableName={tableName} // ส่ง tableName ไปแทน
            orderItems={orderItems}
            onIncreaseQuantity={handleIncreaseQuantity}
            onDecreaseQuantity={handleDecreaseQuantity}
            onRemoveItem={handleRemoveItem}
            onUpdateNote={handleUpdateNote}
            onConfirmOrder={handleConfirmOrder}
            onCancelOrder={handleCancel}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
