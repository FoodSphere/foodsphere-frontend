import { getCookie } from "@/libs/cookie";
import { ICreateOrderRequest } from "@/types/orderType";

import { apiGet, apiPost, apiPut } from "../common";

export const getRestaurantId = () => {
  const restaurantId = getCookie("restaurant_id");
  if (!restaurantId) {
    throw new Error("Restaurant ID not found in cookies");
  }
  return restaurantId;
};

// 1. สร้าง Order ใหม่ให้กับ Bill นั้นๆ
export const createOrder = async (
  billId: string,
  payload: ICreateOrderRequest
) => {
  const restaurantId = getRestaurantId();
  const path = `/s/restaurants/${restaurantId}/bills/${billId}/orders`;

  const response = await apiPost(path, payload);
  return response;
};

// 2. ดึง Order ทั้งหมดของ Bill
export const getOrdersByBillId = async (
  billId: string,
  queryString: string = ""
) => {
  const restaurantId = getRestaurantId();
  const path = `/s/restaurants/${restaurantId}/bills/${billId}/orders${queryString}`;

  const response = await apiGet(path);
  return response;
};

// 3. ดึง Order ทั้งหมดของทุก Bill
export const getAllOrders = async () => {
  const restaurantId = getRestaurantId();
  const path = `/s/restaurants/${restaurantId}/order/list?bill_status=0`;

  const response = await apiGet(path);
  return response;
};

// 4. อัปเดตสถานะของ Order
export const updateOrderStatus = async (
  billId: string,
  orderId: string, // ต้องแยก orderId ออกมา
  status: number
) => {
  const restaurantId = getRestaurantId();
  // สังเกตว่าผมส่ง Order ID ไปใน URL ด้วย
  const path = `/s/restaurants/${restaurantId}/bills/${billId}/orders/${orderId}/status`;

  // Payload มีแค่ { status: x } ตามที่คุณแจ้ง
  const payload = { status };

  const response = await apiPut(path, payload);
  return response;
};

// 5. check จำนวน limit ในการสั่ง Order
export const CheckOrdersLimit = async (
  payload: ICreateOrderRequest
) => {
  const restaurantId = getRestaurantId();
  const path = `/s/restaurants/${restaurantId}/order/probe`;

  const response = await apiPost(path, payload);
  return response;
};