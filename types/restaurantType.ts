export interface IContact {
    name: string | null;
    email: string | null;
    phone: string | null;
}

interface IRestaurant {
    contact: IContact,
    name: string | null;
    display_name: string | null;
    address: string | null;
    opening_time: string | null;
    closing_time: string | null;
}

export interface IGetRestaurantResponse extends IRestaurant {
    restaurant_id: string;
    image_url: string | null;
}

export interface IUpdateRestaurantRequest extends IRestaurant {}