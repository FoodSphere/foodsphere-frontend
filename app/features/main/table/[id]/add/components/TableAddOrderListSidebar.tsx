"use client";
import { Icons } from "@/app/icons";

export interface OrderItem {
  id: string;
  menuId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
  note?: string;
}

interface TableOrderAddSidebarProps {
  tableName: string;
  orderItems: OrderItem[];
  onIncreaseQuantity: (id: string) => void;
  onDecreaseQuantity: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onUpdateNote: (id: string, note: string) => void;
  onConfirmOrder: () => void;
  onCancelOrder: () => void;
  isSubmitting?: boolean;
}

export function TableAddOrderListSidebar({
  tableName,
  orderItems,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveItem,
  onUpdateNote,
  onConfirmOrder,
  onCancelOrder,
  isSubmitting = false,
}: TableOrderAddSidebarProps) {
  const totalPrice = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="w-full h-full max-h-[calc(100vh-2rem)] flex flex-col bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 overflow-hidden">
      {/* --- Header --- */}
      <div className="px-6 py-5 bg-gray-50/50 border-b-2 border-primary-orange-main flex-shrink-0">
        <h2 className="text-2xl font-extrabold text-primary-orange-main tracking-tight">
          Table {tableName}
        </h2>
        <p className="text-sm font-medium text-gray-500 mt-1">
          Current Order Summary
        </p>
      </div>

      {/* --- Scrollable Content --- */}
      <div className="flex-1 overflow-y-auto p-2 no-scrollbar bg-gray-50/30">
        <div className="p-2 flex flex-col gap-4">
          {orderItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-3 mt-10">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                <Icons name="EditIcon" className="w-8 h-8 text-gray-300" />
              </div>
              <p className="font-medium">No items selected yet</p>
            </div>
          ) : (
            orderItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group"
              >
                {/* --- ด้านบน: รูปภาพ + ชื่อ + ราคา + ปุ่มปรับจำนวน --- */}
                <div className="flex items-start gap-3">
                  {/* Image */}
                  <div className="flex-shrink-0">
                    {item.imageUrl ? (
                      <div className="w-16 h-16 rounded-lg overflow-hidden shadow-sm border border-gray-100">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] text-gray-400 font-medium uppercase tracking-wider border border-gray-200">
                        No Img
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-16">
                    <div className="flex justify-between items-start gap-2">
                      <p
                        className="font-bold text-gray-800 text-sm truncate"
                        title={item.name}
                      >
                        {item.name}{" "}
                        <span className="text-sm font-bold text-primary-orange-main">
                          {"  "}
                          {item.price.toLocaleString()} ฿
                        </span>
                      </p>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 flex-shrink-0"
                        title="Remove item"
                      >
                        <Icons name="TrashIcon" className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      {/* Price */}
                      <p className="text-sm font-bold text-primary-orange-main">
                        <span className="font-medium text-black">
                          ทั้งหมด:{"  "}
                        </span>
                        {(item.price * item.quantity).toLocaleString()} ฿
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 p-0.5">
                        <button
                          onClick={() => onDecreaseQuantity(item.id)}
                          className={`p-1 rounded-md transition-colors ${
                            item.quantity <= 1
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-gray-600 hover:bg-white hover:shadow-sm"
                          }`}
                          disabled={item.quantity <= 1}
                        >
                          <Icons name="MinusIcon" className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onIncreaseQuantity(item.id)}
                          className="p-1 rounded-md text-gray-600 hover:bg-white hover:shadow-sm transition-colors"
                        >
                          <Icons name="PlusIcon" className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- ด้านล่าง: ส่วนของ Note --- */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                    <Icons name="EditIcon" className="w-3 h-3 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={item.note || ""}
                    onChange={(e) => onUpdateNote(item.id, e.target.value)}
                    placeholder="Add a note (e.g. no spicy)"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-lg focus:ring-primary-orange-main focus:border-primary-orange-main block pl-8 pr-2.5 py-2 transition-all placeholder-gray-400"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- Footer / Actions --- */}
      <div className="p-6 bg-white border-t border-gray-100 flex-shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] rounded-b-2xl z-10">
        {/* Total Price Section */}
        <div className="flex justify-between items-center mb-5">
          <span className="text-gray-500 font-medium">Total Price</span>
          <span className="text-2xl font-extrabold text-gray-800">
            {totalPrice.toLocaleString()}{" "}
            <span className="text-lg text-primary-orange-main">฿</span>
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirmOrder}
            disabled={orderItems.length === 0 || isSubmitting}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg transition-all duration-200
              ${
                orderItems.length === 0 || isSubmitting
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-primary-orange-main hover:bg-orange-600 text-white hover:-translate-y-0.5 active:translate-y-0 shadow-[0_4px_14px_rgba(255,92,57,0.3)]"
              }`}
          >
            {isSubmitting ? (
              <span className="animate-pulse">Sending...</span>
            ) : (
              <>
                <Icons name="SendIcon" className="w-5 h-5" />
                Confirm Order
              </>
            )}
          </button>

          <button
            onClick={onCancelOrder}
            disabled={orderItems.length === 0 || isSubmitting}
            className={`text-sm font-medium transition-colors py-2 
              ${
                orderItems.length === 0 || isSubmitting
                  ? "text-transparent pointer-events-none"
                  : "text-gray-400 hover:text-gray-700 underline underline-offset-4"
              }`}
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}
