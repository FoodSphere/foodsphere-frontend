"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";

// Import Components
import { OrderCardComponent } from "@/app/features/main/order/components/OrderCardComponent";

import { FilterStatus, OrderFilterBar } from "./components/OrderFilterBar";
import { OrderSearchBar } from "./components/OrderSearchBar";

// Types
export interface IOrder {
  id: string; 
  img?: string | null;
  foodName: string;
  table: string;
  additionalDetail?: string;
  quantity: string;
  order_at: string;
  status: string;
}

// Mock Data
const MOCK_ORDERS: IOrder[] = [
  {
    id: "1", // เปลี่ยนเป็น string
    img: "/padkrapao.jpg",
    foodName: "Pad Kra Pao Minced Pork",
    table: "01",
    additionalDetail: "Fried egg, Less spicy",
    quantity: "1",
    order_at: "10/03/2025 11:57",
    status: "Pending", // เปลี่ยนจาก Not Done เป็น Pending
  },
  // ... อัปเดต Mock ตัวอื่นๆ ด้วยวิธีเดียวกัน
];

const OrderRender = () => {
  // --- State ---
  const [orders, setOrders] = useState<IOrder[]>(MOCK_ORDERS);
  const [currentFilter, setCurrentFilter] = useState<FilterStatus>("All");
  const [searchTerm, setSearchTerm] = useState("");

  // --- Handlers ---
  const handleUpdateStatus = (id: number | string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === id) {
          if (order.status === "Pending")
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
        order.id === id ? { ...order, status: "Cancel" } : order
      )
    );
  };

  // --- Filtering Logic ---
  const filteredOrders = useMemo(() => {
    let result = orders;

    // Filter by Status
    if (currentFilter !== "All") {
      result = result.filter((order) => order.status === currentFilter);
    }

    // Filter by Search
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
    // Main Container: กำหนดความกว้างเต็มจอ และจัด padding ให้สวยงาม
    <div className="w-full">
      <div className="w-full max-w-[1600px] mx-auto px-4 py-6 md:px-8 md:py-10 flex flex-col">
        {/* 1. Header Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Order</h1>

        {/* 2. Controls Section (Filter & Search) */}
        <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
          {/* Filter Bar */}
          <div className="w-full lg:w-auto overflow-x-auto no-scrollbar">
            <OrderFilterBar
              currentFilter={currentFilter}
              onFilterChange={setCurrentFilter}
            />
          </div>

          {/* Search Bar */}
          <div className="w-full lg:w-auto">
            <OrderSearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </div>
        </div>

        {/* 3. Orders List Section */}
        <div className="flex flex-col gap-4 w-full">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderCardComponent
                key={order.id}
                {...order}
                onUpdate={handleUpdateStatus}
                onCancel={handleCancelOrder}
              />
            ))
          ) : (
            // Empty State
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200 text-gray-400">
              <p className="text-lg font-medium">No orders found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderRender;
