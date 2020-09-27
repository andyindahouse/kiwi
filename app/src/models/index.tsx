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
    ean: string;
    nutriments: Nutriments;
    units: number;
    note?: string;
    items?: ReadonlyArray<string>;
}

export interface ShoppingCart {
    products: ReadonlyArray<Product>;
    deliverFee: number;
    shopperFee: number;
    totalShoppingCart: number;
    totalCost: number;
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
    ean: string;
    email: string;
    img: string;
    inStorage: PantryProductStatus;
    name: string;
    _id: string;
    consumedDate: string;
}
