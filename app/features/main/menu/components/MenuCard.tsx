import { useState } from "react";

import { Icons } from "@/app/icons";

import { Ingredient } from "../Index";

interface MenuCardProps {
  id: number;
  name: string;
  image_url: string | null;
  price: number;
  currency: string;
  ingredients?: Ingredient[]; // ทำให้เป็น Optional เพราะโหมด order ไม่จำเป็นต้องใช้
  status?: boolean;

  // --- เพิ่ม Props ใหม่ ---
  mode?: "manage" | "order"; // กำหนดโหมด (default เป็น manage)
  onAdd?: () => void; // ฟังก์ชันสำหรับกดปุ่ม Add
  onEdit?: () => void; // ทำให้เป็น Optional
  onToggleStatus?: () => void; // ทำให้เป็น Optional
}

export const MenuCard = ({
  name,
  image_url,
  price,
  currency,
  ingredients = [],
  status = true,
  mode = "manage", // Default 
  onAdd,
  onEdit,
  onToggleStatus,
}: MenuCardProps) => {
  const [showIngredients, setShowIngredients] = useState(false);

  return (
    <div
      className={`flex flex-col bg-white rounded-xl shadow-md transition-all duration-300 overflow-hidden border border-gray-100 h-full ${
        !status ? "opacity-70" : "hover:shadow-lg"
      }`}
    >
      {/* Image Area */}
      <div className="h-[160px] w-full bg-gray-100 relative shrink-0">
        {image_url ? (
          <img
            src={image_url}
            alt={name}
            className={`w-full h-full object-cover transform transition-transform duration-500 ${
              !status ? "grayscale" : "hover:scale-105"
            }`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            No Image
          </div>
        )}

        {/* Overlay เมื่อปิดใช้งาน */}
        {!status && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Unavailable
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex flex-col items-center p-4 pt-3 flex-1 border-t-3 border-primary-orange-main">
        {/* Title & Price */}
        <div className={`w-full text-center ${!status ? "text-gray-400" : ""}`}>
          <h3 className="text-lg font-bold mb-1 truncate px-2" title={name}>
            {name}
          </h3>
          <p className="font-bold text-lg mb-2 text-primary-orange-main">
            {price.toLocaleString()}{" "}
            <span className="text-sm text-gray-500">{currency}</span>
          </p>
        </div>

        {/* --- แยกการแสดงผลตาม Mode --- */}
        {mode === "manage" ? (
          <>
            {/* Ingredients Dropdown Section (โชว์เฉพาะ Manage) */}
            <div className="w-full mb-4 flex flex-col items-center">
              <button
                className="text-sky-500 text-xs font-bold flex items-center gap-1 hover:underline transition-all"
                onClick={() => setShowIngredients(!showIngredients)}
              >
                {showIngredients ? "Hide ingredients" : "See ingredients"}
                <Icons
                  name={
                    showIngredients
                      ? "ArrowUpDoubleIcon"
                      : "ArrowDownDoubleIcon"
                  }
                  className="w-3 h-3"
                />
              </button>

              {showIngredients && ingredients.length > 0 && (
                <ul className="w-full mt-2 pt-2 border-t border-dashed border-gray-200 space-y-1 bg-gray-50/50 p-2 rounded-lg">
                  {ingredients.map((ing, i) => (
                    <li
                      key={i}
                      className="flex justify-between text-xs text-gray-600 font-medium"
                    >
                      <span className="truncate pr-2">{ing.name}</span>
                      <span className="whitespace-nowrap font-bold text-gray-800">
                        {ing.amount} {ing.unit}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Action Buttons: Edit / Toggle Status (โชว์เฉพาะ Manage) */}
            <div className="flex items-center gap-3 w-full mt-auto">
              <button
                onClick={onEdit}
                disabled={!status}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm
                  ${
                    !status
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-primary-orange-main hover:bg-orange-600 text-white"
                  }`}
              >
                <Icons
                  name="EditIcon"
                  className={`w-4 h-4 ${!status ? "text-gray-400" : "text-white"}`}
                />
                Edit
              </button>

              <button
                onClick={onToggleStatus}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm border
                  ${
                    !status
                      ? "bg-green-50 border-green-500 text-green-600 hover:bg-green-100"
                      : "bg-white border-primary-orange-main text-primary-orange-main hover:bg-orange-50"
                  }`}
              >
                {status ? (
                  <>
                    <Icons name="CloseIcon" className="w-4 h-4" />
                    Close
                  </>
                ) : (
                  <>
                    <Icons name="CheckIcon" className="w-4 h-4" /> Open
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          /* โหมด Order (โชว์เฉพาะปุ่ม Add) */
          <div className="w-full mt-auto pt-2">
            <button
              onClick={onAdd}
              disabled={!status}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm
                ${
                  !status
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-primary-orange-main hover:bg-orange-600 text-white hover:shadow-md active:scale-95"
                }`}
            >
              <Icons name="PlusIcon" className="w-4 h-4" />
              Add
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
