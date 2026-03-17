import { ECashPaymentStatusNumber } from "./enum";

export interface CashPaymentResponse {
  id: number;
  bill_id: string;
  create_time: string;
  update_time: string;
  payment_method: string;
  amount: number;
  status: ECashPaymentStatusNumber;
  table: {
    id: number;
    name: string;
  };
}
