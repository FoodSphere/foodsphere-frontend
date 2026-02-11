import { getCookie } from "@/libs/cookie";
import { IStockTag } from "@/types/stockType";

import { apiDelete, apiGet, apiPost, apiPut } from "../common";

export const getStockTags = async () => {
  const restaurantId = getCookie("restaurant_id");

  if (!restaurantId) {
    console.log("Restaurant ID not found in cookies");
    return null;
  }
  const response = await apiGet(`/restaurants/${restaurantId}/tags`);

  return response?.data as IStockTag[];
};

export const createStockTag = async (name: string) => {
  const restaurantId = getCookie("restaurant_id");

  if (!restaurantId) {
    console.log("Restaurant ID not found");
  }

  return await apiPost(`/restaurants/${restaurantId}/tags`, { name });
};

export const updateStockTag = async (tagId: string | number, name: string) => {
  const restaurantId = getCookie("restaurant_id");

  if (!restaurantId) {
    throw new Error("Restaurant ID not found");
  }

  // tagId จะถูกแปลงเป็น string อัตโนมัติเมื่ออยู่ใน `${ }`
  return await apiPut(`/restaurants/${restaurantId}/tags/${tagId}`, { name });
};

export const deleteStockTag = async (tagId: string | number) => {
  const restaurantId = getCookie("restaurant_id");

  if (!restaurantId) {
    throw new Error("Restaurant ID not found");
  }

  return await apiDelete(`/restaurants/${restaurantId}/tags/${tagId}`);
};
