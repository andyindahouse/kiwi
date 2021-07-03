import {Product, ShoppingCart} from '@kiwi/models';
import {getCost} from '@kiwi/utils';
import {DELIVER_FEE, SHOPPER_FEE} from '../constants';

export const INITITAL_SHOPPING_CART: ShoppingCart = {
    products: [],
    deliverFee: DELIVER_FEE,
    finalDeliverFee: DELIVER_FEE,
    shopperFee: SHOPPER_FEE,
    finalShopperFee: SHOPPER_FEE,
    totalCost: 0,
    totalShoppingCart: 0,
    deliveryDiscount: 0,
};

const SHOPPING_CART_KEY = 'shoppingCart';

export const getPersistedShoppingCart = (): Promise<ShoppingCart> => {
    const rawShoppinCart = localStorage.getItem(SHOPPING_CART_KEY);
    const response = rawShoppinCart ? JSON.parse(rawShoppinCart) : INITITAL_SHOPPING_CART;

    return Promise.resolve(response);
};

export const setPersistedShoppingCartProducts = ({products}: {products: ReadonlyArray<Product>}) => {
    const totalShoppingCart = Number(
        products
            .reduce((acum, current) => {
                const finalPrice = Number(current.price.final);

                if (current.saleType === 'unit') {
                    return acum + finalPrice * current.units;
                } else {
                    const priceFor100gr = finalPrice / 10;

                    return acum + priceFor100gr * (current.units / 100);
                }
            }, 0)
            .toFixed(2)
    );
    const totalCost = totalShoppingCart + SHOPPER_FEE + DELIVER_FEE;

    localStorage.setItem(
        SHOPPING_CART_KEY,
        JSON.stringify({
            products: products.map((product) => {
                return {
                    ...product,
                    cost: getCost(product),
                };
            }),
            deliverFee: DELIVER_FEE,
            finalDeliverFee: DELIVER_FEE,
            shopperFee: SHOPPER_FEE,
            finalShopperFee: SHOPPER_FEE,
            totalShoppingCart,
            totalCost,
            deliveryDiscount: 0,
        })
    );

    return getPersistedShoppingCart();
};

export const clearPersistedShoppingCart = () => {
    localStorage.removeItem(SHOPPING_CART_KEY);
};
