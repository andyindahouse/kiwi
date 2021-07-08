export type ProductOrderStatus = 'pending' | 'saved' | 'not-available';

export type PaginatedResponse<T> = {
    readonly content: T;
    readonly pageNumber: number;
    readonly pageSize: number;
    readonly totalSize: number;
};

type CommonUserProps = {
    readonly deliveryAddress: string;
    readonly deliveryCity: string;
    readonly deliveryHour: string;
    readonly deliveryPostalCode: string;
    readonly deliveryVehicle: string;
    readonly deliveryWeekDay: '0' | '1' | '2' | '3' | '4' | '5' | '6';
    readonly email: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly phone: string;
};

export type User = CommonUserProps & {
    readonly active: boolean;
    readonly rider: boolean;
};

export type RegisterUser = CommonUserProps & {
    readonly password: string;
    readonly rePassword: string;
};

export interface Nutriments {
    readonly carbohydrates100g: number;
    readonly energyKcal100g: number;
    readonly fat100g: number;
    readonly nutritionDataPer: number;
    readonly proteins100g: number;
    readonly salt100g: number;
    readonly saturedFat100g: number;
    readonly sugar100g: number;
}

export type SpecialOffers = 'offerDiscount' | 'quantityDiscount';

export interface Product {
    readonly _id: string;
    readonly available: boolean;
    readonly brand: string;
    readonly category: ReadonlyArray<string>;
    readonly cost?: number;
    readonly currency: string;
    readonly daysAfterOpened?: number;
    readonly discount: boolean;
    readonly ean?: string;
    readonly hasPreparations: boolean;
    readonly id: string;
    readonly img: string;
    readonly isCooled: boolean;
    readonly isGlutenFree: boolean;
    readonly isLactoseFree: boolean;
    readonly items?: ReadonlyArray<{readonly date: string | null}>;
    readonly name: string;
    readonly note?: string;
    readonly novaGroups: '1' | '2' | '3' | '4';
    readonly nutriments?: Nutriments;
    readonly nutriscoreGrade: 'a' | 'b' | 'c' | 'd' | 'e';
    readonly price: {readonly original?: string; readonly final: string};
    readonly quantity: number;
    readonly saleType: 'weight' | 'weight_and_unit' | 'unit' | 'piece';
    readonly specialOffer?: SpecialOffers;
    readonly specialOfferValue?: [string, string];
    readonly status: string;
    readonly statusOrder?: 'pending' | 'saved' | 'not-available';
    readonly units: number;
    readonly updateDate: string;
    readonly url: string;
}

export interface ShoppingCart {
    readonly deliverFee: number;
    readonly deliveryDiscount: number;
    readonly finalDeliverFee: number;
    readonly finalShopperFee: number;
    readonly products: ReadonlyArray<Product>;
    readonly shopperFee: number;
    readonly totalCost: number;
    readonly totalShoppingCart: number;
}

export type OrderStatus = 'pending' | 'cancelled' | 'in-progress' | 'comming' | 'finalized' | 'issue';

export interface Order {
    readonly _id: string;
    readonly createdDate: string;
    readonly deliverFee: number;
    readonly deliveryAddress: string;
    readonly deliveryDate: string;
    readonly deliveryDiscount: number;
    readonly deliveryHour: string;
    readonly email: string;
    readonly finalDeliverFee: number;
    readonly finalShopperFee: number;
    readonly firstName: string;
    readonly lastName: string;
    readonly note: string;
    readonly phone: string;
    readonly products: ReadonlyArray<Product>;
    readonly replaceProducts: boolean;
    readonly shopperFee: number;
    readonly status: OrderStatus;
    readonly totalCost: number;
    readonly totalShoppingCart: number;
}

export type PantryProductStatus = 'pending' | 'cooled' | 'frozen' | 'storaged' | 'others' | 'consumed';

export interface PantryProduct {
    readonly _id: string;
    readonly buyedDate: string;
    readonly consumedDate: string;
    readonly date: string;
    readonly email: string;
    readonly id: string;
    readonly img: string;
    readonly inStorage: PantryProductStatus;
    readonly name: string;
}
