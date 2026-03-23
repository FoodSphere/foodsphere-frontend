"use client";

import { useEffect, useState } from "react";

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

import { PromotionConfirmModal } from "./PromotionConfirmModal";
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

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState<number | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

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
                price: itemPrice,
              };
            });

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

  const requestDeletePromotion = (id: number) => {
    setPromotionToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const executeDeletePromotion = async () => {
    if (!promotionToDelete) return;

    setIsDeleting(true);
    try {
      const res = await deletePromotionMenu(promotionToDelete);

      if (res?.statusCode === 200 || res?.statusCode === 204) {
        if (editingPromotion?.id === promotionToDelete) {
          setEditingPromotion(null);
        }
        fetchMasterData();
      } else {
        console.error("Failed to delete promotion.");
      }
    } catch (error) {
      console.error("Error deleting promotion:", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setPromotionToDelete(null);
    }
  };

  return (
    <>
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
                  onDelete={requestDeletePromotion}
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

      {/* --- Delete Modal --- */}
      <PromotionConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Promotion"
        message="Are you sure you want to delete this promotion? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={executeDeletePromotion}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setPromotionToDelete(null);
        }}
      />
    </>
  );
};
