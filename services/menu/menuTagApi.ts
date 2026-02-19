import { getCookie } from "@/libs/cookie";
import { IMenuTag } from "@/types/menuType";

import { apiDelete, apiGet, apiPost, apiPut } from "../common";

export const getMenuTags = async () => {
  const restaurantId = getCookie("restaurant_id");

  if (!restaurantId) {
    throw new Error("Restaurant ID not found");
  }
  const response = await apiGet(`/restaurants/${restaurantId}/tags`);

  return response?.data as IMenuTag[];
};

export const createMenuTag = async (name: string) => {
  const restaurantId = getCookie("restaurant_id");

  if (!restaurantId) {
    throw new Error("Restaurant ID not found");
  }

  return await apiPost(`/restaurants/${restaurantId}/tags`, { name });
};

export const updateMenuTag = async (tagId: string | number, name: string) => {
  const restaurantId = getCookie("restaurant_id");

  if (!restaurantId) {
    throw new Error("Restaurant ID not found");
  }

  // tagId จะถูกแปลงเป็น string อัตโนมัติเมื่ออยู่ใน `${ }`
  return await apiPut(`/restaurants/${restaurantId}/tags/${tagId}`, { name });
};

export const deleteMenuTag = async (tagId: string | number) => {
  const restaurantId = getCookie("restaurant_id");

  if (!restaurantId) {
    throw new Error("Restaurant ID not found");
  }

  return await apiDelete(`/restaurants/${restaurantId}/tags/${tagId}`);
};
