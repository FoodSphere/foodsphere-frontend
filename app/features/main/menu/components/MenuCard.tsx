import { useState } from "react";

import { Icons } from "@/app/icons";

import { Ingredient } from "../Index";

interface MenuCardProps {
  id: number;
  name: string;
  image_url: string | null;
  price: number;
  currency: string;
  ingredients: Ingredient[];
  status?: boolean;
  onEdit: () => void;
  onToggleStatus: () => void;
}

export const MenuCard = ({
  name,
  image_url,
  price,
  currency,
  ingredients,
  status = true,
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
      <div className="h-[160px] w-full bg-gray-100 relative">
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

        {/* Ingredients Dropdown Section */}
        <div className="w-full mb-4 flex flex-col items-center">
          <button
            className="text-sky-500 text-xs font-bold flex items-center gap-1 hover:underline transition-all"
            onClick={() => setShowIngredients(!showIngredients)}
          >
            {showIngredients ? "Hide ingredients" : "See ingredients"}
            <Icons
              name={
                showIngredients ? "ArrowUpDoubleIcon" : "ArrowDownDoubleIcon"
              }
              className="w-3 h-3"
            />
          </button>

          {/* List Item with Animation Logic */}
          {showIngredients && ingredients && Array.isArray(ingredients) && (
            <ul className="w-full mt-2 pt-2 border-t border-dashed border-gray-200 space-y-1 bg-gray-50/50 p-2 rounded-lg">
              {ingredients.map((ing, i) => (
                <li
                  key={i}
                  className="flex justify-between text-xs text-gray-600 font-medium"
                >
                  <span className="truncate pr-2">{ing.name}</span>
                  <span className="whitespace-nowrap font-bold text-gray-800">
                    {ing.amount}
                  </span>
                  <span className="whitespace-nowrap font-bold text-gray-800">
                    {ing.unit}
                  </span>
                </li>
              ))}
              {ingredients.length === 0 && (
                <li className="text-xs text-gray-400 text-center">
                  - No ingredients -
                </li>
              )}
            </ul>
          )}
        </div>

        {/* Action Buttons (Push to bottom with mt-auto) */}
        <div className="flex items-center gap-3 w-full mt-auto">
          {/* Edit Button */}
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

          {/* Toggle Status Button */}
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
      </div>
    </div>
  );
};
