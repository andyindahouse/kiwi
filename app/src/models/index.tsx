export type User = {
    firstName: string;
    email: string;
    phone: string;
    deliveryAddress: string;
    deliveryPostalCode: string;
    deliveryWeekDay: '0' | '1' | '2' | '3' | '4' | '5' | '6';
    deliveryHour: string;
    password?: string;
};

export type RegisterUser = User & {password: string; rePassword: string};

export interface Nutriments {
    nutritionDataPer: number;
    energyKcal100g: number;
    fat100g: number;
    saturedFat100g: number;
    carbohydrates100g: number;
    sugar100g: number;
    proteins100g: number;
    salt100g: number;
}

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
    units: number;
    note?: string;
    items?: ReadonlyArray<string>;
    nutriments?: Nutriments;
    nutriscoreGrade: 'a' | 'b' | 'c' | 'd' | 'e';
    novaGroups: '1' | '2' | '3' | '4';
}

export interface ShoppingCart {
    products: ReadonlyArray<Product>;
    deliverFee: number;
    finalDeliverFee: number;
    shopperFee: number;
    finalShopperFee: number;
    totalShoppingCart: number;
    totalCost: number;
    deliveryDiscount: number;
}

export type OrderStatus = 'pending' | 'cancelled' | 'in-progress' | 'issue' | 'comming' | 'finalized';

export interface Order {
    _id: string;
    createdDate: string;
    email: string;
    products: ReadonlyArray<Product>;
    status: OrderStatus;
    deliverFee: number;
    shopperFee: number;
    totalShoppingCart: number;
    totalCost: number;
}

export type PantryProductStatus = 'pending' | 'cooled' | 'frozen' | 'storaged' | 'others' | 'consumed';

export interface PantryProduct {
    buyedDate: string;
    date: string;
    id: string;
    email: string;
    img: string;
    inStorage: PantryProductStatus;
    name: string;
    _id: string;
    consumedDate: string;
}
