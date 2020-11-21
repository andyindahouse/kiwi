import {TOKEN_KEY_LOCAL_STORAGE} from '../constants';
import {Order, OrderStatus, Product, ShoppingCart, User} from '../models';
import {extendRawProducts} from '../utils';

const serverIp = 'http://51.210.87.239:3000';
// const token =
//     'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1ZmI1NWQ5YTYwZWU5NjAwMTIwNTk5ZjEiLCJleHAiOjE2MDU3MjE2NTMyNjEsImVtYWlsIjoicmlkZXIifQ.dea_aBnFfHQTuhYyAOQNLXJUiFLMlTImyAft_isVR4E';
const PAGE_SIZE = 20;

export type PaginatedResponse<T> = {
    content: T;
    pageNumber: number;
    pageSize: number;
    totalSize: number;
};

const apiClient = async (
    {url, body, customMethod}: {url: string; body?: Record<string, any> | FormData; customMethod?: string},
    authenticated = true
) => {
    console.log(customMethod);
    const method = customMethod || (body ? 'POST' : 'GET');
    console.log(`API ${method} ${url} req:`, body);
    const rawResponse = await fetch(`${serverIp}/api${url}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(authenticated
                ? {Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY_LOCAL_STORAGE)}`}
                : {}),
        },
        ...(body ? {body: JSON.stringify(body)} : {}),
    });
    const response = await rawResponse.json();

    if (rawResponse.ok) {
        console.log(`API ${method} ${url} res:`, response);
        return response.data ? response.data : response;
    }

    if (response?.error) {
        throw Error(`ERROR API ${method} ${url} res: ${response.error}`);
    }

    throw Error(`ERROR API ${method} ${url} unknown error`);
};

const api = {
    login: (body: {email: string; password: string}): Promise<{token: string}> =>
        apiClient({url: '/login', body}, false),
    registerUser: (body: User & {password: string}): Promise<User> =>
        apiClient({url: '/register', body}, false),
    emailTaken: (email: string): Promise<{isTaken: boolean}> =>
        apiClient({url: `/emailTaken?email=${email}`}, false),
    getUser: (): Promise<User> => apiClient({url: '/me'}),
    getNewOrders: ({
        pageNumber,
        pageSize = 5,
    }: {
        pageNumber: number;
        pageSize?: number;
    }): Promise<PaginatedResponse<ReadonlyArray<Order>>> =>
        apiClient({url: `/rider/orders/all?pageNumber=${pageNumber}&pageSize=${pageSize}`}),
    takeOrder: (id: string): Promise<Order> => apiClient({url: `/rider/orders/${id}`, customMethod: 'PUT'}),
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

        return apiClient({
            url: `/rider/orders?pageNumber=${pageNumber}&pageSize=${pageSize}${statusArrayParam}`,
        });
    },
    getOrder: ({id}: {id: string}): Promise<Order> => apiClient({url: `/rider/orders/${id}`}),
    updateOrderProduct: (body: Product, id: string): Promise<Order> =>
        apiClient({url: `/rider/orders/${id}/products/${body.id}`, body}),
    updateStatusOrder: (id: string, status: OrderStatus): Promise<Order> =>
        apiClient({url: `/rider/orders/${id}/status`, body: {status}}),
    deleteOrderProduct: (product: Product, id: string): Promise<Order> =>
        apiClient({url: `/rider/orders/${id}/products/${product.id}`, customMethod: 'DELETE'}),
    finalizeOrder: (id: string): Promise<Order> =>
        apiClient({url: `/rider/orders/${id}/finalize`, customMethod: 'POST'}),
};

export default api;
