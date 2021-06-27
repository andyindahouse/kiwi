export type PaginatedResponse<T> = {
    content: T;
    pageNumber: number;
    pageSize: number;
    totalSize: number;
};

export type User = {
    deliveryAddress: string;
    deliveryHour: string;
    deliveryPostalCode: string;
    deliveryWeekDay: '0' | '1' | '2' | '3' | '4' | '5' | '6';
    email: string;
    firstName: string;
    phone: string;
};

export type RegisterUser = User & {password: string; rePassword: string};

export interface Nutriments {
    carbohydrates100g: number;
    energyKcal100g: number;
    fat100g: number;
    nutritionDataPer: number;
    proteins100g: number;
    salt100g: number;
    saturedFat100g: number;
    sugar100g: number;
}

export type SpecialOffers = 'offerDiscount' | 'quantityDiscount';

export interface Product {
    _id: string;
    available: boolean;
    brand: string;
    category: ReadonlyArray<string>;
    cost?: number;
    currency: string;
    discount: boolean;
    ean?: string;
    hasPreparations: boolean;
    id: string;
    img: string;
    isCooled: boolean;
    isGlutenFree: boolean;
    isLactoseFree: boolean;
    items?: ReadonlyArray<string>;
    name: string;
    note?: string;
    novaGroups: '1' | '2' | '3' | '4';
    nutriments?: Nutriments;
    nutriscoreGrade: 'a' | 'b' | 'c' | 'd' | 'e';
    price: {original?: string; final: string};
    quantity: number;
    saleType: 'weight' | 'weight_and_unit' | 'unit' | 'piece';
    specialOffer?: SpecialOffers;
    specialOfferValue?: [string, string];
    status: string;
    units: number;
    updateDate: string;
    url: string;
}

export interface ShoppingCart {
    deliverFee: number;
    deliveryDiscount: number;
    finalDeliverFee: number;
    finalShopperFee: number;
    products: ReadonlyArray<Product>;
    shopperFee: number;
    totalCost: number;
    totalShoppingCart: number;
}

export type OrderStatus = 'pending' | 'cancelled' | 'in-progress' | 'comming' | 'finalized' | 'issue';

export interface Order {
    _id: string;
    createdDate: string;
    deliverFee: number;
    deliveryAdrres: string;
    deliveryDate: string;
    deliveryDiscount: number;
    deliveryHour: string;
    email: string;
    finalDeliverFee: number;
    finalShopperFee: number;
    note: string;
    products: ReadonlyArray<Product>;
    replaceProducts: false;
    shopperFee: number;
    status: OrderStatus;
    totalCost: number;
    totalShoppingCart: number;
}

export type PantryProductStatus = 'pending' | 'cooled' | 'frozen' | 'storaged' | 'others' | 'consumed';

export interface PantryProduct {
    _id: string;
    buyedDate: string;
    consumedDate: string;
    date: string;
    email: string;
    id: string;
    img: string;
    inStorage: PantryProductStatus;
    name: string;
}
