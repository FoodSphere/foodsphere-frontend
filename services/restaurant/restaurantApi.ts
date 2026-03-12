import { getCookie } from "@/libs/cookie";
import { IUpdateRestaurantRequest } from "@/types/restaurantType";

import { apiGet, apiPost, apiPut } from "../common";

const getRestaurantId = () => {
  const restaurantId = getCookie("restaurant_id");
  if (!restaurantId) {
    throw new Error("Restaurant ID not found in cookies");
  }
  return restaurantId;
};

// Get Restaurant
export const getRestaurant = async () => {
  const restaurantId = getRestaurantId();
  return await apiGet(`/s/restaurants/${restaurantId}`);
};

// Update Restaurant
export const updateRestaurant = async (payload: IUpdateRestaurantRequest) => {
  const restaurantId = getRestaurantId();
  return await apiPut(`/s/restaurants/${restaurantId}`, payload);
};

export const uploadRestaurantImage = async (image: File) => {
  const restaurantId = getRestaurantId();
  const formData = new FormData();
  formData.append("file", image);
  return await apiPost(`/restaurants/${restaurantId}/image`, formData);
};
