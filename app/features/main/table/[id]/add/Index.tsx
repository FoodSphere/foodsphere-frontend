"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { FilterBarComponent } from "@/app/components/featureComponents/FilterBarComponent";
import { ItemCardComponent } from "@/app/components/featureComponents/ItemCardComponent";
import {
  OrderItem,
  TableOrderAddSidebarComponent,
} from "@/app/components/featureComponents/TableOrderSidebarComponent";
import { Icons } from "@/app/icons";

// Mock Data (Replicated from existing patterns for standalone functionality)
interface MenuItem {
  id: string;
  imgUrl: string | null;
  title: string;
  amount: number;
  unit: string;
  ingredients: Array<{ title: string; amount: number }>;
}

const menuItems: MenuItem[] = [
  {
    id: "1",
    imgUrl: null, // "https://www.japanesecooking101.com/wp-content/uploads/2012/03/IMG_3833.jpeg",
    title: "Pa-nang Curry",
    amount: 55,
    unit: "bahts.",
    ingredients: [],
  },
  {
    id: "2",
    imgUrl:
      "https://www.japanesecooking101.com/wp-content/uploads/2012/03/IMG_3833.jpeg",
    title: "Pad Kra Pao Minced Pork",
    amount: 55,
    unit: "bahts.",
    ingredients: [],
  },
  {
    id: "3",
    imgUrl:
      "https://www.japanesecooking101.com/wp-content/uploads/2012/03/IMG_3833.jpeg",
    title: "Pad Kra Pao Crispy Pork",
    amount: 65,
    unit: "bahts.",
    ingredients: [],
  },
  {
    id: "4",
    imgUrl: null,
    title: "Omelette Rice",
    amount: 35,
    unit: "bahts.",
    ingredients: [],
  },
  {
    id: "5",
    imgUrl: null,
    title: "Fried Rice Chicken",
    amount: 45,
    unit: "bahts.",
    ingredients: [],
  },
  {
    id: "6",
    imgUrl:
      "https://www.japanesecooking101.com/wp-content/uploads/2012/03/IMG_3833.jpeg",
    title: "Tom Yum Kung",
    amount: 80,
    unit: "bahts.",
    ingredients: [],
  },
  {
    id: "7",
    imgUrl: null,
    title: "Fish & Chips",
    amount: 89,
    unit: "bahts.",
    ingredients: [],
  },
  {
    id: "8",
    imgUrl: null,
    title: "Beer Chang",
    amount: 100,
    unit: "bahts.",
    ingredients: [],
  },
  {
    id: "9",
    imgUrl: null,
    title: "Water",
    amount: 20,
    unit: "bahts.",
    ingredients: [],
  },
  {
    id: "10",
    imgUrl: null,
    title: "Ice",
    amount: 5,
    unit: "bahts.",
    ingredients: [],
  },
];

export default function TableOrderAddRender() {
  const params = useParams();
  const router = useRouter();
  const tableId = (params?.id as string) || "1";

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const handleAddToOrder = (menuItem: MenuItem) => {
    setOrderItems((prev) => {
      const existingItem = prev.find((item) => item.menuId === menuItem.id);
      if (existingItem) {
        return prev.map((item) =>
          item.menuId === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prev,
          {
            id: Date.now().toString() + Math.random().toString(), // Simple unique ID generation
            menuId: menuItem.id,
            name: menuItem.title,
            price: menuItem.amount,
            quantity: 1,
            imageUrl: menuItem.imgUrl,
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

  const handleConfirmOrder = () => {
    // Implement confirm logic here (e.g., API call)
    console.log("Confirm Order for Table", tableId, orderItems);
    alert("Order Confirmed!");
    setOrderItems([]);
  };

  const handleCancel = () => {
    setOrderItems([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col mr-[400px]">
      {/* Header */}
      <div className="bg-white shadow-sm py-4 px-6 flex items-center space-x-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full bg-primary-orange-main hover:bg-orange-600 text-white transition-colors"
        >
          <Icons name="ArrowLeftIcon" className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          Menu{" "}
          <span className="bg-primary-orange-main text-white px-3 py-1 rounded-lg text-2xl">
            Table {tableId}
          </span>
        </h1>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content (Menu) */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Categories */}
          <div className="py-4 bg-white border-b border-gray-100">
            <FilterBarComponent />
          </div>

          {/* Menu Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {menuItems.map((item) => (
                <div key={item.id} className="flex justify-center">
                  <ItemCardComponent
                    title={item.title}
                    amount={item.amount}
                    unit={item.unit}
                    imgUrl={item.imgUrl}
                    onAdd={() => handleAddToOrder(item)}
                    useIngredients={false} // Match mockup simplicity
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar (Order) */}
        <div className="w-[400px] bg-gray-50 border-l border-gray-200 h-full fixed right-0 top-0">
          <div className="h-full p-4">
            <TableOrderAddSidebarComponent
              tableId={tableId}
              orderItems={orderItems}
              onIncreaseQuantity={handleIncreaseQuantity}
              onDecreaseQuantity={handleDecreaseQuantity}
              onRemoveItem={handleRemoveItem}
              onConfirmOrder={handleConfirmOrder}
              onCancelOrder={handleCancel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
