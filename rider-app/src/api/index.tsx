import {Order, OrderStatus, Product, ShoppingCart} from '../models';
import {extendRawProducts} from '../utils';

const serverIp = 'http://192.168.1.48:3000';
const token =
    'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1ZjNkNmY2MzFlZGY5Mzc4OWUwNzljNTAiLCJleHAiOjE1OTc4NjI5Njk4NTcsImVtYWlsIjoicmlkZXIudGVzdCJ9.XKZZ4THi-AL0NsGbykT19E9EyuiowF0GF1KHDTFHvTY';

export interface SetCartRequest {
    products: ReadonlyArray<{ean: string; quantity: number}>;
}

export type PaginatedResponse<T> = {
    content: T;
    pageNumber: number;
    pageSize: number;
    totalSize: number;
};

const api = {
    getNewOrders: ({
        pageNumber,
        pageSize = 5,
    }: {
        pageNumber: number;
        pageSize?: number;
    }): Promise<PaginatedResponse<ReadonlyArray<Order>>> => {
        console.log('API GET NEW ORDERS req:', pageNumber, pageSize);
        return fetch(`${serverIp}/api/rider/orders/all?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .catch((error) => {
                console.log('API GET NEW ORDERS error:', error);
                return null;
            })
            .then((res) => {
                console.log('API GET NEW ORDERS res:', res);
                return res;
            });
    },
    takeOrder: (id: string) => {
        console.log('API POST TAKE ORDER res:', id);
        return fetch(`${serverIp}/api/rider/orders/${id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .catch((error) => {
                console.log('API POST TAKE ORDER error:', error);
                return null;
            })
            .then((res: {data: Order}) => {
                console.log('API POST TAKE ORDER res:', res);
                return res.data;
            });
    },
    getMyOrders: ({
        pageNumber,
        pageSize = 5,
        status,
    }: {
        pageNumber: number;
        pageSize?: number;
        status: ReadonlyArray<OrderStatus> | null;
    }): Promise<PaginatedResponse<ReadonlyArray<Order>>> => {
        console.log('API GET MY ORDERS req:', pageNumber, pageSize);
        const statusArrayParam = status ? '&' + status.map((e) => `status=${e}`).join('&') : '';
        return fetch(
            `${serverIp}/api/rider/orders?pageNumber=${pageNumber}&pageSize=${pageSize}${statusArrayParam}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        )
            .then((res) => res.json())
            .catch((error) => {
                console.log('API GET MY ORDERS error:', error);
                return null;
            })
            .then((res) => {
                console.log('API GET MY ORDERS res:', res);
                return res;
            });
    },
    getOrder: ({id}: {id: string}): Promise<Order> => {
        console.log('API GET ORDER res:', id);
        return fetch(`${serverIp}/api/rider/orders/${id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .catch((error) => {
                console.log('API GET ORDER error:', error);
                return null;
            })
            .then((res: Order) => {
                console.log('API GET ORDER res:', res);
                return res;
            });
    },
    updateOrderProduct: (product: Product, id: string) => {
        console.log('API POST ORDER PRODUCT res:', id, product);
        return fetch(`${serverIp}/api/rider/orders/${id}/products/${product.ean}`, {
            method: 'POST',
            body: JSON.stringify(product),
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .catch((error) => {
                console.log('API POST ORDER PRODUCT error:', error);
                return null;
            })
            .then((res: {data: Order}) => {
                console.log('API POST ORDER PRODUCT res:', res);
                return res.data;
            });
    },
    updateStatusOrder: (id: string, status: OrderStatus) => {
        console.log('API POST STATUS ORDER res:', id);
        return fetch(`${serverIp}/api/rider/orders/${id}/status`, {
            method: 'POST',
            body: JSON.stringify({status}),
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .catch((error) => {
                console.log('API POST STATUS ORDER error:', error);
                return null;
            })
            .then((res: {data: Order}) => {
                console.log('API POST STATUS ORDER res:', res);
                return res.data;
            });
    },
    deleteOrderProduct: (product: Product, id: string) => {
        console.log('API DELETE ORDER PRODUCT res:', id, product);
        return fetch(`${serverIp}/api/rider/orders/${id}/products/${product.ean}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .catch((error) => {
                console.log('API DELETE ORDER PRODUCT error:', error);
                return null;
            })
            .then((res: {data: Order}) => {
                console.log('API DELETE ORDER PRODUCT res:', res);
                return res.data;
            });
    },
    finalizeOrder: (id: string) => {
        console.log('API FINALIZE ORDER res:', id);
        return fetch(`${serverIp}/api/rider/orders/${id}/finalize`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .catch((error) => {
                console.log('API FINALIZE ORDER error:', error);
                return null;
            })
            .then((res: {data: Order}) => {
                console.log('API FINALIZE ORDER res:', res);
                return res.data;
            });
    },
};

export default api;
