import { getCookie } from "@/libs/cookie";

import { apiDelete, apiGet, apiPost, apiPut } from "../common";
import { EServiceRequestStatus } from "@/types/enum";

export const getRestaurantId = () => {
  const restaurantId = getCookie("restaurant_id");
  if (!restaurantId) {
    throw new Error("Restaurant ID not found in cookies");
  }
  return restaurantId;
};

export const updateServiceRequestStatus = async (
  requestId: string,
  billId: string,
  status: EServiceRequestStatus
) => {
  return apiPut(
    `/restaurants/${getRestaurantId()}/bills/${billId}/service-requests/${requestId}`,
    { status }
  );
};
