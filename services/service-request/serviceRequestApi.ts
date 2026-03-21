import { getCookie } from "@/libs/cookie";
import { EServiceRequestStatus } from "@/types/enum";

import { apiGet, apiPut } from "../common";

export const getRestaurantId = () => {
  const restaurantId = getCookie("restaurant_id");
  if (!restaurantId) {
    throw new Error("Restaurant ID not found in cookies");
  }
  return restaurantId;
};

export const getServiceRequests = async () => {
  const restaurantId = getRestaurantId();
  return apiGet(
    `/restaurants/${restaurantId}/service-requests?status=0&status=1`
  );
};

export const updateServiceRequestStatus = async (
  requestId: string,
  billId: string,
  status: EServiceRequestStatus
) => {
  const restaurantId = getRestaurantId();
  return apiPut(
    `/restaurants/${restaurantId}/bills/${billId}/service-requests/${requestId}`,
    { status }
  );
};
