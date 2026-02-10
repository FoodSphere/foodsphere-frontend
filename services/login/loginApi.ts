import { apiGet } from "@/services/common";
import { ILoginData } from "@/types/loginType";

import { apiPost } from "../common";

export const loginService = async (data: ILoginData) => {
  return await apiPost("/auth/master/token", data);
};

export const getMyRestaurantService = async () => {
  // API นี้ต้องใช้ Bearer Token ซึ่ง apiGet จัดการให้แล้วผ่าน getAuthHeader
  return await apiGet("/restaurants");
};
