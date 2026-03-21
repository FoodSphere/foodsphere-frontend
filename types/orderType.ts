export interface IOrder {
  id: string;
  originalOrderId: number;
  billId: string;
  img?: string | null;
  foodName: string;
  table: string;
  additionalDetail?: string;
  quantity: string;
  order_at: string;
  status: string;
}

export interface ICreateOrderRequest {
  items: {
    menu_id: number;
    quantity: number;
    note: string;
  }[];
  status: number;
}

export interface ICreateOrderFromSignalR {
  id: number;
  create_time: string;
  update_time: string | null;
  delete_time: string | null;
  bill_id: string;
  table: { id: number; name: string };
  items: [
    {
      id: number;
      create_time: string;
      update_time: string | null;
      bill_id: string;
      order_id: number;
      restaurant_id: string;
      menu_id: number;
      price_snapshot: number;
      quantity: number;
      note: string | null;
    },
  ];
  status: number;
}

export interface IUpdateOrderStatusFromSignalR {
  resource: {
    billId: string;
    id: number;
  };
  status: number;
}

export interface IUpdateOrderItemFromSignalR {
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
