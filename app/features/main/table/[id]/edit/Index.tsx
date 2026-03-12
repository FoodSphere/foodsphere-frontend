"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

// Import Components
import { OrderCard } from "@/app/features/main/order/components/OrderCard";
import { getActiveBillByTableId } from "@/services/bill/billApi";
import { getMenuById } from "@/services/menu/menuApi";
import {
  getOrdersByBillId,
  updateOrderStatus,
} from "@/services/order/orderApi";
import { getTables } from "@/services/table/tableApi";

import {
  FilterStatus,
  OrderFilterBar,
} from "../../../order/components/OrderFilterBar";
import { OrderSearchBar } from "../../../order/components/OrderSearchBar";
import { OrderUpdateStatusConfirmModal } from "../../../order/components/OrderUpdateStatusConfirmModal";
import { IOrder, mapOrderStatus, ModalConfig } from "../../../order/Index";

export default function TableEditOrderRender() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentFilter, setCurrentFilter] = useState<FilterStatus>("All");
  const [searchTerm, setSearchTerm] = useState("");

  const params = useParams();
  const tableId = (params?.id as string) || "1";
  const [tableName, setTableName] = useState<string>(`Loading...`); // เปลี่ยนค่าเริ่มต้น
  const [activeBillId, setActiveBillId] = useState<string | null>(null);

  // --- Modal States ---
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    isOpen: false,
    orderId: "",
    originalOrderId: 0,
    billId: "",
    action: null,
    targetStatus: null,
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchOrdersData = async () => {
    setIsLoading(true);
    try {
      // *** ดึงข้อมูล Bill ปัจจุบัน และ รายการโต๊ะ พร้อมกัน ***
      const [activeBillRes, tablesRes] = await Promise.all([
        getActiveBillByTableId(Number(tableId)),
        getTables(),
      ]);

      // --- จัดการเรื่องชื่อโต๊ะ ---
      const tablesList = tablesRes?.data || [];
      const matchedTable = tablesList.find(
        (t: any) => String(t.id) === String(tableId)
      );
      // ถ้าเจอชื่อให้ใช้ชื่อ ถ้าไม่เจอให้ fallback กลับไปใช้ id
      const resolvedTableName = matchedTable ? matchedTable.name : tableId;
      setTableName(resolvedTableName); // อัปเดตชื่อโต๊ะเพื่อแสดงบน Header

      if (!activeBillRes || !activeBillRes.data) {
        setOrders([]);
        setIsLoading(false);
        return;
      }

      const billId = activeBillRes.data.id;
      setActiveBillId(billId);

      const ordersRes = await getOrdersByBillId(billId);

      if (!ordersRes || !ordersRes.data || ordersRes.data.length === 0) {
        setOrders([]);
        setIsLoading(false);
        return;
      }

      const rawOrders = ordersRes.data;

      const allItemsPromises = rawOrders.flatMap((order: any) => {
        // แนะนำให้ใส่ index มาด้วยแบบหน้า Order รวม เพื่อป้องกัน React Duplicate Key Warning
        return order.items.map(async (item: any, index: number) => {
          let menuName = "Unknown Menu";
          let imgUrl = "";

          try {
            const menuRes = await getMenuById(item.menu_id);
            if (menuRes && menuRes.data) {
              menuName = menuRes.data.name;
              imgUrl = menuRes.data.image_url || imgUrl;
            }
          } catch (error) {
            console.error(`Failed to fetch menu ID ${item.menu_id}`, error);
          }

          const dateObj = new Date(order.create_time);
          const formattedDate = `${dateObj.toLocaleDateString("en-GB")} ${dateObj.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;

          return {
            id: `${billId}-${order.id}-${index}`, // สร้าง ID ให้ Unique เหมือนหน้ารวม
            originalOrderId: order.id,
            billId: billId, // เก็บเพิ่มไว้เผื่อใช้
            img: imgUrl,
            foodName: menuName,
            table: resolvedTableName, // *** ส่งชื่อโต๊ะจริงเข้าไปแทน tableId ***
            additionalDetail: item.note || "-",
            quantity: item.quantity.toString(),
            order_at: formattedDate,
            status: mapOrderStatus(order.status) as any,
          } as IOrder;
        });
      });

      const resolvedOrders = await Promise.all(allItemsPromises);
      setOrders(resolvedOrders);
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersData();
  }, [tableId]);

  // --- Handlers: เปิด Modal ยืนยัน ---
  const handleUpdateStatusClick = (id: string) => {
    const orderToUpdate = orders.find((o) => o.id === id);

    if (!orderToUpdate || orderToUpdate.originalOrderId === undefined) return;

    let nextStatusNum = 2; // Pending -> Cooking
    if (orderToUpdate.status === "Cooking") nextStatusNum = 3; // Cooking -> Completed

    setModalConfig({
      isOpen: true,
      orderId: id,
      originalOrderId: orderToUpdate.originalOrderId,
      billId: orderToUpdate.billId,
      action: "update",
      targetStatus: nextStatusNum,
    });
  };

  const handleCancelOrderClick = (id: string) => {
    const orderToCancel = orders.find((o) => o.id === id);

    if (!orderToCancel || orderToCancel.originalOrderId === undefined) return;

    setModalConfig({
      isOpen: true,
      orderId: id,
      originalOrderId: orderToCancel.originalOrderId,
      billId: orderToCancel.billId,
      action: "cancel",
      targetStatus: 4,
    });
  };

  // --- Handler: กดยืนยันใน Modal เพื่อยิง API ---
  const confirmAction = async () => {
    if (
      !activeBillId ||
      !modalConfig.targetStatus ||
      !modalConfig.originalOrderId
    )
      return;

    setIsUpdating(true);
    try {
      await updateOrderStatus(
        activeBillId,
        modalConfig.originalOrderId.toString(),
        modalConfig.targetStatus
      );

      setOrders((prev) =>
        prev.map((order) => {
          if (order.id === modalConfig.orderId) {
            return {
              ...order,
              status: mapOrderStatus(modalConfig.targetStatus as number) as any,
            };
          }
          return order;
        })
      );
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update order status. Please try again.");
    } finally {
      setIsUpdating(false);
      setModalConfig({ ...modalConfig, isOpen: false });
    }
  };

  const filteredOrders = useMemo(() => {
    let result = orders;
    if (currentFilter !== "All") {
      result = result.filter((order) => order.status === currentFilter);
    }
    if (searchTerm.trim() !== "") {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(
        (order) =>
          order.foodName.toLowerCase().includes(lowerTerm) ||
          order.table.toLowerCase().includes(lowerTerm)
      );
    }
    return result;
  }, [orders, currentFilter, searchTerm]);

  return (
    <div className="w-full">
      <div className="w-full max-w-[1600px] mx-auto px-4 py-6 md:px-8 md:py-10 flex flex-col">
        {/* Header Title */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-2">
            <span>Order Table</span>
            <span className="bg-primary-orange-main text-white px-4 py-2 rounded-lg text-2xl font-bold">
              {tableName}
            </span>
          </h1>
          {isLoading && (
            <span className="text-gray-500 flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-primary-orange-main border-t-transparent rounded-full animate-spin"></div>
              Loading...
            </span>
          )}
        </div>

        {/* Controls Section */}
        <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div className="w-full lg:w-auto overflow-x-auto no-scrollbar">
            <OrderFilterBar
              currentFilter={currentFilter}
              onFilterChange={setCurrentFilter}
            />
          </div>
          <div className="w-full lg:w-auto">
            <OrderSearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </div>
        </div>

        {/* Orders List Section */}
        <div className="flex flex-col gap-4 w-full">
          {!isLoading && filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                {...order}
                onUpdate={handleUpdateStatusClick}
                onCancel={handleCancelOrderClick}
              />
            ))
          ) : !isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200 text-gray-400 gap-4 mt-8">
              <p className="text-lg font-medium">No orders found</p>
              <p className="text-sm">
                Try adjusting your search or filters, or add a new order.
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {/* --- Modal ยืนยันการกระทำ --- */}
      <OrderUpdateStatusConfirmModal
        isOpen={modalConfig.isOpen}
        title={
          modalConfig.action === "update"
            ? "Update Order Status"
            : "Cancel Order"
        }
        message={
          modalConfig.action === "update"
            ? "Are you sure you want to update this order's status?"
            : "Are you sure you want to cancel this order? This action cannot be undone."
        }
        confirmText={
          modalConfig.action === "update" ? "Yes, Update" : "Yes, Cancel It"
        }
        isDestructive={modalConfig.action === "cancel"}
        isLoading={isUpdating}
        onConfirm={confirmAction}
        onCancel={() => setModalConfig({ ...modalConfig, isOpen: false })}
      />
    </div>
  );
}
