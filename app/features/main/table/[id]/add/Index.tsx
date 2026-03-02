"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { MenuCard } from "@/app/features/main/menu/components/MenuCard";
import { MenuFilterBar } from "@/app/features/main/menu/components/MenuFilterBar";
import { Icons } from "@/app/icons";
import { createOrder, getActiveBillByTableId } from "@/services/bill/billApi";
import { getMenus } from "@/services/menu/menuApi";
import { getMenuTags } from "@/services/menu/menuTagApi";
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Fetch API Data ---
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      await Promise.all([fetchTagsData(), fetchMenusData()]);
      setIsLoading(false);
    };

    fetchAllData();
  }, []);

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
            note: "", // เริ่มต้น Note เป็นค่าว่าง
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

  // --- ฟังก์ชัน Confirm ยิง API ทีละรายการ (แบบ Sequential ป้องกัน Duplicate Key) ---
  const handleConfirmOrder = async () => {
    if (orderItems.length === 0) return;

    try {
      setIsSubmitting(true);

      // 1. หา Bill ปัจจุบันของโต๊ะนี้ก่อน เพื่อเอา bill_id
      const activeBillResponse = await getActiveBillByTableId(Number(tableId));

      if (!activeBillResponse || !activeBillResponse.data) {
        alert("ไม่พบบิลที่เปิดอยู่สำหรับโต๊ะนี้ กรุณาเปิดบิลก่อนสั่งอาหาร");
        setIsSubmitting(false);
        return;
      }

      const billId = activeBillResponse.data.id;

      // 2. ใช้ for...of ในการ await เพื่อให้ระบบยิง API ให้เสร็จทีละ 1 Order
      // ป้องกันปัญหา Race Condition ที่ทำให้ Backend Gen ID ชนกัน
      for (const item of orderItems) {
        const payload = {
          items: [
            {
              menu_id: Number(item.menuId),
              quantity: item.quantity,
              note: item.note || "", // ส่ง note ไปด้วย
            },
          ],
          status: 0,
        };

        // รอจนกว่า Order นี้จะบันทึกสำเร็จ ค่อยขยับไป Order ถัดไป
        await createOrder(billId, payload);
      }

      // 3. เคลียร์ตะกร้าและกลับหน้าหลัก
      alert("Order Confirmed Successfully!");
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
            <span className="bg-primary-orange-main text-white px-3 py-1 rounded-lg text-xl font-bold">
              Table {tableId}
            </span>
          </h1>
        </div>
      </div>

      {/* 2. Main Content */}
      <div className="flex-1 flex flex-col p-6 gap-6 overflow-hidden">
        <h2 className="text-xl font-medium text-gray-600 mt-1">Categories</h2>

        {/* Categories Filter */}
        {!isLoading && (
          <MenuFilterBar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        )}

        {/* Menu Grid */}
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
            tableId={tableId}
            orderItems={orderItems}
            onIncreaseQuantity={handleIncreaseQuantity}
            onDecreaseQuantity={handleDecreaseQuantity}
            onRemoveItem={handleRemoveItem}
            onUpdateNote={handleUpdateNote} // ส่งฟังก์ชันไปให้พิมพ์ Note ได้
            onConfirmOrder={handleConfirmOrder} // ส่งฟังก์ชัน API Confirm
            onCancelOrder={handleCancel}
            isSubmitting={isSubmitting} // ส่งสถานะโหลด
          />
        </div>
      </div>
    </div>
  );
}
