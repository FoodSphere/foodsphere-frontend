import { getCookie } from "@/libs/cookie";
import {
  ICreateIngredientRequest,
  IIngredientResponse,
  IUpdateIngredientRequest,
} from "@/types/stockType";

import { apiDelete, apiGet, apiPost, apiPut } from "../common";

const getRestaurantId = () => {
  const restaurantId = getCookie("restaurant_id");
  if (!restaurantId) {
    throw new Error("Restaurant ID not found in cookies");
  }
  return restaurantId;
};

// เรียก ingredient
export const getIngredients = async () => {
  const restaurantId = getRestaurantId();

  return await apiGet(`/s/restaurants/${restaurantId}/ingredients`);
};

// สร้าง Ingredient
export const createIngredient = async (payload: ICreateIngredientRequest) => {
  const restaurantId = getRestaurantId();

  return await apiPost(`/s/restaurants/${restaurantId}/ingredients`, payload);
};

// Upload รูปภาพ
export const uploadIngredientImage = async (
  ingredientId: number,
  file: File
) => {
  const restaurantId = getRestaurantId();

  // สร้าง FormData สำหรับส่งไฟล์
  const formData = new FormData();
  formData.append("file", file);

  return await apiPost(
    `/restaurants/${restaurantId}/ingredients/${ingredientId}/image`,
    formData
  );
};

// แก้ไข ingredient
export const updateIngredient = async (
  ingredientId: number,
  payload: IUpdateIngredientRequest
) => {
  const restaurantId = getRestaurantId();
  return await apiPut(
    `/s/restaurants/${restaurantId}/ingredients/${ingredientId}`,
    payload
  );
};

//  Main Function: รวม 2 ขั้นตอนเข้าด้วยกัน
export const createIngredientWithImage = async (
  data: ICreateIngredientRequest,
  imageFile?: File | null
) => {
  try {
    // 1. สร้าง Ingredient ก่อน
    const createRes = await createIngredient(data);

    if (createRes?.statusCode === 200 || createRes?.statusCode === 201) {
      const createdData = createRes.data as IIngredientResponse;

      // 2. ถ้ามีรูปภาพ ให้ Upload ตามไปโดยใช้ ID ที่ได้จากขั้นตอนแรก
      if (imageFile && createdData.id) {
        await uploadIngredientImage(createdData.id, imageFile);
      }

      return createRes;
    } else {
      // กรณีสร้างไม่สำเร็จ
      return createRes;
    }
  } catch (error) {
    console.error("Error creating ingredient:", error);
    throw error;
  }
};

export const updateIngredientWithImage = async (
  id: number,
  data: IUpdateIngredientRequest,
  imageFile?: File | null
) => {
  try {
    // 1. เรียก API แก้ไขข้อมูล (PUT)
    const updateRes = await updateIngredient(id, data);

    // เช็คว่า update ข้อมูลสำเร็จไหม (PUT มักจะ return 200 หรือ 204)
    if (updateRes?.statusCode === 200 || updateRes?.statusCode === 204) {
      // 2. ถ้ามีไฟล์รูปภาพใหม่ ให้เรียก API Upload Image ทับของเดิม
      if (imageFile) {
        await uploadIngredientImage(id, imageFile);
      }

      return updateRes;
    } else {
      return updateRes;
    }
  } catch (error) {
    console.error("Error updating ingredient chain:", error);
    throw error;
  }
};

// ลบ ingredient
export const deleteIngredient = async (ingredientId: number) => {
  const restaurantId = getRestaurantId();

  const path = `/restaurants/${restaurantId}/ingredients/${ingredientId}`;
  return await apiDelete(path);
};