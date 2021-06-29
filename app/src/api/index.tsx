import {getApiCall} from '@kiwi/api';
import {TOKEN_KEY_LOCAL_STORAGE} from '../constants';
import {
    Order,
    PaginatedResponse,
    PantryProduct,
    PantryProductStatus,
    Product,
    ShoppingCart,
    User,
} from '@kiwi/models';
import {callStub} from './stubs';
import {USE_STUBS} from './dev-config';

const PAGE_SIZE = 20;

const call =
    process.env.NODE_ENV === 'development' && USE_STUBS
        ? callStub
        : getApiCall('https://kiwiapp.es:3001', () => localStorage.getItem(TOKEN_KEY_LOCAL_STORAGE));

const kiwiApi = {
    login: (body: {email: string; password: string}): Promise<{token: string}> =>
        call({url: '/login', body}, false),
    registerUser: (body: User & {password: string}): Promise<User> => call({url: '/register', body}, false),
    emailTaken: (email: string): Promise<{isTaken: boolean}> =>
        call({url: `/emailTaken?email=${email}`}, false),
    getUser: (): Promise<User> => call({url: '/me'}),
    setUser: (body: Partial<User>): Promise<User> => call({url: '/me', body, customMethod: 'PATCH'}),
    changeUserPassword: (body: {oldPassword: string; newPassword: string}) =>
        call({url: '/me/password', body}),
    getProducts: (queryParams: {
        searchText: string | null;
        pageNumber: number;
    }): Promise<PaginatedResponse<ReadonlyArray<Product>>> =>
        call(
            {
                url: `/products?pageSize=${PAGE_SIZE}&searchText=${queryParams.searchText}&pageNumber=${queryParams.pageNumber}`,
            },
            false
        ),
    getProductDetail: (id: string): Promise<Product> => call({url: `/products/${id}`}, false),
    setShoppingCart: (body: {products: ReadonlyArray<Product>}): Promise<ShoppingCart> =>
        call({url: '/shoppingCart', body}),
    getShoppingCart: (): Promise<ShoppingCart> => call({url: '/shoppingCart'}),
    checkout: (body: {
        note: string;
        deliveryAddress: string;
        deliveryDate: string;
        deliveryHour: string;
        replaceProducts: boolean;
    }): Promise<Order> => call({url: '/checkout', body, customMethod: 'PUT'}),
    getOrders: ({pageNumber}: {pageNumber: number}): Promise<PaginatedResponse<ReadonlyArray<Order>>> =>
        call({url: `/orders?pageNumber=${pageNumber}&pageSize=${PAGE_SIZE}`}),
    getOrder: ({id}: {id: string}): Promise<Order> =>
        call({url: `/orders/${id}`}).then((res: Order) => {
            return {
                ...res,
                products: res.products.map((e) => ({...e, units: e.items?.length || 0})),
            };
        }),
    updateStatusOrder: (id: string): Promise<Order> =>
        call({url: `/orders/${id}/status`, body: {status: 'cancelled'}}).then((data: Order) => ({
            ...data,
            products: data.products.map((e) => ({...e, units: e.items?.length || 0})),
        })),
    deleteOrderProduct: (product: Product, id: string): Promise<Order> =>
        call({url: `/orders/${id}/products/${product.id}`, customMethod: 'DELETE'}),
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

        return call({
            url: `/pantry?pageSize=${queryParams.pageSize || 200}&pageNumber=${
                queryParams.pageNumber
            }${searchTextParam}${inStorageParam}${perishableParam}&orderBy=date&orderDir=asc`,
        });
    },
    updatePantryProduct: (body: PantryProduct): Promise<PantryProduct> =>
        call({url: `/pantry/${body._id}`, body}),
};

export default kiwiApi;
