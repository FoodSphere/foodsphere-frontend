"use client";

import React, { useEffect, useState } from "react";

// API
import { getMenus } from "@/services/menu/menuApi";
import { getMenuTags } from "@/services/menu/menuTagApi";
import {
  deletePromotionMenu,
  getPromotionMenus,
} from "@/services/promotion/promotionApi";
import {
  IMenuResponse,
  IMenuTag,
  IPromotionMenuResponse,
} from "@/types/menuType";

import { PromotionFormSection } from "./PromotionFormSection";
import { PromotionMenuCard, UIPromotion } from "./PromotionMenuCard";

export const ManagePromotionView = () => {
  const [promotions, setPromotions] = useState<UIPromotion[]>([]);
  const [availableMenus, setAvailableMenus] = useState<IMenuResponse[]>([]);
  const [availableTags, setAvailableTags] = useState<IMenuTag[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [editingPromotion, setEditingPromotion] = useState<UIPromotion | null>(
    null
  );

  const fetchMasterData = async () => {
    try {
      setIsLoadingData(true);
      const [menusRes, tagsRes, promotionsRes] = await Promise.all([
        getMenus(),
        getMenuTags(),
        getPromotionMenus(),
      ]);

      const menus = menusRes?.data || [];
      if (menusRes?.data) setAvailableMenus(menus);
      if (tagsRes) setAvailableTags(tagsRes);

      if (promotionsRes?.data) {
        const mappedPromotions: UIPromotion[] = promotionsRes.data.map(
          (promo: IPromotionMenuResponse) => {
            let originalPrice = 0;
            const items = (promo.components || []).map((comp) => {
              const menuItem = menus.find(
                (m: IMenuResponse) => m.id === comp.menu_id
              );
              const itemPrice = menuItem?.price || 0;
              const itemName = menuItem?.name || "Unknown Item";
              originalPrice += itemPrice * comp.quantity;

              return {
                menu_id: comp.menu_id,
                name: itemName,
                quantity: comp.quantity,
                price: itemPrice, // แนบ price ไปด้วย ฟอร์มจะได้คำนวณถูก
              };
            });

            // ดึง tag_id จาก tags ที่แนบมากับ API Promotion (สมมติว่าเป็น { tag_id: number }[])
            const tagIds = (promo.tags || []).map((t: any) => t.tag_id);

            return {
              id: promo.id,
              name: promo.name,
              description: promo.description,
              image_url: promo.image_url,
              status: promo.status,
              specialPrice: promo.price,
              originalPrice: originalPrice,
              items: items,
              tagIds: tagIds,
            };
          }
        );
        setPromotions(mappedPromotions);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchMasterData();
  }, []);

  const handleDeletePromotion = async (id: number) => {
    try {
      const res = await deletePromotionMenu(id);

      // เช็ค statusCode ว่าสำเร็จหรือไม่ (ปรับตัวแปรตาม Response จริงของโปรเจกต์คุณ)
      if (res?.statusCode === 200 || res?.statusCode === 204) {
        alert("Promotion deleted successfully!");

        // ถ้ากำลังกด Edit รายการนี้อยู่ ให้เคลียร์ฟอร์มกลับไปเป็นโหมด Create
        if (editingPromotion?.id === id) {
          setEditingPromotion(null);
        }

        // โหลดข้อมูลใหม่หลังจากลบสำเร็จ
        fetchMasterData();
      } else {
        alert("Failed to delete promotion.");
      }
    } catch (error) {
      console.error("Error deleting promotion:", error);
      alert("An error occurred while deleting.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pb-10">
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Active Promotions
          </h2>
          <p className="text-gray-500">Manage your set menus and bundles.</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {isLoadingData ? (
            <div className="text-center py-10 text-gray-500">
              Loading promotions...
            </div>
          ) : promotions.length === 0 ? (
            <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              No promotions found. Create one on the right!
            </div>
          ) : (
            promotions.map((promo) => (
              <PromotionMenuCard
                key={promo.id}
                promo={promo}
                onEdit={(selectedPromo) => setEditingPromotion(selectedPromo)}
                onDelete={handleDeletePromotion} /* เพิ่ม Prop ตรงนี้ */
              />
            ))
          )}
        </div>
      </div>

      <div className="lg:col-span-1">
        <PromotionFormSection
          availableMenus={availableMenus}
          availableTags={availableTags}
          isLoadingData={isLoadingData}
          editingPromotion={editingPromotion}
          onSuccess={fetchMasterData}
          onCancel={() => setEditingPromotion(null)}
        />
      </div>
    </div>
  );
};
