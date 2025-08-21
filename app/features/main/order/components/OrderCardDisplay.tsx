"use client";

import { useState } from "react";

import { OrderCardComponent } from "@/app/components/featureComponents/OrderCardComponent";

// สร้าง type สำหรับข้อมูล order
interface IOrder {
  id: number;
  img?: string;
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
    img: "",
    foodName: "string",
    table: "10",
    additionalDetail: "Lorem ipsum odor amet, consectetuer adipiscing elit.",
    quantity: "5",
    order_at: "10/10/2025 15:15",
    status: "Not Done",
  },
  {
    id: 1235,
    img: "",
    foodName: "string",
    table: "10",
    additionalDetail: "Lorem ipsum odor amet, consectetuer adipiscing elit.",
    quantity: "5",
    order_at: "10/10/2025 15:15",
    status: "Cooking",
  },
  {
    id: 1236,
    img: "",
    foodName: "string",
    table: "10",
    additionalDetail: "Lorem ipsum odor amet, consectetuer adipiscing elit.",
    quantity: "5",
    order_at: "10/10/2025 15:15",
    status: "Completed",
  },
  {
    id: 1237,
    img: "",
    foodName: "string",
    table: "10",
    additionalDetail: "Lorem ipsum odor amet, consectetuer adipiscing elit.",
    quantity: "5",
    order_at: "10/10/2025 15:15",
    status: "Not Done",
  },
  {
    id: 1238,
    img: "",
    foodName: "string",
    table: "10",
    additionalDetail: "Lorem ipsum odor amet, consectetuer adipiscing elit.",
    quantity: "5",
    order_at: "10/10/2025 15:15",
    status: "Not Done",
  },
  {
    id: 1239,
    img: "",
    foodName: "string",
    table: "10",
    additionalDetail: "Lorem ipsum odor amet, consectetuer adipiscing elit.",
    quantity: "5",
    order_at: "10/10/2025 15:15",
    status: "Not Done",
  },
  {
    id: 1241,
    img: "",
    foodName: "string",
    table: "10",
    additionalDetail: "Lorem ipsum odor amet, consectetuer adipiscing elit.",
    quantity: "5",
    order_at: "10/10/2025 15:15",
    status: "Not Done",
  },
  {
    id: 1242,
    img: "",
    foodName: "string",
    table: "10",
    additionalDetail: "Lorem ipsum odor amet, consectetuer adipiscing elit.",
    quantity: "5",
    order_at: "10/10/2025 15:15",
    status: "Not Done",
  },
  {
    id: 12343,
    img: "",
    foodName: "string",
    table: "10",
    additionalDetail: "Lorem ipsum odor amet, consectetuer adipiscing elit.",
    quantity: "5",
    order_at: "10/10/2025 15:15",
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

  return (
    <div className="w-fit h-fit flex flex-col justify-center">
      {orders.map((eachOrder) => (
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
      ))}
    </div>
  );
};
