export type User = {
    deliveryCity: string;
    deliveryVehicle: string;
    email: string;
    firstName: string;
    lastName: string;
    password?: string;
    phone: string;
};

export type RegisterUser = User & {password: string; rePassword: string};

export type ProductOrderStatus = 'pending' | 'saved' | 'not-available';

export interface Product {
    brand: string;
    category: ReadonlyArray<string>;
    currency: string;
    daysAfterOpened?: number;
    discount: boolean;
    ean?: string;
    id: string;
    img: string;
    items?: ReadonlyArray<{date: string | null}>;
    name: string;
    note?: string;
    novaGroups: '1' | '2' | '3' | '4';
    nutriments?: Nutriments;
    nutriscoreGrade: 'a' | 'b' | 'c' | 'd' | 'e';
    price: {original?: string; final: string};
    quantity: number;
    specialOffer?: SpecialOffers;
    specialOfferValue?: [string, string];
    status: string;
    statusOrder?: 'pending' | 'saved' | 'not-available';
    units: number;
    url: string;
}

export interface ShoppingCart {
    deliverFee: number;
    products: ReadonlyArray<Product>;
    shopperFee: number;
    totalCost: number;
    totalShoppingCart: number;
}

export type OrderStatus = 'pending' | 'cancelled' | 'in-progress' | 'comming' | 'finalized';

export interface Order {
    _id: string;
    createdDate: string;
    deliverFee: number;
    deliveryAddress: string;
    deliveryDate: string;
    deliveryHour: string;
    email: string;
    firstName: string;
    lastName: string;
    note: string;
    phone: string;
    products: ReadonlyArray<Product>;
    replaceProducts: boolean;
    shopperFee: number;
    status: OrderStatus;
    totalCost: number;
    totalShoppingCart: number;
}
