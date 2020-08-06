import {cogSharp} from 'ionicons/icons';

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

export interface Product {
    id: string;
    brand: string;
    category: ReadonlyArray<string>;
    name: string;
    price: {
        final: string;
    };
    discount: boolean;
    status: string;
    quantity: number;
    currency: string;
    img: string;
    url: string;
    ean: string;
    nutriments: Nutriments;
}

export interface ShoppingCart {
    products: ReadonlyArray<
        Product & {
            units: number;
        }
    >;
}
