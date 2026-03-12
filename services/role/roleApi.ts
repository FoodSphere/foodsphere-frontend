import { getCookie } from "@/libs/cookie";
import { ICreateRoleRequest, IUpdateRoleRequest } from "@/types/roleType";
import { apiDelete, apiGet, apiPost, apiPut } from "../common";

const getRestaurantId = () => {
  const restaurantId = getCookie("restaurant_id");
  if (!restaurantId) {
    throw new Error("Restaurant ID not found in cookies");
  }
  return restaurantId;
};

export const getRoles = async () => {
  const restaurantId = getRestaurantId();
  return await apiGet(`/restaurants/${restaurantId}/roles`);
};

export const createRole = async (payload: ICreateRoleRequest) => {
  const restaurantId = getRestaurantId();
  return await apiPost(`/restaurants/${restaurantId}/roles`, payload);
};

export const updateRole = async (
  roleId: number,
  payload: IUpdateRoleRequest
) => {
  const restaurantId = getRestaurantId();
  return await apiPut(`/restaurants/${restaurantId}/roles/${roleId}`, payload);
};

export const deleteRole = async (roleId: number) => {
  const restaurantId = getRestaurantId();
  return await apiDelete(`/restaurants/${restaurantId}/roles/${roleId}`);
};
