export type ProductOrderStatus = 'pending' | 'saved' | 'not-available';

export interface Product {
    readonly brand: string;
    readonly category: ReadonlyArray<string>;
    readonly currency: string;
    readonly daysAfterOpened?: number;
    readonly discount: boolean;
    readonly ean?: string;
    readonly id: string;
    readonly img: string;
    readonly items?: ReadonlyArray<{readonly date: string | null}>;
    readonly name: string;
    readonly note?: string;
    readonly novaGroups: '1' | '2' | '3' | '4';
    readonly nutriments?: Nutriments;
    readonly nutriscoreGrade: 'a' | 'b' | 'c' | 'd' | 'e';
    readonly price: {readonly original?: string; readonly final: string};
    readonly quantity: number;
    readonly specialOffer?: SpecialOffers;
    readonly specialOfferValue?: [string, string];
    readonly status: string;
    readonly statusOrder?: 'pending' | 'saved' | 'not-available';
    readonly units: number;
    readonly url: string;
    readonly hasPreparations?: false;
    readonly isCooled?: false;
    readonly isGlutenFree?: false;
    readonly isLactoseFree?: false;
    readonly saleType: 'weight' | 'weight_and_unit' | 'unit' | 'piece';
}

export interface ShoppingCart {
    readonly deliverFee: number;
    readonly products: ReadonlyArray<Product>;
    readonly shopperFee: number;
    readonly totalCost: number;
    readonly totalShoppingCart: number;
}

export type OrderStatus = 'pending' | 'cancelled' | 'in-progress' | 'comming' | 'finalized';

export interface Order {
    readonly _id: string;
    readonly createdDate: string;
    readonly deliverFee: number;
    readonly deliveryAddress: string;
    readonly deliveryDate: string;
    readonly deliveryHour: string;
    readonly email: string;
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
