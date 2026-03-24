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
  components: {
    menu_id: number;
    quantity: number;
  }[];
  ingredients: {
    ingredient: {
      id: number;
      name: string;
      unit: string;
      image_url: string;
      status: number;
    };
    amount: number;
  }[];
  tags: {
    tag_id: number;
    name: string;
  }[];
  display_name: string;
  description: string;
  image_url: string;
  stock_availability: boolean;
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
  status: number;
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
  status: number;
}

export interface IPromotionMenuResponse {
  id: number;
  create_time: string;
  update_time: string;
  restaurant_id: string;
  name: string;
  price: number;
  components: {
    menu_id: number;
    quantity: number;
    // เพิ่ม 2 ตัวนี้ตามที่ Backend ส่งมาครับ
    stock_availability: boolean;
    menu_status: number;
  }[];
  tags: {
    tag_id: number;
    name: string;
  }[];
  display_name: string;
  description: string;
  image_url: string;
  stock_availability: boolean;
  status: number;
}

export interface ICreatePromotionMenuRequest {
  name: string;
  price: number;
  ingredients?: {
    ingredient_id: number;
    amount: number;
  }[];
  components: {
    menu_id: number;
    quantity: number;
  }[];
  tags: {
    tag_id: number;
  }[];
  display_name: string;
  description: string;
  status: number;
}

export interface IUpdatePromotionMenuRequest {
  name: string;
  price: number;
  ingredients?: {
    ingredient_id: number;
    amount: number;
  }[];
  components: {
    menu_id: number;
    quantity: number;
  }[];
  tags: {
    tag_id: number;
  }[];
  display_name: string;
  description: string;
  status: number;
}
