export interface IMenuTag {
  id: number;
  create_time: string;
  update_time: string;
  restaurant_id: string;
  name: string;
}

export interface IMenuApiResponse {
  id: number;
  create_time: string;
  update_time: string;
  restaurant_id: string;
  tags: {
    tag_id: number;
    name: string;
  }[];
  ingredients: {
    ingredient_id: number;
    amount: number;
  }[];
  name: string;
  price: number;
  display_name: string;
  description: string; 
  image_url: string;
  status: number;
}