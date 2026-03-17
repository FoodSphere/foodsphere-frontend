import { getCookie } from "@/libs/cookie";
import { ICreateStaffRequest, IStaffPortalRequest, IUpdateStaffRequest } from "@/types/staffType";
import { apiDelete, apiGet, apiPost, apiPut } from "../common";

const getRestaurantId = () => {
  const restaurantId = getCookie("restaurant_id");
  if (!restaurantId) {
    throw new Error("Restaurant ID not found in cookies");
  }
  return restaurantId;
};

export const getStaffs = async () => {
  const restaurantId = getRestaurantId();
  return await apiGet(`/s/restaurants/${restaurantId}/workers`);
};

export const createStaff = async (staff: ICreateStaffRequest) => {
  const restaurantId = getRestaurantId();
  return await apiPost(`/s/restaurants/${restaurantId}/workers`, staff);
};

export const updateStaff = async (
  staffId: number,
  staff: IUpdateStaffRequest
) => {
  const restaurantId = getRestaurantId();
  return await apiPut(
    `/s/restaurants/${restaurantId}/workers/${staffId}`,
    staff
  );
};

export const deleteStaff = async (staffId: number) => {
  const restaurantId = getRestaurantId();
  return await apiDelete(`/s/restaurants/${restaurantId}/workers/${staffId}`);
};

export const createStaffPortal = async (staffId: number) => {
  const restaurantId = getRestaurantId();
  return await apiPut(`/s/restaurants/${restaurantId}/workers/${staffId}/portal`, {});
};

export const loginStaffWithPortal = async (staff_portal_id: string) => {
  const request: IStaffPortalRequest = {
    portal_id: staff_portal_id,
  };
  return await apiPost(`/auth/worker/token`, request);
};
