import { getCookie } from "@/libs/cookie";
import {
  ICreateMenuRequest,
  IMenuResponse,
  IUpdateMenuRequest,
} from "@/types/menuType";

import { apiDelete, apiGet, apiPost, apiPut } from "../common";

const getRestaurantId = () => {
  const restaurantId = getCookie("restaurant_id");
  if (!restaurantId) {
    throw new Error("Restaurant ID not found in cookies");
  }
  return restaurantId;
};

// Get Menu
export const getMenus = async () => {
  const restaurantId = getRestaurantId();

  return await apiGet(`/restaurants/${restaurantId}/menus`);
};

// GET Menu By ID
export const getMenuById = async (menuId: number) => {
  const restaurantId = getRestaurantId();
  const path = `/restaurants/${restaurantId}/menus/${menuId}`;

  const response = await apiGet(path);
  return response;
};

// Create Menu (สร้างเมนูเปล่า)
export const createMenu = async (payload: ICreateMenuRequest) => {
  const restaurantId = getRestaurantId();

  return await apiPost(`/restaurants/${restaurantId}/menus`, payload);
};

// Upload Image
export const uploadMenuImage = async (menuId: number, file: File) => {
  const restaurantId = getRestaurantId();

  // แปลง File เป็น FormData ตามที่ commonService: apiPost รองรับ
  const formData = new FormData();
  formData.append("file", file);

  return await apiPost(
    `/restaurants/${restaurantId}/menus/${menuId}/image`,
    formData
  );
};

// แก้ไข menu
export const updateMenu = async (
  menuId: number,
  payload: IUpdateMenuRequest
) => {
  const restaurantId = getRestaurantId();
  return await apiPut(
    `/restaurants/${restaurantId}/menus/${menuId}`,
    payload
  );
};

// --- Main Function: Create Menu with Image ---
export const createMenuWithImage = async (
  data: ICreateMenuRequest,
  imageFile?: File | null
) => {
  try {
    // 1. สร้างเมนู
    const createRes = await createMenu(data);

    if (createRes?.statusCode === 200 || createRes?.statusCode === 201) {
      const createData = createRes.data as IMenuResponse;

      // 2. ถ้ามีไฟล์รูป ให้ยิง API อัปโหลดรูปต่อทันทีโดยใช้ ID ที่ได้มา
      if (imageFile && createData.id) {
        await uploadMenuImage(createData.id, imageFile);
      }

      return createRes;
    } else {
      // กรณีสร้างไม่สำเร็จ
      return createRes;
    }
  } catch (error) {
    console.error("Error creating menu:", error);
    throw error;
  }
};

export const updateMenuWithImage = async (
  id: number,
  data: IUpdateMenuRequest,
  imageFile?: File | null
) => {
  try {
    // 1. เรียก API แก้ไขข้อมูล (PUT)
    const updateRes = await updateMenu(id, data);

    // เช็คว่า update ข้อมูลสำเร็จไหม (PUT มักจะ return 200 หรือ 204)
    if (updateRes?.statusCode === 200 || updateRes?.statusCode === 204) {
      // 2. ถ้ามีไฟล์รูปภาพใหม่ ให้เรียก API Upload Image ทับของเดิม
      if (imageFile) {
        await uploadMenuImage(id, imageFile);
      }

      return updateRes;
    } else {
      return updateRes;
    }
  } catch (error) {
    console.error("Error updating menu:", error);
    throw error;
  }
};

// ลบ menu
export const deleteMenu = async (menuId: number) => {
  const restaurantId = getRestaurantId();

  const path = `/restaurants/${restaurantId}/menus/${menuId}`;
  return await apiDelete(path);
};
