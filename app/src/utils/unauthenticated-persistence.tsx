import {Product, ShoppingCart} from '@kiwi/models';

const DELIVER_FEE = 3;
const SHOPPER_FEE = 4;
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
                return acum + Number(current.price.final) * current.units;
            }, 0)
            .toFixed(2)
    );
    const totalCost = totalShoppingCart + SHOPPER_FEE + DELIVER_FEE;

    localStorage.setItem(
        SHOPPING_CART_KEY,
        JSON.stringify({
            products,
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
