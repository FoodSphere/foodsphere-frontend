"use client";

import React from "react";

import { Icons } from "@/app/icons";

import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

export interface OrderItem {
  id: string; // Unique ID for the order item (e.g. combination of menuId and options)
  menuId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
}

interface TableOrderAddSidebarProps {
  tableId: string;
  orderItems: OrderItem[];
  onIncreaseQuantity: (id: string) => void;
  onDecreaseQuantity: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onConfirmOrder: () => void;
  onCancelOrder: () => void;
}

export function TableOrderAddSidebarComponent({
  tableId,
  orderItems,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveItem,
  onConfirmOrder,
  onCancelOrder,
}: TableOrderAddSidebarProps) {
  return (
    <Card className="w-full h-full max-h-[calc(100vh-2rem)] flex flex-col bg-gray-50 border-gray-200 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-gray-800">
          Table{tableId} Order
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden px-2 pb-2">
        <ScrollArea className="h-full w-full bg-white rounded-lg border p-1">
          <div className="p-3 space-y-4">
            {orderItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                <p>No items selected</p>
              </div>
            ) : (
              orderItems.map((item, index) => (
                <React.Fragment key={item.id}>
                  <div className="flex items-start space-x-3">
                    {/* Image */}
                    <div className="flex-shrink-0">
                      {item.imageUrl ? (
                        <div className="relative w-16 h-16 rounded-md overflow-hidden">
                          {/* Using img for simplicity and robustness against external domains not in next.config */}
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                          B/W
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-grow min-w-0 flex flex-col justify-between min-h-[64px]">
                      <div className="flex justify-between items-start">
                        <p
                          className="font-semibold text-gray-900 text-sm truncate pr-2"
                          title={item.name}
                        >
                          {item.name.length > 20
                            ? item.name.slice(0, 20) + "..."
                            : item.name}
                        </p>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Icons name="TrashIcon" className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-end space-x-2 mt-2">
                        <div className="flex items-center bg-gray-100 rounded-md">
                          <button
                            onClick={() => onDecreaseQuantity(item.id)}
                            className="p-1 hover:bg-gray-200 rounded-l-md transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Icons
                              name="MinusIcon"
                              className="w-3 h-3 text-gray-600"
                            />
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onIncreaseQuantity(item.id)}
                            className="p-1 hover:bg-gray-200 rounded-r-md transition-colors"
                          >
                            <Icons
                              name="PlusIcon"
                              className="w-3 h-3 text-gray-600"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < orderItems.length - 1 && (
                    <Separator className="my-3 bg-gray-100" />
                  )}
                </React.Fragment>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="flex flex-col space-y-3 pt-2 pb-6 px-6 bg-gray-50 rounded-b-xl">
        <Button
          onClick={onConfirmOrder}
          className="cursor-pointer w-full bg-primary-orange-main hover:bg-orange-600 disabled:opacity-40 disabled:text-white text-white font-bold py-6 rounded-xl text-lg transition"
          disabled={orderItems.length === 0}
        >
          <Icons name="SendIcon" className="w-5 h-5 mr-2" />
          Confirm
        </Button>
        <button
          onClick={onCancelOrder}
          className="text-gray-500 hover:text-gray-700 underline text-sm transition-colors"
        >
          Cancel
        </button>
      </CardFooter>
    </Card>
  );
}
