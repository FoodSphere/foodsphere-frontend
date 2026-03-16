import { getCookie } from "@/libs/cookie";

import { apiGet } from "../common";

const getRestaurantId = () => {
  const restaurantId = getCookie("restaurant_id");
  if (!restaurantId) {
    throw new Error("Restaurant ID not found in cookies");
  }
  return restaurantId;
};

// Get Revenue
export const getRevenue = async (queryString: string = "") => {
  const restaurantId = getRestaurantId();

  return await apiGet(
    `/restaurants/${restaurantId}/report/revenue?${queryString}`
  );
};

// Get count bills
export const getCountBill = async (queryString: string = "") => {
  const restaurantId = getRestaurantId();

  return await apiGet(
    `/restaurants/${restaurantId}/report/bill?${queryString}`
  );
};

// Get count all orders
export const getCountOrder = async (queryString: string = "") => {
  const restaurantId = getRestaurantId();

  return await apiGet(
    `/restaurants/${restaurantId}/report/menu-sold/count?${queryString}`
  );
};

// Get count of each order
export const getCountEachOrder = async (queryString: string = "") => {
  const restaurantId = getRestaurantId();

  return await apiGet(
    `/restaurants/${restaurantId}/report/menu-sold?${queryString}`
  );
};

// Get payment transaction
export const getPaymentTransaction = async (queryString: string = "") => {
  const restaurantId = getRestaurantId();

  return await apiGet(
    `/restaurants/${restaurantId}/report/payments?status=1&status=2&${queryString}`
  );
};

// Get stock use
export const getStockUse = async (queryString: string = "") => {
  const restaurantId = getRestaurantId();

  return await apiGet(
    `/restaurants/${restaurantId}/branches/1/stock/transactions?${queryString}`
  );
};
