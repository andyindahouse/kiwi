import * as React from 'react';
import {Product, ShoppingCart} from '../models';

type Action =
    | {
          type: 'addProduct';
          product: Product;
      }
    | {
          type: 'removeProduct';
          product: Product;
      };

const initialState = {
    products: [],
};

const ShoppingContext = React.createContext<ShoppingCart & {dispatch: React.Dispatch<any>}>({
    ...initialState,
    dispatch: () => null,
});

function reducer(state: ShoppingCart, action: Action) {
    switch (action.type) {
        case 'addProduct': {
            const productIndex = state.products.findIndex((e) => e.id === action.product.id);

            return {
                ...state,
                products:
                    productIndex !== -1
                        ? [
                              ...state.products.slice(0, productIndex),
                              {
                                  ...state.products[productIndex],
                                  units: state.products[productIndex].units + 1,
                              },
                              ...state.products.slice(productIndex + 1),
                          ]
                        : state.products.concat([{...action.product, units: 1}]),
            };
        }
        case 'removeProduct': {
            const productIndex = state.products.findIndex((e) => e.id === action.product.id);

            if (productIndex === -1) {
                return state;
            }

            const product = state.products[productIndex];

            if (product.units === 1) {
                return {
                    ...state,
                    products: [
                        ...state.products.slice(0, productIndex),
                        ...state.products.slice(productIndex + 1),
                    ],
                };
            }

            return {
                ...state,
                products: [
                    ...state.products.slice(0, productIndex),
                    {
                        ...state.products[productIndex],
                        units: state.products[productIndex].units - 1,
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
    const [shoppingCart, dispatch] = React.useReducer(reducer, initialState);

    return (
        <ShoppingContext.Provider value={{...shoppingCart, dispatch}}>{children}</ShoppingContext.Provider>
    );
};

export const useShoppingCart = () => React.useContext(ShoppingContext);
