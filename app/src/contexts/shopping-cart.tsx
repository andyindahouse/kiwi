import * as React from 'react';
import {Product, ShoppingCart} from '@kiwi/models';
import kiwiApi from '../api';
import {useAuth} from './auth';
import {getPersistedShoppingCart, clearPersistedShoppingCart} from '../utils/unauthenticated-persistence';

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

export const EMPTY_SHOPPING_CART = 'EMPTY_SHOPPING_CART';
export type EmptyShoppingCart = {
    type: 'EMPTY_SHOPPING_CART';
};

type Actions = UpdateShoppingCartProduct | SyncShoppingCart | EmptyShoppingCart;

export const initialState = {
    products: [],
    deliverFee: 3,
    finalDeliverFee: 3,
    shopperFee: 4,
    finalShopperFee: 4,
    totalCost: 0,
    totalShoppingCart: 0,
    deliveryDiscount: 0,
};

const ShoppingContext = React.createContext<ShoppingCart & {dispatch: React.Dispatch<Actions>}>({
    ...initialState,
    dispatch: (action: Actions) => null,
});

function reducer(state: ShoppingCart, action: Actions) {
    console.log('ACTION:', action, state);
    switch (action.type) {
        case EMPTY_SHOPPING_CART: {
            return initialState;
        }
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

const mergeProducts = (data: ShoppingCart, localData: ShoppingCart): ReadonlyArray<Product> => {
    return data.products
        .map((product) => {
            const localProduct = localData.products.find((e) => e.id === product.id);

            if (!localProduct) {
                return product;
            } else {
                return {
                    ...product,
                    units: product.units + localProduct.units,
                };
            }
        })
        .concat(
            localData.products.filter((localProduct) => !data.products.find((e) => e.id === localProduct.id))
        );
};

export const ShoppingProvider = ({children}: {children: React.ReactNode}) => {
    const [shoppingCart, dispatch] = React.useReducer((state: ShoppingCart, action: Actions) => {
        const newState = reducer(state, action);
        console.log('NEW STATE:', newState);
        return newState;
    }, initialState);
    const {user} = useAuth();

    React.useEffect(() => {
        if (!user) {
            getPersistedShoppingCart().then((res) => {
                dispatch({
                    type: SYNC_SHOPPING_CART,
                    shoppingCart: res,
                });
            });
        } else {
            Promise.all([kiwiApi.getShoppingCart(), getPersistedShoppingCart()]).then(([data, localData]) => {
                if (localData.products.length === 0) {
                    dispatch({
                        type: SYNC_SHOPPING_CART,
                        shoppingCart: data,
                    });
                    clearPersistedShoppingCart();
                } else {
                    kiwiApi.setShoppingCart({products: mergeProducts(data, localData)}).then((res) => {
                        dispatch({
                            type: SYNC_SHOPPING_CART,
                            shoppingCart: res,
                        });
                        clearPersistedShoppingCart();
                    });
                }
            });
        }
    }, [dispatch, user]);

    return (
        <ShoppingContext.Provider value={{...shoppingCart, dispatch}}>{children}</ShoppingContext.Provider>
    );
};

export const useShoppingCart = () => React.useContext(ShoppingContext);
