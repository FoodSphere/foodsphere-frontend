export interface IRole {
  name: string;
  description: string | null;
  permission_ids: number[];
}

export interface IRoleWithId extends IRole {
  id: number;
}

export interface IRoleMap {
  [key: number]: string;
}

export interface IPermission {
  id: number;
  name: string;
  description: string | null;
}

export interface IPermissionsGroup {
  title: string;
  permissions: IPermission[];
}

export interface IPermissionResponse extends IPermission {}

export interface IUpdateRoleRequest extends IRole {}

export interface ICreateRoleRequest extends IRole {}

export interface IRoleResponse extends IRole {
  id: number;
  create_time: string;
  update_time: string;
  restaurant_id: string;
}
