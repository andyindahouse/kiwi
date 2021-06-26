import type {ApiCaller} from '@kiwi/api';
import {login} from './login';
import {pantry} from './pantry';
import {shoppingCart} from './shopping-cart';
import {user} from './user';

export const callStub: ApiCaller = async ({url, body, customMethod}) => {
    switch (url) {
        case '/login': {
            return login;
        }
        case '/me': {
            return user;
        }
        case '/shoppingCart': {
            return shoppingCart;
        }
    }

    if (url.startsWith('/pantry')) {
        return pantry;
    }
};
