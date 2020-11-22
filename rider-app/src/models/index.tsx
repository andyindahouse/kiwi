export interface Nutriments {
    nutritionDataPer: string;
    energyKcal100g: string;
    fat100g: string;
    saturedFat100g: string;
    carbohydrates100g: string;
    sugar100g: string;
    proteins100g: string;
    salt100g: string;
}

export type ProductOrderStatus = 'pending' | 'saved' | 'not-available';

export type SpecialOffers = 'offerDiscount' | 'quantityDiscount';

export interface Product {
    id: string;
    brand: string;
    category: ReadonlyArray<string>;
    name: string;
    price: {
        original?: string;
        final: string;
    };
    discount: boolean;
    specialOffer?: SpecialOffers;
    specialOfferValue?: [string, string];
    status: string;
    quantity: number;
    currency: string;
    img: string;
    url: string;
    ean?: string;
    nutriments?: Nutriments;
    units: number;
    note?: string;
    items?: ReadonlyArray<{date: string | null}>;
    nutriscoreGrade: 'a' | 'b' | 'c' | 'd' | 'e';
    novaGroups: '1' | '2' | '3' | '4';
    daysAfterOpened?: number;
    statusOrder?: 'pending' | 'saved' | 'not-available';
}

export interface ShoppingCart {
    products: ReadonlyArray<Product>;
    deliverFee: number;
    shopperFee: number;
    totalShoppingCart: number;
    totalCost: number;
}

export type OrderStatus = 'pending' | 'in-progress' | 'comming' | 'finalized' | 'cancelled';

export interface Order {
    _id: string;
    createdDate: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    products: ReadonlyArray<Product>;
    status: OrderStatus;
    deliverFee: number;
    shopperFee: number;
    totalShoppingCart: number;
    totalCost: number;
    note: string;
    deliveryAddress: string;
    deliveryDate: string;
    deliveryHour: string;
}

export type User = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password?: string;
    deliveryCity: string;
    deliveryVehicle: string;
};

export type RegisterUser = User & {password: string; rePassword: string};
