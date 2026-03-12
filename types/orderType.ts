export interface ICreateOrderRequest {
  items: {
    menu_id: number;
    quantity: number;
    note: string;
  }[];
  status: number;
}
