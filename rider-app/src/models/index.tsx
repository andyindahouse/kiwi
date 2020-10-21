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

export interface Product {
    id: string;
    brand: string;
    category: ReadonlyArray<string>;
    name: string;
    price: {
        final: string;
    };
    cost: number;
    discount: boolean;
    status: string;
    quantity: number;
    currency: string;
    img: string;
    url: string;
    ean?: string;
    nutriments: Nutriments;
    units: number;
    note?: string;
    items?: ReadonlyArray<{date: string | null}>;
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
