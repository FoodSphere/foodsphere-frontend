"use client";

import { useMemo, useState } from "react";

import { OrderCardComponent } from "@/app/components/featureComponents/OrderCardComponent";

import { FilterStatus, OrderFilterBar } from "./OrderFilterBar";
import { OrderSearchBar } from "./OrderSearchBar";

// สร้าง type สำหรับข้อมูล order
interface IOrder {
  id: number;
  img?: string | null;
  foodName: string;
  table: string;
  additionalDetail?: string;
  quantity: string;
  order_at: string;
  status: "Not Done" | "Cooking" | "Completed" | "Cancel";
}

const Orders: IOrder[] = [
  {
    id: 1234,
    img: null,
    foodName: "string",
    table: "10",
    additionalDetail: "Lorem ipsum odor amet, consectetuer adipiscing elit.",
    quantity: "5",
    order_at: "10/10/2025 15:15",
    status: "Not Done",
  },
  {
    id: 1235,
    img: null,
    foodName: "string",
    table: "10",
    additionalDetail: "Lorem ipsum odor amet, consectetuer adipiscing elit.",
    quantity: "5",
    order_at: "10/10/2025 15:15",
    status: "Cooking",
  },
  {
    id: 1236,
    img: null,
    foodName: "string",
    table: "10",
    additionalDetail: "Lorem ipsum odor amet, consectetuer adipiscing elit.",
    quantity: "5",
    order_at: "10/10/2025 15:15",
    status: "Completed",
  },
  {
    id: 1237,
    img: null,
    foodName: "string",
    table: "10",
    additionalDetail: "Lorem ipsum odor amet, consectetuer adipiscing elit.",
    quantity: "5",
    order_at: "10/10/2025 15:15",
    status: "Not Done",
  },
  {
    id: 1238,
    img: null,
    foodName: "string",
    table: "10",
    additionalDetail: "Lorem ipsum odor amet, consectetuer adipiscing elit.",
    quantity: "5",
    order_at: "10/10/2025 15:15",
    status: "Not Done",
  },
  {
    id: 1239,
    img: null,
    foodName: "string",
    table: "10",
    additionalDetail: "Lorem ipsum odor amet, consectetuer adipiscing elit.",
    quantity: "5",
    order_at: "10/10/2025 15:15",
    status: "Not Done",
  },
  {
    id: 1241,
    img: null,
    foodName: "string",
    table: "10",
    additionalDetail: "Lorem ipsum odor amet, consectetuer adipiscing elit.",
    quantity: "5",
    order_at: "10/10/2025 15:15",
    status: "Not Done",
  },
  {
    id: 1242,
    img: null,
    foodName: "string",
    table: "10",
    additionalDetail: "Lorem ipsum odor amet, consectetuer adipiscing elit.",
    quantity: "5",
    order_at: "10/10/2025 15:15",
    status: "Not Done",
  },
  {
    id: 12343,
    img: null,
    foodName: "string",
    table: "10",
    additionalDetail: "Lorem ipsum odor amet, consectetuer adipiscing elit.",
    quantity: "5",
    order_at: "10/10/2025 15:15",
    status: "Not Done",
  },
  {
    id: 12344,
    img: null,
    foodName: "pad kra prao",
    table: "12",
    additionalDetail: "no ped, no pak",
    quantity: "2",
    order_at: "13/11/2025 20:15",
    status: "Not Done",
  },
];

export const OrderCardDisplay = () => {
  const [orders, setOrders] = useState<IOrder[]>(Orders);

  const handleUpdateStatus = (id: number | string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === id) {
          if (order.status === "Not Done") {
            return { ...order, status: "Cooking" };
          }
          if (order.status === "Cooking") {
            return { ...order, status: "Completed" };
          }
        }
        return order;
      })
    );
  };

  const handleCancelOrder = (id: number | string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, status: "Cancel" } : order
      )
    );
  };

  // State สำหรับการกรองและค้นหา
  const [currentFilter, setCurrentFilter] = useState<FilterStatus>("All");
  const [searchTerm, setSearchTerm] = useState("");

  // กรองรายการ Order ตาม filter และ search term
  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // 1. กรองตาม Status
    if (currentFilter !== "All") {
      filtered = filtered.filter((order) => order.status === currentFilter);
    }

    // 2. กรองตาม Search Term (ค้นหาจาก id, foodName, table)
    if (searchTerm.trim() !== "") {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.foodName.toLowerCase().includes(lowerCaseSearchTerm) ||
          order.table.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    return filtered;
  }, [orders, currentFilter, searchTerm]);

  return (
    <div className="w-fit h-fit flex flex-col justify-center">
      {/* ส่วนของ Filter และ Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center w-full mb-6 gap-4">
        <OrderFilterBar
          currentFilter={currentFilter}
          onFilterChange={setCurrentFilter}
        />
        <OrderSearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </div>

      {/* รายการ Order ที่ผ่านการกรองแล้ว */}
      <div className="flex flex-col gap-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((eachOrder) => (
            <OrderCardComponent
              key={eachOrder.id}
              id={eachOrder.id}
              img={eachOrder.img}
              foodName={eachOrder.foodName}
              table={eachOrder.table}
              additionalDetail={eachOrder.additionalDetail}
              quantity={eachOrder.quantity}
              order_at={eachOrder.order_at}
              status={eachOrder.status}
              onUpdate={handleUpdateStatus}
              onCancel={handleCancelOrder}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 py-10">
            No orders found.
          </div>
        )}
      </div>
    </div>
  );
};
