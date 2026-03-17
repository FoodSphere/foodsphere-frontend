export interface IStaff {
  name: string;
  roles: number[];
  phone: string;
}

export interface IStaffWithId extends IStaff {
  id: number;
}

export interface ICreateStaffRequest extends IStaff {}

export interface IUpdateStaffRequest extends IStaff {}

export interface IStaffResponse extends IStaffWithId {
  restaurant_id: number;
}

export interface IStaffWithMappedRole extends IStaffWithId {
  role_name: string;
}

export interface IStaffPortalRequest {
  portal_id: string;
}