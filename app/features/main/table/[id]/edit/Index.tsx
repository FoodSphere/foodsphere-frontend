"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

// Import Components
import { OrderCardComponent } from "@/app/features/main/order/components/OrderCardComponent";
import { Icons } from "@/app/icons";
import {
  getActiveBillByTableId,
  getOrdersByBillId,
} from "@/services/bill/billApi";
import { getMenuById } from "@/services/menu/menuApi";

import {
  FilterStatus,
  OrderFilterBar,
} from "../../../order/components/OrderFilterBar";
import { OrderSearchBar } from "../../../order/components/OrderSearchBar";
import { IOrder } from "../../../order/Index";

// แก้ไขคำว่า Pending เป็น Not Done เพื่อให้ตรงกับ Type ของ IOrder
const mapOrderStatus = (statusNum: number): string => {
  switch (statusNum) {
    case 1:
      return "Not Done";
    case 2:
      return "Cooking";
    case 3:
      return "Completed";
    case 4:
      return "Cancel";
    default:
      return "Not Done";
  }
};

export default function TableEditOrderRender() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentFilter, setCurrentFilter] = useState<FilterStatus>("All");
  const [searchTerm, setSearchTerm] = useState("");

  const params = useParams();
  const tableId = (params?.id as string) || "1";
  const [tableName, setTableName] = useState<string>(`Table ${tableId}`);

  useEffect(() => {
    const fetchOrdersData = async () => {
      setIsLoading(true);
      try {
        const activeBillRes = await getActiveBillByTableId(Number(tableId));

        if (!activeBillRes || !activeBillRes.data) {
          setOrders([]);
          setIsLoading(false);
          return;
        }

        const billId = activeBillRes.data.id;
        const ordersRes = await getOrdersByBillId(billId);

        if (!ordersRes || !ordersRes.data || ordersRes.data.length === 0) {
          setOrders([]);
          setIsLoading(false);
          return;
        }

        const rawOrders = ordersRes.data;

        const allItemsPromises = rawOrders.flatMap((order: any) => {
          return order.items.map(async (item: any) => {
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
              id: `${order.id}-${item.id}`,
              img: imgUrl,
              foodName: menuName,
              table: tableId,
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

    fetchOrdersData();
  }, [tableId]);

  const handleUpdateStatus = (id: number | string) => {
    // TODO: ต่อ API Update Status ตรงนี้ในอนาคต
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === id) {
          if (order.status === "Pending")
            // ตอนนี้ทำงานร่วมกับ Type ใหม่ได้แล้ว
            return { ...order, status: "Cooking" };
          if (order.status === "Cooking")
            return { ...order, status: "Completed" };
        }
        return order;
      })
    );
  };

  const handleCancelOrder = (id: number | string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: "Cancel" as any } : order
      )
    );
  };

  const filteredOrders = useMemo(() => {
    let result = orders;

    if (currentFilter !== "All") {
      // จับคู่คำว่า "Pending" จากปุ่ม Filter เข้ากับคำว่า "Not Done" ใน Data
      const targetStatus =
        currentFilter === "Pending" ? "Not Done" : currentFilter;
      result = result.filter((order) => order.status === targetStatus);
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
            <span>Order</span>
            <span className="bg-primary-orange-main text-white px-4 py-2 rounded-lg text-2xl font-bold">
              {tableName}
            </span>
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
              <OrderCardComponent
                key={order.id}
                {...order}
                onUpdate={handleUpdateStatus}
                onCancel={handleCancelOrder}
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
    </div>
  );
}
