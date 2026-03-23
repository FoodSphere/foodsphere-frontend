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
    onDelete(promo.id);
  };

  return (
    <div className="bg-white rounded-[24px] flex flex-col sm:flex-row shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 relative group overflow-hidden">
      {/* Action Buttons - ปรับตำแหน่งเล็กน้อยให้ลอยเหนือรูป/เนื้อหา */}
      <div className="absolute top-3 right-3 flex gap-2 z-20 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={() => onEdit(promo)}
          className="p-2 bg-white/90 backdrop-blur-md hover:bg-orange-50 hover:text-primary-orange-main text-gray-500 rounded-full shadow-md border border-gray-100 transition-all"
          title="Edit Promotion"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={handleDeleteClick}
          className="p-2 bg-white/90 backdrop-blur-md hover:bg-red-50 hover:text-red-500 text-gray-500 rounded-full shadow-md border border-gray-100 transition-all"
          title="Delete Promotion"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Image Section - ปรับให้เต็มพื้นที่ฝั่งซ้าย */}
      <div className="w-full sm:w-56 h-48 sm:h-auto bg-gray-50 shrink-0 relative overflow-hidden border-b sm:border-b-0 sm:border-r-2 border-primary-orange-main">
        {promo.image_url ? (
          <img
            src={promo.image_url}
            alt={promo.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
            <ImageIcon className="w-10 h-10 mb-2" />
            <span className="text-xs font-medium">No Image</span>
          </div>
        )}

        {/* Overlay ไล่เฉดสีเบาๆ ให้รูปดูมีมิติ (Optional) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-50"></div>
      </div>

      {/* Content Section - ใส่ Padding ที่นี่แทน */}
      <div className="flex-1 flex flex-col justify-between p-6">
        <div>
          <div className="flex justify-between items-start pr-12 sm:pr-16">
            <div>
              <h3 className="text-xl font-bold text-gray-900 leading-tight">
                {promo.name}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2 mt-1.5">
                {promo.description || "No description provided."}
              </p>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${
                promo.status === 1
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {promo.status === 1 ? "Active" : "Inactive"}
            </span>
          </div>

          {/* Items Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {promo.items.map((item, idx) => (
              <span
                key={idx}
                className="text-xs bg-white border border-gray-200 text-gray-600 px-2 py-1 rounded-lg font-medium flex items-center gap-2 shadow-sm"
              >
                <span className="text-primary-orange-main font-bold">
                  {item.quantity}x
                </span>
                {item.name}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mt-6 flex items-end justify-between border-t border-gray-100 border-dashed pt-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
              Total Value
            </span>
            <span className="text-sm text-gray-400 line-through font-medium">
              ฿{promo.originalPrice.toLocaleString()}
            </span>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[10px] text-primary-orange-main uppercase font-bold tracking-wider">
              Special Price
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-primary-orange-main">
                ฿
              </span>
              <span className="text-3xl font-black text-primary-orange-main leading-none">
                {promo.specialPrice.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
