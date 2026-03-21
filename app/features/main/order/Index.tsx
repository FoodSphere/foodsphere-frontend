"use client";

import { useEffect, useMemo, useState } from "react";
import * as signalR from "@microsoft/signalr";

// Import Components
import { OrderCard } from "@/app/features/main/order/components/OrderCard";
import { getCookie } from "@/libs/cookie";
import { getMenuById, mapOrderStatus } from "@/services/menu/menuApi";
import { getAllOrders, updateOrderStatus } from "@/services/order/orderApi";

import { FilterStatus, OrderFilterBar } from "./components/OrderFilterBar";
import { OrderSearchBar } from "./components/OrderSearchBar";
import { OrderUpdateStatusConfirmModal } from "./components/OrderUpdateStatusConfirmModal";
import { ICreateOrderFromSignalR, IOrder, IUpdateOrderItemFromSignalR, IUpdateOrderStatusFromSignalR } from "@/types/orderType";

// Types
export interface ModalConfig {
  isOpen: boolean;
  orderId: string;
  originalOrderId: number;
  billId: string;
  action: "update" | "cancel" | null;
  targetStatus: number | null;
}

const OrderRender = () => {
  // --- State ---
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentFilter, setCurrentFilter] = useState<FilterStatus>("All");
  const [searchTerm, setSearchTerm] = useState("");

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

  // ==============================================================
  // Fetch All Orders & Tables
  // ==============================================================
  const fetchOrdersData = async () => {
    setIsLoading(true);
    try {
      // *** ดึงข้อมูล Orders  ***
      const [ordersRes] = await Promise.all([getAllOrders()]);

      if (!ordersRes || !ordersRes.data || ordersRes.data.length === 0) {
        setOrders([]);
        setIsLoading(false);
        return;
      }

      const rawOrders = ordersRes.data;

      const allItemsPromises = rawOrders.flatMap((order: any) => {
        // เพิ่ม index เข้ามาใน map เพื่อเอาไปสร้าง ID ไม่ให้ซ้ำกัน
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

          // 1. ลอง console.log ดูว่ามีค่า table_id ส่งมาจริงไหม และใช้ชื่อ key ว่าอะไร
          console.log("Order Data:", order);

          return {
            // *** แก้ไขการสร้าง ID ให้การันตีว่าไม่ซ้ำ (billId-orderId-index) ***
            id: `${order.bill_id}-${order.id}-${index}`,
            originalOrderId: order.id,
            billId: order.bill_id,
            img: imgUrl,
            foodName: menuName,
            table: order.table.name, // ส่งชื่อโต๊ะเข้าไปแทน ID โต๊ะ
            additionalDetail: item.note || "-",
            quantity: item.quantity.toString(),
            order_at: formattedDate,
            status: mapOrderStatus(order.status) as any,
          } as IOrder;
        });
      });

      const resolvedOrders = await Promise.all(allItemsPromises);

      resolvedOrders.sort(
        (a, b) =>
          new Date(b.order_at).getTime() - new Date(a.order_at).getTime()
      );

      setOrders(resolvedOrders);
    } catch (error) {
      console.error("Error fetching all orders details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersData();

    const accessToken = getCookie("access_token");
    const restaurantId = getCookie("restaurant_id");

    const connect = new signalR.HubConnectionBuilder()
      .withUrl(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/restaurants/${restaurantId}/branches/1/hubs/pos`,
        {
          accessTokenFactory: () => `${accessToken}`,
        }
      )
      .withAutomaticReconnect()
      .build();
    connect
      .start()
      .catch((err) =>
        console.error("Error while connecting to SignalR Hub:", err)
      );

    connect.on("order_created", async (createdOrder: ICreateOrderFromSignalR) => {
      if (!createdOrder || !createdOrder.items) return;

      try {
        const newItemsPromises = createdOrder.items.map(
          async (item: any, index: number) => {
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

            const dateObj = new Date(createdOrder.create_time);
            const formattedDate = `${dateObj.toLocaleDateString("en-GB")} ${dateObj.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;

            return {
              id: `${createdOrder.bill_id}-${createdOrder.id}-${index}`,
              originalOrderId: createdOrder.id,
              billId: createdOrder.bill_id,
              img: imgUrl,
              foodName: menuName,
              table: createdOrder.table.name,
              additionalDetail: item.note || "-",
              quantity: item.quantity.toString(),
              order_at: formattedDate,
              status: mapOrderStatus(createdOrder.status) as any,
            } as IOrder;
          }
        );

        const newOrders = await Promise.all(newItemsPromises);

        setOrders((prevOrders) => {
          const merged = [...prevOrders, ...newOrders];
          merged.sort(
            (a, b) =>
              new Date(b.order_at).getTime() - new Date(a.order_at).getTime()
          );
          return merged;
        });
      } catch (err) {
        console.error("Error processing new order:", err);
      }
    });

    connect.on("order_status_updated", async (updatedOrder: IUpdateOrderStatusFromSignalR) => {
      setOrders((prevOrders) => {
        return prevOrders.map((order) => {
          if (order.originalOrderId === updatedOrder.resource.id) {
            return {
              ...order,
              status: mapOrderStatus(updatedOrder.status) as any,
            };
          }
          return order;
        });
      });
    });

    connect.on("order_item_updated", async (updatedOrder: IUpdateOrderItemFromSignalR) => {
      setOrders((prevOrders) => {
        return prevOrders.map((order) => {
          if (order.originalOrderId === updatedOrder.order_id) {
            return {
              ...order,
              quantity: updatedOrder.quantity.toString(),
              additionalDetail: updatedOrder.note,
            };
          }
          return order;
        });
      });
    });

    return () => {
      connect.stop();
    };
  }, []);

  // ==============================================================
  // Handlers
  // ==============================================================
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

  const confirmAction = async () => {
    if (
      !modalConfig.billId ||
      !modalConfig.targetStatus ||
      !modalConfig.originalOrderId
    )
      return;

    setIsUpdating(true);
    try {
      await updateOrderStatus(
        modalConfig.billId,
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

  // ==============================================================
  // Filters
  // ==============================================================
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
            <span>All Orders</span>
          </h1>
          {isLoading && (
            <span className="text-gray-500 flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-primary-orange-main border-t-transparent rounded-full animate-spin"></div>
              Loading orders...
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
              <p className="text-lg font-medium">No active orders found</p>
              <p className="text-sm">
                Orders from all active tables will appear here.
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Modal ยืนยันการกระทำ */}
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
};

export default OrderRender;
