import React from "react";
import { Image as ImageIcon, Pencil, Trash2 } from "lucide-react";

export type UIPromotion = {
  id: number;
  name: string;
  description: string;
  image_url: string;
  status: number;
  specialPrice: number;
  originalPrice: number;
  items: { menu_id: number; name: string; quantity: number; price: number }[];
  tagIds: number[];
};

interface PromotionMenuCardProps {
  promo: UIPromotion;
  onEdit: (promo: UIPromotion) => void;
  onDelete: (id: number) => void;
}

export const PromotionMenuCard: React.FC<PromotionMenuCardProps> = ({
  promo,
  onEdit,
  onDelete,
}) => {
  const handleDeleteClick = () => {
    if (window.confirm(`Are you sure you want to delete "${promo.name}"?`)) {
      onDelete(promo.id);
    }
  };

  return (
    <div className="bg-white rounded-[24px] p-5 flex flex-col sm:flex-row gap-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 relative group overflow-hidden">
      {/* Action Buttons (Edit & Delete) */}
      <div className="absolute top-4 right-4 flex gap-2 z-10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={() => onEdit(promo)}
          className="p-2.5 bg-white/90 backdrop-blur-sm hover:bg-orange-50 hover:text-primary-orange-main text-gray-500 rounded-full shadow-sm border border-gray-100 transition-all"
          title="Edit Promotion"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={handleDeleteClick}
          className="p-2.5 bg-white/90 backdrop-blur-sm hover:bg-red-50 hover:text-red-500 text-gray-500 rounded-full shadow-sm border border-gray-100 transition-all"
          title="Delete Promotion"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Image */}
      <div className="w-full sm:w-44 h-36 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100 relative">
        {promo.image_url ? (
          <img
            src={promo.image_url}
            alt={promo.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
            <ImageIcon className="w-8 h-8 mb-2" />
            <span className="text-xs font-medium">No Image</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <div className="flex justify-between items-start pr-16">
            <div>
              <h3 className="text-xl font-bold text-gray-900 leading-tight">
                {promo.name}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2 mt-1 pr-4">
                {promo.description}
              </p>
            </div>

            {/* Native Custom Badge */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                promo.status === 1
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {promo.status === 1 ? "ACTIVE" : "INACTIVE"}
            </span>
          </div>

          {/* Items Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {promo.items.map((item, idx) => (
              <span
                key={idx}
                className="text-xs bg-gray-50 border border-gray-200 text-gray-600 px-2.5 py-1.5 rounded-lg font-medium flex items-center gap-1.5"
              >
                <span className="bg-white px-1.5 py-0.5 rounded text-gray-800 font-bold border border-gray-100 shadow-sm">
                  {item.quantity}x
                </span>
                {item.name}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mt-5 flex items-end justify-between sm:justify-end gap-6 pt-4 border-t border-gray-100 border-dashed">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">
              Total Value
            </span>
            <span className="text-sm text-gray-400 line-through font-semibold">
              ฿{promo.originalPrice.toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-primary-orange-main uppercase font-bold tracking-wider mb-1">
              Special Price
            </span>
            <span className="text-3xl font-black text-primary-orange-main leading-none">
              ฿{promo.specialPrice.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
