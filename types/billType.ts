export interface ICreateBillRequest {
  table_id: number;
  pax: number;
  consumer_id?: string | null;
}

// 2. กำหนด Interface สำหรับ Response (อ้างอิงจากตัวอย่างที่คุณให้มา)
export interface ICreateBillResponse {
  id: string;
  create_time: string;
  update_time: string;
  restaurant_id: string;
  branch_id: number;
  table_id: number;
  consumer_id: string | null;
  orders: any[]; // ใส่ any[] ไว้ก่อน หรือจะสร้าง Interface ย่อยสำหรับ Order ก็ได้ครับ
  pax: number;
  status: number;
}