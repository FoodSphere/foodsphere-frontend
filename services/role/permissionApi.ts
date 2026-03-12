import { apiGet, apiPut } from "../common";
import { getCookie } from "@/libs/cookie";

const getRestaurantId = () => {
  const restaurantId = getCookie("restaurant_id");
  if (!restaurantId) {
    throw new Error("Restaurant ID not found in cookies");
  }
  return restaurantId;
};


export const getPermissionsGroupName = (groupName: string) => {
  return groupName.split(".")[0];
}; 

export const getPermissions = async () => {
  return await apiGet(`/permissions`);
};

export const updateRolePermission = async (role_id: number, payload: number[]) => {
  const restaurantId = getRestaurantId();
  return await apiPut(`/restaurants/${restaurantId}/roles/${role_id}/permissions`, payload);
};
