export interface IStockTag {
  id: number;
  create_time: string;
  update_time: string;
  restaurant_id: string;
  name: string;
}

export interface IIngredientResponse {
  id: number;
  restaurant_id: string;
  name: string;
  tags: {
    tag_id: number;
    name: string;
  }[];
  stock: number;
  unit: string;
  description: string;
  image_url: string;
  status: number;
}

export interface ICreateIngredientRequest {
  name: string;
  stock: number;
  tags: { tag_id: number }[];
  unit: string;
  description: string;
  status: number
}

export interface IUpdateIngredientRequest {
  name: string;
  stock: number;
  tags: { tag_id: number }[];
  unit: string;
  description: string;
  status: number
}
