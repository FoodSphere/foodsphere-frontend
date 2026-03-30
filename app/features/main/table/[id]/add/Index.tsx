"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { MenuCard } from "@/app/features/main/menu/components/MenuCard";
import { MenuFilterBar } from "@/app/features/main/menu/components/MenuFilterBar";
import { Icons } from "@/app/icons";
import { getActiveBillByTableId } from "@/services/bill/billApi";
import { getMenus } from "@/services/menu/menuApi";
import { getMenuTags } from "@/services/menu/menuTagApi";
import { CheckOrdersLimit, createOrder } from "@/services/order/orderApi";
import { getTableById, getTables } from "@/services/table/tableApi";
import { IMenuResponse } from "@/types/menuType";

import {
  OrderItem,
  TableAddOrderListSidebar,
} from "./components/TableAddOrderListSidebar";
import { TableLimitOrderToasts } from "./components/TableLimitOrderToasts";

const ALL_CATEGORY = "All menu";

export default function TableAddOrderRender() {
  // --- States ---
  const router = useRouter();

  const params = useParams();
  const tableId = (params?.id as string) || "1";
  const [tableName, setTableName] = useState<string>(`Loading...`);
  const [billId, setBillId] = useState<string>("");

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [menuItems, setMenuItems] = useState<IMenuResponse[]>([]);
  const [categories, setCategories] = useState<string[]>([ALL_CATEGORY]);
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // --- Fetch API Data ---
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      await Promise.all([fetchTagsData(), fetchMenusData(), fetchTableInfo()]);
      setIsLoading(false);
    };

    fetchAllData();
  }, []);

  const fetchTableInfo = async () => {
    try {
      // 1. ลองดึงข้อมูลบิลตามปกติ
      const res = await getActiveBillByTableId(Number(tableId));

      // 2. เรียก API ดึงข้อมูลโต๊ะโดยตรง
      const tableRes = await getTableById(tableId);
      const actualTableName = tableRes?.data.name;

      if (res && res.data) {
        const name =
          res.data.table_name ||
          res.data.table?.name ||
          actualTableName ||
          `Table ${tableId}`;

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
        // --- เพิ่ม Logic เช็คสถานะเหมือนหน้า MenuRender ---
        const mappedMenus = res.data.map((item: any) => {
          const components = item.components || [];

          const isAnyComponentInactive = components.some(
            (c: any) => c.menu_status === 0
          );
          const isAnyComponentOutOfStock = components.some(
            (c: any) => c.stock_availability === false
          );

          let finalStatus = item.status;

          if (item.status === 0 || isAnyComponentInactive) {
            finalStatus = 0; // 1. เมนูหลักปิด หรือมีเมนูย่อยปิด
          } else if (
            item.stock_availability === false ||
            isAnyComponentOutOfStock
          ) {
            finalStatus = 2; // 2. ของหมด
          }

          return {
            ...item,
            status: finalStatus, // เอาสถานะใหม่ที่คำนวณแล้วไปทับ
          };
        });

        setMenuItems(mappedMenus as IMenuResponse[]);
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
    // --- ป้องกันการสั่งอาหารถ้าสถานะเป็น 0 (ปิด) หรือ 2 (ของหมด) ---
    if (menuItem.status === 0 || menuItem.status === 2) return;

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
      setErrorMessage(null); // เคลียร์ error เก่าก่อนเริ่ม

      // --- 1. เตรียม Payload สำหรับเช็ค Limit ---
      const checkLimitPayload = {
        items: orderItems.map((item) => ({
          menu_id: Number(item.menuId),
          quantity: item.quantity,
          note: item.note || "",
        })),
        status: 0,
      };

      // ฟังก์ชันช่วยหาค่า menu_keys อย่างรัดกุม ไม่ว่าจะมาจาก Error โครงสร้างไหน
      const getMenuKeys = (res: any) => {
        if (!res) return null;
        // หากมี .data (กรณี Axios) ให้เจาะเข้าไปก่อน ถ้าไม่มีให้ใช้ตัวมันเอง
        const payload = res.data || res;
        // รองรับทั้งโครงสร้างที่มี .data.menu_keys และ .menu_keys ดื้อๆ
        return payload?.data?.menu_keys || payload?.menu_keys || null;
      };

      // --- 2. ยิง API ตรวจสอบสต๊อก ---
      try {
        const limitRes = await CheckOrdersLimit(checkLimitPayload);
        const outOfStockMenuIds = getMenuKeys(limitRes);

        if (
          outOfStockMenuIds &&
          Array.isArray(outOfStockMenuIds) &&
          outOfStockMenuIds.length > 0
        ) {
          const outOfStockNames = orderItems
            .filter((item) => outOfStockMenuIds.includes(Number(item.menuId)))
            .map((item) => item.name)
            .join(", ");

          setErrorMessage(`สต๊อกไม่เพียงพอสำหรับเมนู: ${outOfStockNames}`);
          setIsSubmitting(false);
          return; // คำสั่งนี้จะทำงานเพื่อหยุดฟังก์ชันอย่างสมบูรณ์
        }
      } catch (error: any) {
        // กรณีที่ API โยน 409 ออกมาเป็น Exception
        const outOfStockMenuIds = getMenuKeys(error?.response);

        if (
          outOfStockMenuIds &&
          Array.isArray(outOfStockMenuIds) &&
          outOfStockMenuIds.length > 0
        ) {
          const outOfStockNames = orderItems
            .filter((item) => outOfStockMenuIds.includes(Number(item.menuId)))
            .map((item) => item.name)
            .join(", ");

          setErrorMessage(`สต๊อกไม่เพียงพอสำหรับเมนู: ${outOfStockNames}`);
          setIsSubmitting(false);
          return; // หยุดการทำงาน ไม่ไปรัน Step 3 ต่อแน่นอน
        }

        // ถ้าเป็น error ชนิดอื่นๆ ให้ throw ไปที่ catch ตัวนอกสุด
        throw error;
      }

      // --- 3. ดำเนินการสร้าง Order เมื่อตรวจสอบผ่านแล้ว ---
      const activeBillResponse = await getActiveBillByTableId(Number(tableId));

      if (!activeBillResponse || !activeBillResponse.data) {
        setErrorMessage(
          "ไม่พบบิลที่เปิดอยู่สำหรับโต๊ะนี้ กรุณาเปิดบิลก่อนสั่งอาหาร"
        );
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

      setOrderItems([]);
      router.push(`/table?table_id=${tableId}&bill_id=${billId}`);
    } catch (error) {
      console.error("Failed to confirm order:", error);
      setErrorMessage("เกิดข้อผิดพลาดในการส่งออเดอร์ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setOrderItems([]);
  };

  return (
    <div className="flex flex-col min-h-screen mr-[400px]">
      {/* Toast แจ้งเตือน */}
      {errorMessage && (
        <TableLimitOrderToasts
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      )}
      {/* 1. Header */}
      <div className="bg-white pt-6 px-6 flex items-center gap-4">
        <button
          onClick={() => router.push(`/table?table_id=${tableId}`)}
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
                  status={item.status}
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
            tableName={tableName}
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
