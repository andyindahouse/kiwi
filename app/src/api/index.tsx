import {TOKEN_KEY_LOCAL_STORAGE} from '../constants';
import {Order, PantryProduct, PantryProductStatus, Product, ShoppingCart, User} from '../models';

const serverIp = 'http://51.210.87.239:3000';
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

const kiwiApi = {
    login: (body: {email: string; password: string}): Promise<{token: string}> =>
        apiClient({url: '/login', body}, false),
    registerUser: (body: User & {password: string}): Promise<User> =>
        apiClient({url: '/register', body}, false),
    emailTaken: (email: string): Promise<{isTaken: boolean}> =>
        apiClient({url: `/emailTaken?email=${email}`}, false),
    getUser: (): Promise<User> => apiClient({url: '/me'}),
    setUser: (body: Partial<User>): Promise<User> => apiClient({url: '/me', body, customMethod: 'PATCH'}),
    changeUserPassword: (body: {oldPassword: string; newPassword: string}) =>
        apiClient({url: '/me/password', body}),
    getProducts: (queryParams: {
        searchText: string | null;
        pageNumber: number;
    }): Promise<PaginatedResponse<ReadonlyArray<Product>>> =>
        apiClient({
            url: `/products?pageSize=${PAGE_SIZE}&searchText=${queryParams.searchText}&pageNumber=${queryParams.pageNumber}`,
        }),
    getProductDetail: (id: string): Promise<Product> => apiClient({url: `/products/${id}`}),
    setShoppingCart: (body: {products: ReadonlyArray<Product>}): Promise<ShoppingCart> =>
        apiClient({url: '/shoppingCart', body}),
    getShoppingCart: (): Promise<ShoppingCart> => apiClient({url: '/shoppingCart'}),
    checkout: (body: {
        note: string;
        deliveryAddress: string;
        deliveryDate: string;
        deliveryHour: string;
    }): Promise<Order> => apiClient({url: '/checkout', body, customMethod: 'PUT'}),
    getOrders: ({pageNumber}: {pageNumber: number}): Promise<PaginatedResponse<ReadonlyArray<Order>>> =>
        apiClient({url: `/orders?pageNumber=${pageNumber}&pageSize=${PAGE_SIZE}`}),
    getOrder: ({id}: {id: string}): Promise<Order> =>
        apiClient({url: `/orders/${id}`}).then((res: Order) => {
            return {
                ...res,
                products: res.products.map((e) => ({...e, units: e.items?.length || 0})),
            };
        }),
    updateOrderProduct: (body: Product, id: string): Promise<Order> =>
        apiClient({url: `/orders/${id}/products/${body.id}`, body}).then((data: Order) => ({
            ...data,
            products: data.products.map((e) => ({...e, units: e.items?.length || 0})),
        })),
    updateStatusOrder: (id: string): Promise<Order> =>
        apiClient({url: `/orders/${id}/status`, body: {status: 'cancelled'}}).then((data: Order) => ({
            ...data,
            products: data.products.map((e) => ({...e, units: e.items?.length || 0})),
        })),
    deleteOrderProduct: (product: Product, id: string): Promise<Order> =>
        apiClient({url: `/orders/${id}/products/${product.id}`, customMethod: 'DELETE'}),
    getPantry: (queryParams: {
        pageNumber: number;
        searchText?: string;
        inStorage?: PantryProductStatus;
        pageSize?: number;
        perishable?: boolean;
    }): Promise<PaginatedResponse<ReadonlyArray<PantryProduct>>> => {
        const searchTextParam = queryParams.searchText ? `&searchText=${queryParams.searchText}` : '';
        const inStorageParam = queryParams.inStorage ? `&inStorage=${queryParams.inStorage}` : '';
        const perishableParam = queryParams.perishable ? `&perishable=true` : '';

        return apiClient({
            url: `/pantry?pageSize=${queryParams.pageSize || 200}&pageNumber=${
                queryParams.pageNumber
            }${searchTextParam}${inStorageParam}${perishableParam}&orderBy=date&orderDir=asc`,
        });
    },
    updatePantryProduct: (body: PantryProduct): Promise<PantryProduct> =>
        apiClient({url: `/pantry/${body._id}`, body}),
};

export default kiwiApi;
