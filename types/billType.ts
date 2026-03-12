export interface ICreateBillRequest {
  table_id: number;
  pax: number;
  consumer_id?: string | null;
}

export interface IBillItem {
  id: number;
  create_time: string;
  update_time: string;
  bill_id: string;
  order_id: number;
  restaurant_id: string;
  menu_id: number;
  price_snapshot: number;
  quantity: number;
  note: string;
}

export interface IBillOrder {
  id: number;
  create_time: string;
  update_time: string;
  bill_id: string;
  items: IBillItem[];
  status: number;
}

export interface IBillResponse {
  id: string;
  create_time: string;
  update_time: string;
  restaurant_id: string;
  branch_id: number;
  table_id: number;
  consumer_id: string | null;
  orders: IBillOrder[];
  pax: number;
  status: number;
}

export interface IPortalCreateRequest {
  max_usage: number;
  valid_duration: string | null;
}

export interface IPortalResponse {
  id: string;
  bill_id: string;
  create_time: string;
  update_time: string;
  max_usage: number;
  usage_count: number;
  valid_duration: string;
}