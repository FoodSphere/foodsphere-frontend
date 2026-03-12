import clsx from "clsx";

import { Icons } from "@/app/icons";

interface OrderCardProps {
  id: string;
  img?: string | null;
  foodName: string;
  table: string;
  additionalDetail?: string;
  quantity: string;
  order_at: string;
  status: string;
  onUpdate: (id: string) => void;
  onCancel: (id: string) => void;
}

export const OrderCard = ({
  id,
  img,
  foodName,
  table,
  additionalDetail,
  quantity,
  order_at,
  status,
  onUpdate,
  onCancel,
}: OrderCardProps) => {
  return (
    <div className="w-full flex flex-col md:flex-row bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200">
      {/* 1. Image Section - แก้ไขขนาดให้ตายตัวและไม่ดัน Card ให้ยืด */}
      <div className="w-full md:w-[220px] lg:w-[260px] h-[200px] md:h-auto relative bg-gray-50 flex-shrink-0">
        {img ? (
          <img
            src={img}
            alt={foodName}
            // ใช้ absolute inset-0 เพื่อให้ภาพคลุมเต็มพื้นที่คอนเทนเนอร์โดยไม่ไปดันความสูง
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <span className="text-sm font-medium">No Image</span>
          </div>
        )}
      </div>

      {/* 2. Order Details Section */}
      <div className="flex-1 flex flex-col">
        {/* Upper Details */}
        <div className="flex-1 flex flex-col sm:flex-row justify-between p-4 lg:p-5 gap-4">
          <div className="flex items-start gap-4">
            {/* Table Badge */}
            <div className="px-3 py-1 bg-primary-orange-main text-white rounded-md font-bold text-sm whitespace-nowrap shadow-sm">
              Table {table}
            </div>

            {/* Food Name & Quantity */}
            <div className="flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">
                {foodName}
              </h3>
              <p className="text-gray-500 text-sm font-medium">
                Quantity:{" "}
                <span className="text-gray-900 text-base">{quantity}</span>
              </p>
            </div>
          </div>

          {/* Status & Time */}
          <div className="flex flex-col sm:items-end justify-start gap-1.5 min-w-[100px]">
            <div
              className={clsx(
                "px-3 py-1 rounded-full text-xs font-bold w-fit",
                {
                  "bg-yellow-100 text-yellow-700": status === "Pending",
                  "bg-blue-100 text-blue-700": status === "Cooking",
                  "bg-green-100 text-green-700": status === "Completed",
                  "bg-red-100 text-red-700": status === "Cancel",
                }
              )}
            >
              {status}
            </div>
            <p className="text-xs text-gray-400 font-medium">{order_at}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-4 lg:mx-5 border-t border-gray-100"></div>

        {/* Lower Details (Notes) */}
        <div className="p-4 lg:p-5">
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">
            Additional Details
          </p>
          <p className="text-gray-700 text-sm">{additionalDetail || "-"}</p>
        </div>
      </div>

      {/* 3. Action Buttons Section */}
      <div className="w-full md:w-[160px] lg:w-[180px] flex flex-row md:flex-col border-t md:border-t-0 md:border-l border-gray-100 bg-gray-50/50 p-4 gap-3 justify-center">
        {status === "Pending" && (
          <>
            <button
              onClick={() => onUpdate(id)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary-orange-main text-white text-sm font-semibold hover:bg-orange-600 transition-colors shadow-sm"
            >
              <Icons className="w-4 h-4" name="CheckIcon" />
              Update
            </button>
            <button
              onClick={() => onCancel(id)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 hover:border-red-300 transition-colors bg-white"
            >
              <Icons className="w-4 h-4" name="TrashIcon" />
              Cancel
            </button>
          </>
        )}

        {status === "Cooking" && (
          <button
            onClick={() => onUpdate(id)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-colors shadow-sm"
          >
            <Icons className="w-4 h-4" name="CheckIcon" />
            Complete
          </button>
        )}
      </div>
    </div>
  );
};
