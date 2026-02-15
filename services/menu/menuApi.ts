import { getCookie } from "@/libs/cookie";

import { apiDelete, apiGet, apiPost, apiPut } from "../common";

export const getMenus = async () => {
  const restaurantId = getCookie("restaurant_id");

  if (!restaurantId) {
    throw new Error("Restaurant ID not found");
  }

  return await apiGet(`/restaurants/${restaurantId}/menus`);
};