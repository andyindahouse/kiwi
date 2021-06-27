import * as React from 'react';
import {Product, ShoppingCart} from '@kiwi/models/rider';

export const UPDATE_SHOPPING_CART_PRODUCT = 'UPDATE_SHOPPING_CART_PRODUCT';
export type UpdateShoppingCartProduct = {
    type: 'UPDATE_SHOPPING_CART_PRODUCT';
    product: Product;
};

export const SYNC_SHOPPING_CART = 'SYNC_SHOPPING_CART';
export type SyncShoppingCart = {
    type: 'SYNC_SHOPPING_CART';
    shoppingCart: ShoppingCart;
};

type Actions = UpdateShoppingCartProduct | SyncShoppingCart;

const initialState = {
    products: [],
    deliverFee: 0,
    shopperFee: 0,
    totalShoppingCart: 0,
    totalCost: 0,
};

const ShoppingContext = React.createContext<ShoppingCart & {dispatch: React.Dispatch<Actions>}>({
    ...initialState,
    dispatch: (action: Actions) => null,
});

function reducer(state: ShoppingCart, action: Actions) {
    console.log('ACTION:', action, state);
    switch (action.type) {
        case SYNC_SHOPPING_CART: {
            return action.shoppingCart;
        }
        case UPDATE_SHOPPING_CART_PRODUCT: {
            const productIndex = state.products.findIndex((e) => e.id === action.product.id);

            if (productIndex === -1) {
                return {
                    ...state,
                    products: [...state.products, action.product],
                };
            }

            if (action.product.units === 0) {
                return {
                    ...state,
                    products: state.products
                        .slice(0, productIndex)
                        .concat(state.products.slice(productIndex + 1)),
                };
            }

            return {
                ...state,
                products: [
                    ...state.products.slice(0, productIndex),
                    {
                        ...action.product,
                    },
                    ...state.products.slice(productIndex + 1),
                ],
            };
        }

        default:
            return state;
    }
}

export const ShoppingProvider = ({children}: {children: React.ReactNode}) => {
    const [shoppingCart, dispatch] = React.useReducer((state: ShoppingCart, action: Actions) => {
        const newState = reducer(state, action);
        console.log('NEW STATE:', newState);
        return newState;
    }, initialState);

    return (
        <ShoppingContext.Provider value={{...shoppingCart, dispatch}}>{children}</ShoppingContext.Provider>
    );
};

export const useShoppingCart = () => React.useContext(ShoppingContext);
