import {Product} from '../models';

export const extendRawProducts = (products: ReadonlyArray<Product>, shoppingCart: ReadonlyArray<Product>) => {
    return products.map((product: Product) => {
        const shoppingCartProduct = shoppingCart.find((e) => e.ean === product.ean);

        return {
            ...product,
            units: shoppingCartProduct?.units || 0,
        };
    });
};
