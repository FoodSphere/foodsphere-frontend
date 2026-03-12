import { getCookie } from "@/libs/cookie";
import {
  IBillResponse,
  ICreateBillRequest,
  IPortalCreateRequest,
} from "@/types/billType";

import { apiGet, apiPost } from "../common";

export const getRestaurantId = () => {
  const restaurantId = getCookie("restaurant_id");
  if (!restaurantId) {
    throw new Error("Restaurant ID not found in cookies");
  }
  return restaurantId;
};

// 1. สร้าง Bill
export const createBill = async (payload: ICreateBillRequest) => {
  const restaurantId = getRestaurantId();
  const path = `/s/restaurants/${restaurantId}/bills`;

  const response = await apiPost(path, payload);
  return response;
};

// 2. ดึงข้อมูล Bill ทั้งหมด
export const getAllBills = async () => {
  const restaurantId = getRestaurantId();
  const path = `/s/restaurants/${restaurantId}/bills`;

  const response = await apiGet(path);
  return response;
};

// 3. ดึงข้อมูล Bill ราย ID
export const getBillById = async (billId: string) => {
  const restaurantId = getRestaurantId();
  const path = `/s/restaurants/${restaurantId}/bills/${billId}`;

  const response = await apiGet(path);
  return response;
};

// 4. Helper Function: หา Bill ปัจจุบันของโต๊ะ (status = 0) แล้วไป Fetch ข้อมูลเต็ม
export const getActiveBillByTableId = async (tableId: number) => {
  // ดึงบิลทั้งหมดมาก่อน
  const resAllBills = await getAllBills();

  if (resAllBills && resAllBills.data) {
    // กรองเอาเฉพาะที่ status = 0 และ table_id ตรงกับโต๊ะที่เลือก
    const activeBill = resAllBills.data.find(
      (bill: IBillResponse) => bill.status === 0 && bill.table_id === tableId
    );

    // ถ้าเจอบิลที่เปิดอยู่ ให้เอา ID ไป Get ข้อมูลแบบละเอียดอีกครั้ง
    if (activeBill) {
      return await getBillById(activeBill.id);
    }
  }

  return null; // ถ้าไม่เจอบิลที่เปิดอยู่เลย
};

// 5. สร้าง Ordering Portal สำหรับ Bill นั้นๆ
export const createOrderingPortal = async (
  billId: string,
  payload: IPortalCreateRequest
) => {
  const restaurantId = getRestaurantId();
  const path = `/s/restaurants/${restaurantId}/bills/${billId}/portals`;

  const response = await apiPost(path, payload);
  return response;
};

// 6. ฟังก์ชันสำหรับ List Ordering Portals ทั้งหมดของ Bill
export const getPortalsByBillId = async (billId: string) => {
  const restaurantId = getRestaurantId();
  const path = `/s/restaurants/${restaurantId}/bills/${billId}/portals`;

  const response = await apiGet(path);
  return response;
};

// 7. ดึงข้อมูล Ordering Portal
export const getOrderingPortal = async (billId: string, portalId: string) => {
  const restaurantId = getRestaurantId();
  const path = `/s/restaurants/${restaurantId}/bills/${billId}/portals/${portalId}`;

  const response = await apiGet(path);
  return response;
};