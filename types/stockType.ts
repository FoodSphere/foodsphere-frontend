export interface IStockTag {
  id: number;
  create_time: string;
  update_time: string;
  restaurant_id: string;
  name: string;
}

export interface IStockIngredientResponse {
  id: number;
  tags: { id: number; name: string }[]; // เดา structure ของ tag จากการใช้งานทั่วไป
  name: string;
  description: string;
  unit: string;
  stock: number;
}
