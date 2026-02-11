import { apiGet } from "@/services/common";
import { ILoginData } from "@/types/loginType";

import { apiPost } from "../common";

export const loginService = async (data: ILoginData) => {
  return await apiPost("/auth/master/token", data);
};

export const getMyRestaurantService = async () => {
  return await apiGet("/s/restaurants");
};
