import { useState } from "react";

import { Icons } from "@/app/icons";

import { MenuItem } from "../Index";

interface MenuCardProps {
  item: MenuItem;
  onEdit: () => void;
  onToggleStatus: () => void;
}

export const MenuCard = ({ item, onEdit, onToggleStatus }: MenuCardProps) => {
  const [showIngredients, setShowIngredients] = useState(false);

  return (
    <div
      className={`relative flex flex-col items-center w-[280px] transition-all ${!item.isAvailable ? "opacity-60 grayscale-[0.5]" : ""}`}
    >
      {/* Image Section */}
      <div className="w-full h-[160px] overflow-hidden rounded-t-3xl border-x-2 border-t-2 border-transparent">
        {item.imgUrl ? (
          <img
            src={item.imgUrl}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="w-full flex flex-col items-center border-x-2 border-b-2 border-[#FF5C39] rounded-b-3xl bg-white px-4 pb-4">
        <h3 className="text-xl font-bold mt-4 mb-1 text-black text-center truncate w-full px-2">
          {item.title}
        </h3>
        <p className="text-lg mb-4 text-gray-600 font-semibold">
          {item.amount.toLocaleString()} {item.unit}
        </p>

        {/* Buttons */}
        <div className="flex gap-3 mb-4 w-full justify-center">
          <button
            onClick={onEdit}
            disabled={!item.isAvailable}
            className="flex items-center gap-2 bg-[#FF5C39] hover:bg-[#e04a2b] disabled:bg-gray-400 text-white font-bold px-4 py-2 rounded-xl transition shadow-md"
          >
            <Icons name="EditIcon" className="w-4 h-4" /> Edit
          </button>

          <button
            onClick={onToggleStatus}
            className={`flex items-center gap-2 border-2 font-bold px-4 py-2 rounded-xl transition shadow-sm ${
              item.isAvailable
                ? "border-[#FF5C39] text-[#FF5C39] hover:bg-orange-50"
                : "border-green-500 text-green-500 hover:bg-green-50"
            }`}
          >
            <Icons
              name={item.isAvailable ? "CloseIcon" : "CheckIcon"}
              className="w-4 h-4"
            />
            {item.isAvailable ? "Close" : "Open"}
          </button>
        </div>

        {/* Ingredients Dropdown */}
        <button
          className="text-sky-500 text-sm font-bold flex items-center gap-1 hover:underline"
          onClick={() => setShowIngredients(!showIngredients)}
        >
          {showIngredients ? "Hide ingredients" : "See ingredients"}
          <Icons
            name={showIngredients ? "ArrowUpDoubleIcon" : "ArrowDownDoubleIcon"}
            className="w-3"
          />
        </button>

        {showIngredients && (
          <ul className="w-full mt-3 pt-3 border-t-2 border-dashed border-gray-300 space-y-1">
            {item.ingredients.map((ing, i) => (
              <li
                key={i}
                className="flex justify-between text-sm text-gray-700 font-medium"
              >
                <span>{ing.title}</span>
                <span>x{ing.amount}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
