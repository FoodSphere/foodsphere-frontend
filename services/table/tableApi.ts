import { getCookie } from "@/libs/cookie";

import { apiDelete, apiGet, apiPost, apiPut } from "../common";

export const getRestaurantId = () => {
  const restaurantId = getCookie("restaurant_id");
  if (!restaurantId) {
    throw new Error("Restaurant ID not found in cookies");
  }
  return restaurantId;
};

// GET Tables
export const getTables = async () => {
  const restaurantId = getRestaurantId();
  const path = `/s/restaurants/${restaurantId}/tables`;

  const response = await apiGet(path);
  return response;
};

// CREATE Table
export const createTable = async (name: string) => {
  const restaurantId = getRestaurantId();
  const path = `/s/restaurants/${restaurantId}/tables`;
  const payload = { name };

  const response = await apiPost(path, payload);
  return response;
};

// DELETE Table
export const deleteTable = async (tableId: number | string) => {
  const restaurantId = getRestaurantId();
  const path = `/s/restaurants/${restaurantId}/tables/${tableId}`;

  const response = await apiDelete(path);
  return response;
};

// UPDATE Table
export const updateTable = async (tableId: number | string, name: string) => {
  const restaurantId = getRestaurantId();
  const path = `/s/restaurants/${restaurantId}/tables/${tableId}?branch_id=1`;

  const response = await apiPut(path, { name });
  return response;
};
