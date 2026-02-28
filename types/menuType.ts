
export interface IMenuTag {
  id: number;
  create_time: string;
  update_time: string;
  restaurant_id: string;
  name: string;
}

export interface IMenuResponse {
  id: number;
  create_time: string;
  update_time: string;
  restaurant_id: string;
  name: string;
  price: number;
  ingredients: {
    ingredient: { id: number; name: string; unit: string; image_url: string };
    amount: number;
  }[];
  tags: {
    tag_id: number;
    name: string;
  }[];
  display_name: string;
  description: string;
  image_url: string;
  status: number;
}

export interface ICreateMenuRequest {
  name: string;
  price: number;
  ingredients: {
    ingredient_id: number;
    amount: number;
  }[];
  tags: {
    tag_id: number;
  }[];
  display_name: string;
  description: string;
}

export interface IUpdateMenuRequest {
  name: string;
  price: number;
  ingredients: {
    ingredient_id: number;
    amount: number;
  }[];
  tags: {
    tag_id: number;
  }[];
  display_name: string;
  description: string;
}
