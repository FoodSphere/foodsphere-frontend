import { useState } from "react";

import { Icons } from "@/app/icons";
import { EMenuStatus } from "@/types/enum";

import { Ingredient } from "../Index";

export interface MenuComponent {
  menu_id: number;
  quantity: number;
  name?: string; // เผื่ออนาคต Backend ส่งชื่อเมนูมาด้วย
}

interface MenuCardProps {
  id: number;
  name: string;
  image_url: string | null;
  price: number;
  currency: string;
  ingredients?: Ingredient[];
  components?: MenuComponent[];
  status?: number;
  mode?: "manage" | "order";
  onAdd?: () => void;
  onEdit?: () => void;
  onToggleStatus?: () => void;
}

export const MenuCard = ({
  name,
  image_url,
  price,
  currency,
  ingredients = [],
  components = [],
  status = 1,
  mode = "manage",
  onAdd,
  onEdit,
  onToggleStatus,
}: MenuCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  // เช็คว่าเป็น Promotion Menu หรือไม่ (มี components และไม่มี ingredients)
  const isPromotion = components.length > 0;
  // เช็คว่ามีข้อมูลให้กดดูรายละเอียดหรือไม่
  const hasDetails = ingredients.length > 0 || components.length > 0;

  return (
    <div
      className={`flex flex-col bg-white rounded-xl shadow-md transition-all duration-300 overflow-hidden border border-gray-100 h-full ${
        !(status === EMenuStatus.ACTIVE)
          ? "opacity-70"
          : "hover:shadow-lg hover:-translate-y-1"
      }`}
    >
      {/* Image Area */}
      <div className="h-[160px] w-full bg-gray-50 relative shrink-0">
        {image_url ? (
          <img
            src={image_url}
            alt={name}
            className={`w-full h-full object-cover transform transition-transform duration-500 ${
              !(status === EMenuStatus.ACTIVE) ? "grayscale" : "hover:scale-105"
            }`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <Icons name="EditIcon" className="w-8 h-8 mb-2 opacity-50" />
            <span className="text-xs font-medium">No Image</span>
          </div>
        )}

        {/* Badge สำหรับ Promotion Menu */}
        {isPromotion && status && (
          <div className="absolute top-2 left-2 bg-primary-orange-main text-white px-2.5 py-1 rounded-xl text-[12px] font-bold uppercase tracking-wide shadow-sm">
            Promo Set
          </div>
        )}

        {/* Overlay เมื่อปิดใช้งาน */}
        {status === EMenuStatus.INACTIVE && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center backdrop-blur-[1px]">
            <span className="bg-red-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
              Closed
            </span>
          </div>
        )}
        {status === EMenuStatus.OUT_OF_STOCK && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center backdrop-blur-[1px]">
            <span className="bg-red-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex flex-col items-center p-4 pt-3 flex-1 border-t-[3px] border-primary-orange-main">
        {/* Title & Price */}
        <div
          className={`w-full text-center mb-3 ${status === EMenuStatus.INACTIVE || status === EMenuStatus.OUT_OF_STOCK ? "text-gray-400" : ""}`}
        >
          <h3
            className="text-lg font-bold mb-1 truncate px-2 text-gray-800"
            title={name}
          >
            {name}
          </h3>
          <p className="font-bold text-lg text-primary-orange-main">
            {price.toLocaleString()}{" "}
            <span className="text-xs text-gray-500 font-medium">
              {currency}
            </span>
          </p>
        </div>

        {/* --- แยกการแสดงผลตาม Mode --- */}
        {mode === "manage" ? (
          <>
            {/* Details Dropdown Section (Ingredients / Components) */}
            <div className="w-full mb-4 flex flex-col items-center">
              {hasDetails && (
                <button
                  className={`text-xs font-bold flex items-center gap-1.5 transition-all px-3 py-1.5 rounded-full ${
                    showDetails
                      ? "bg-gray-50 text-blue-500"
                      : "text-blue-500 hover:bg-gray-50"
                  }`}
                  onClick={() => setShowDetails(!showDetails)}
                >
                  {showDetails ? "Hide" : "View"}{" "}
                  {isPromotion ? "Set Items" : "Ingredients"}
                  <Icons
                    name={showDetails ? "ArrowUpDoubleIcon" : "ArrowDownIcon"}
                    className="w-3 h-3"
                  />
                </button>
              )}

              {/* List Detail View */}
              {showDetails && hasDetails && (
                <div className="w-full mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-2 px-1 tracking-wider">
                    {isPromotion ? "Items in this set" : "Recipe Ingredients"}
                  </p>
                  <ul className="w-full space-y-2">
                    {/* Render Components สำหรับ Promotion */}
                    {isPromotion &&
                      components.map((comp, i) => (
                        <li key={i} className="flex items-center text-xs">
                          <span className="text-primary-orange-main font-medium truncate">
                            {comp.name || `Menu ID: ${comp.menu_id}`}
                          </span>
                          <span className="grow border-b border-dotted border-gray-300 mx-2"></span>
                          <span className="whitespace-nowrap font-bold text-gray-800 bg-white px-1.5 py-0.5 rounded shadow-sm">
                            x{comp.quantity}
                          </span>
                        </li>
                      ))}

                    {/* Render Ingredients สำหรับเมนูปกติ */}
                    {!isPromotion &&
                      ingredients.map((ing, i) => (
                        <li key={i} className="flex items-center text-xs">
                          <span className="text-gray-700 font-medium truncate">
                            {ing.name}
                          </span>
                          <span className="grow border-b border-dotted border-gray-300 mx-2"></span>
                          <span className="whitespace-nowrap font-bold text-primary-orange-main">
                            {ing.amount}{" "}
                            <span className="text-[10px] text-gray-500">
                              {ing.unit}
                            </span>
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Action Buttons: Edit / Toggle Status */}
            <div className="flex items-center gap-2 w-full mt-auto">
              {/* ซ่อนปุ่ม Edit ถ้าเป็น Promotion Menu */}
              {!isPromotion && (
                <button
                  onClick={onEdit}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm bg-primary-orange-main hover:bg-orange-600 text-white"
                >
                  <Icons name="EditIcon" className="w-4 h-4" />
                  Edit
                </button>
              )}

              {/* ปุ่ม Open/Close (ถ้าไม่มีปุ่ม Edit จะขยายเต็มพื้นที่อัตโนมัติ) */}
              <button
                hidden={status === EMenuStatus.OUT_OF_STOCK}
                onClick={onToggleStatus}
                className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm border
                  ${
                    status === EMenuStatus.INACTIVE
                      ? "bg-green-50 border-green-500 text-green-600 hover:bg-green-100"
                      : "bg-white border-primary-orange-main text-primary-orange-main hover:bg-orange-50"
                  } ${isPromotion ? "w-full" : "flex-1"}`}
              >
                {status === EMenuStatus.ACTIVE ? (
                  <>
                    <Icons name="CloseIcon" className="w-4 h-4" /> Close
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
          /* โหมด Order */
          <div className="w-full mt-auto pt-2">
            <button
              onClick={onAdd}
              disabled={status !== EMenuStatus.ACTIVE}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm
      ${
        status !== EMenuStatus.ACTIVE
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : "bg-primary-orange-main hover:bg-orange-600 text-white hover:shadow-md active:scale-95"
      }`}
            >
              <Icons name="PlusIcon" className="w-4 h-4" />
              Add to Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
