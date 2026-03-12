import { getCookie } from "@/libs/cookie";
import { ICreatePromotionMenuRequest, IPromotionMenuResponse, IUpdatePromotionMenuRequest } from "@/types/menuType";

import { apiDelete, apiGet, apiPost, apiPut } from "../common";

const getRestaurantId = () => {
  const restaurantId = getCookie("restaurant_id");
  if (!restaurantId) {
    throw new Error("Restaurant ID not found in cookies");
  }
  return restaurantId;
};

// Get Promotion Menu
export const getPromotionMenus = async () => {
  const restaurantId = getRestaurantId();

  return await apiGet(`/restaurants/${restaurantId}/menus?has_components=true`);
};

// GET Promotion Menu By ID
export const getPromotionMenuById = async (menuId: number) => {
  const restaurantId = getRestaurantId();
  const path = `/restaurants/${restaurantId}/menus/${menuId}`;

  const response = await apiGet(path);
  return response;
};

// Create Promotion Menu (สร้างเมนูเปล่า)
export const createPromotionMenu = async (payload: ICreatePromotionMenuRequest) => {
  const restaurantId = getRestaurantId();

  return await apiPost(`/restaurants/${restaurantId}/menus`, payload);
};

// Upload Image
export const uploadPromotionMenuImage = async (menuId: number, file: File) => {
  const restaurantId = getRestaurantId();

  // แปลง File เป็น FormData ตามที่ commonService: apiPost รองรับ
  const formData = new FormData();
  formData.append("file", file);

  return await apiPost(
    `/restaurants/${restaurantId}/menus/${menuId}/image`,
    formData
  );
};

// --- Main Function: Create Promotion Menu with Image ---
export const createPromotionMenuWithImage = async (
  data: ICreatePromotionMenuRequest,
  imageFile?: File | null
) => {
  try {
    // 1. สร้างเมนู
    const createRes = await createPromotionMenu(data);

    if (createRes?.statusCode === 200 || createRes?.statusCode === 201) {
      const createData = createRes.data as IPromotionMenuResponse;

      // 2. ถ้ามีไฟล์รูป ให้ยิง API อัปโหลดรูปต่อทันทีโดยใช้ ID ที่ได้มา
      if (imageFile && createData.id) {
        await uploadPromotionMenuImage(createData.id, imageFile);
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

// แก้ไข menu
export const updatePromotionMenu = async (
  menuId: number,
  payload: IUpdatePromotionMenuRequest
) => {
  const restaurantId = getRestaurantId();
  return await apiPut(`/restaurants/${restaurantId}/menus/${menuId}`, payload);
};

export const updatePromotionMenuWithImage = async (
  id: number,
  data: IUpdatePromotionMenuRequest,
  imageFile?: File | null
) => {
  try {
    // 1. เรียก API แก้ไขข้อมูล (PUT)
    const updateRes = await updatePromotionMenu(id, data);

    // เช็คว่า update ข้อมูลสำเร็จไหม (PUT มักจะ return 200 หรือ 204)
    if (updateRes?.statusCode === 200 || updateRes?.statusCode === 204) {
      // 2. ถ้ามีไฟล์รูปภาพใหม่ ให้เรียก API Upload Image ทับของเดิม
      if (imageFile) {
        await uploadPromotionMenuImage(id, imageFile);
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
export const deletePromotionMenu = async (menuId: number) => {
  const restaurantId = getRestaurantId();

  const path = `/restaurants/${restaurantId}/menus/${menuId}`;
  return await apiDelete(path);
};
