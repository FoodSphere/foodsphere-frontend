import { getCookie } from "@/libs/cookie";
import { ICreateBillRequest } from "@/types/billType";

import { apiPost } from "../common";

export const getRestaurantId = () => {
  const restaurantId = getCookie("restaurant_id");
  if (!restaurantId) {
    throw new Error("Restaurant ID not found in cookies");
  }
  return restaurantId;
};

export const createBill = async (payload: ICreateBillRequest) => {
  const restaurantId = getRestaurantId();
  const path = `/restaurants/${restaurantId}/bills`;

  const response = await apiPost(path, payload);
  return response;
};
