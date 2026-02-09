import { ILoginData } from "@/types/loginType";

import { apiPost } from "../common";

export const loginService = async (data: ILoginData) => {
  return await apiPost("/auth/master/token", data);
};
