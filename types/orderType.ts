export interface ICreateOrderRequest {
  items: {
    menu_id: number;
    quantity: number;
    note: string;
  }[];
  status: number;
}

export interface ICreateOrderFromSignalR {
  id: string;
  create_time: string;
  update_time: string;
  delete_time: string;
  bill_id: string;
  items: {
    id: string;
    create_time: string;
    update_time: string;
    delete_time: string;
    bill_id: string;
    order_id: string;
    restaurant_id: string;
    menu_id: number;
    price_snapshot: number;
    quantity: number;
    note: string;
  }[];
  status: number;
}
