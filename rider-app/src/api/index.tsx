import {getApiCall} from '@kiwi/api';
import {TOKEN_KEY_LOCAL_STORAGE} from '../constants';
import {Order, OrderStatus, Product, User} from '../models';

export type PaginatedResponse<T> = {
    content: T;
    pageNumber: number;
    pageSize: number;
    totalSize: number;
};

const call = getApiCall('http://51.210.87.239:3000', () => localStorage.getItem(TOKEN_KEY_LOCAL_STORAGE));

const api = {
    login: (body: {email: string; password: string}): Promise<{token: string}> =>
        call({url: '/rider/login', body}, false),
    registerUser: (body: User & {password: string}): Promise<User> =>
        call({url: '/rider/register', body}, false),
    emailTaken: (email: string): Promise<{isTaken: boolean}> =>
        call({url: `/emailTaken?email=${email}`}, false),
    getUser: (): Promise<User> => call({url: '/rider/me'}),
    setUser: (body: Partial<User>): Promise<User> => call({url: '/me', body, customMethod: 'PATCH'}),
    changeUserPassword: (body: {oldPassword: string; newPassword: string}) =>
        call({url: '/rider/me/password', body}),
    getNewOrders: ({
        pageNumber,
        pageSize = 5,
    }: {
        pageNumber: number;
        pageSize?: number;
    }): Promise<PaginatedResponse<ReadonlyArray<Order>>> =>
        call({url: `/rider/orders/all?pageNumber=${pageNumber}&pageSize=${pageSize}`}),
    takeOrder: (id: string): Promise<Order> => call({url: `/rider/orders/${id}`, customMethod: 'PUT'}),
    getMyOrders: ({
        pageNumber,
        pageSize = 5,
        status,
    }: {
        pageNumber: number;
        pageSize?: number;
        status: ReadonlyArray<OrderStatus> | null;
    }): Promise<PaginatedResponse<ReadonlyArray<Order>>> => {
        const statusArrayParam = status ? '&' + status.map((e) => `status=${e}`).join('&') : '';

        return call({
            url: `/rider/orders?pageNumber=${pageNumber}&pageSize=${pageSize}${statusArrayParam}`,
        });
    },
    getOrder: ({id}: {id: string}): Promise<Order> => call({url: `/rider/orders/${id}`}),
    updateOrderProduct: (body: Product, id: string): Promise<Order> =>
        call({url: `/rider/orders/${id}/products/${body.id}`, body}),
    updateStatusOrder: (id: string, status: OrderStatus): Promise<Order> =>
        call({url: `/rider/orders/${id}/status`, body: {status}}),
    deleteOrderProduct: (product: Product, id: string): Promise<Order> =>
        call({url: `/rider/orders/${id}/products/${product.id}`, customMethod: 'DELETE'}),
    finalizeOrder: (id: string): Promise<Order> =>
        call({url: `/rider/orders/${id}/finalize`, customMethod: 'POST'}),
};

export default api;
