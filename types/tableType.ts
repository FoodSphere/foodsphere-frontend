export interface ITableResponse {
  id: number;
  create_time: string;
  update_time: string;
  restaurant_id: string;
  branch_id: number;
  name: string;
  status: number;
}

export interface UpdatedTableFromSignalR {
  resource: {
    restaurantId: string;
    branchId: number;
    id: number;
  };
  status: number;
}