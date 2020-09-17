import {Order, PantryProduct, PantryProductStatus, Product, ShoppingCart} from '../models';
import {extendRawProducts} from '../utils';

const serverIp = 'http://192.168.1.48:3000';
const token =
    'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1ZjJlNjQzNzQ2YTJjMTA4NjViMDM0NTYiLCJleHAiOjE1OTY4NzU5NzUzMTIsImVtYWlsIjoiZmFrZS50ZXN0In0.gFm_dDgcpsLJPT9gYxNtn5uMF89qIGY_EwZB17RdOi0';

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
    registerUser: async ({
        email,
        first_name,
        last_name,
        password,
    }: {
        email: string;
        first_name: string;
        password: string;
        last_name: string;
    }) => {
        console.log('API POST USER req:', email, first_name, password, last_name);
        return fetch(`${serverIp}/api/register`, {
            method: 'POST',
            body: JSON.stringify({
                email: 'rider.test',
                first_name: 'rider',
                last_name: 'surname',
                password: '1234',
            }),
            headers: {'Content-Type': 'application/json'},
        })
            .then((e) => e.json())
            .catch((error) => {
                throw Error(`API POST USER res: ${error}`);
            })
            .then((res) => {
                console.log('API POST USER res:', res);
                return res;
            });
    },
    getProducts: (queryParams: {
        searchText: string | null;
        pageNumber: number;
    }): Promise<PaginatedResponse<ReadonlyArray<Product>>> => {
        console.log('API GET PRODUCTS req:', queryParams);
        return fetch(
            `${serverIp}/api/products?searchText=${queryParams.searchText}&pageNumber=${queryParams.pageNumber}`
        )
            .then((e) => e.json())
            .catch((error) => {
                throw Error(`API GET PRODUCTS res: ${error}`);
            })
            .then((res) => {
                console.log('API GET PRODUCTS res:', res);
                return res;
            });
    },
    getProductDetail: (ean: string): Promise<Product> => {
        console.log('API GET PRODUCT DETAIL req:', ean);
        return fetch(`${serverIp}/api/products/${ean}`)
            .then((e) => e.json())
            .catch((error) => {
                throw Error(`API GET PRODUCT DETAIL error: ${error}`);
            })
            .then((res: any) => {
                console.log('API GET PRODUCT DETAIL res:', res);
                return res;
            });
    },
    setShoppingCart: (req: {products: ReadonlyArray<Product>}): Promise<ShoppingCart> => {
        console.log('API SET CART req:', req);
        return fetch(`${serverIp}/api/shoppingCart`, {
            method: 'POST',
            body: JSON.stringify(req),
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .catch((error) => {
                throw Error(`API SET CART error: ${error}`);
            })
            .then((res: {data: ShoppingCart}) => {
                console.log('API SET CART res:', res);
                return res.data;
            });
    },
    getShoppingCart: (): Promise<ShoppingCart> => {
        console.log('API GET CART res:');
        return fetch(`${serverIp}/api/shoppingCart`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .catch((error) => {
                throw Error(`API GET CART error: ${error}`);
            })
            .then((res: {data: ShoppingCart}) => {
                console.log('API GET CART res:', res);
                return res.data;
            });
    },
    checkout: ({
        note,
        deliveryAddress,
        deliveryDate,
        deliveryHour,
    }: {
        note: string;
        deliveryAddress: string;
        deliveryDate: string;
        deliveryHour: string;
    }): Promise<Order> => {
        console.log('API PUT CHECKOUT res:');
        return fetch(`${serverIp}/api/checkout`, {
            method: 'PUT',
            body: JSON.stringify({
                note,
                deliveryAddress,
                deliveryDate,
                deliveryHour,
            }),
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .catch((error) => {
                throw Error(`API PUT CHECKOUT error: ${error}`);
            })
            .then((res) => {
                console.log('API PUT CHECKOUT res:', res);
                return res;
            });
    },
    getOrders: ({
        pageNumber,
        pageSize,
    }: {
        pageNumber: number;
        pageSize: number;
    }): Promise<PaginatedResponse<ReadonlyArray<Order>>> => {
        console.log('API GET ORDERS req:', pageNumber, pageSize);
        return fetch(`${serverIp}/api/orders?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .catch((error) => {
                throw Error(`API GET ORDERS error: ${error}`);
            })
            .then((res) => {
                console.log('API GET ORDERS res:', res);
                return res;
            });
    },
    getOrder: ({id}: {id: string}): Promise<Order> => {
        console.log('API GET ORDER res:', id);
        return fetch(`${serverIp}/api/orders/${id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .catch((error) => {
                throw Error(`API GET ORDER error: ${error}`);
            })
            .then((res: Order) => {
                console.log('API GET ORDER res:', res);
                return {
                    ...res,
                    products: res.products.map((e) => ({...e, units: e.items?.length || 0})),
                };
            });
    },
    updateOrderProduct: (product: Product, id: string) => {
        console.log('API POST ORDER PRODUCT res:', id, product);
        return fetch(`${serverIp}/api/orders/${id}/products/${product.ean}`, {
            method: 'POST',
            body: JSON.stringify(product),
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .catch((error) => {
                throw Error(`API POST ORDER PRODUCT error: ${error}`);
            })
            .then((res: {data: Order}) => {
                console.log('API POST ORDER PRODUCT res:', res);
                return {
                    ...res.data,
                    products: res.data.products.map((e) => ({...e, units: e.items?.length || 0})),
                };
            });
    },
    updateStatusOrder: (id: string) => {
        console.log('API POST STATUS ORDER res:', id);
        return fetch(`${serverIp}/api/orders/${id}/status`, {
            method: 'POST',
            body: JSON.stringify({status: 'cancelled'}),
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .catch((error) => {
                throw Error(`API POST STATUS ORDER error: ${error}`);
            })
            .then((res: {data: Order}) => {
                console.log('API POST STATUS ORDER res:', res);
                return {
                    ...res.data,
                    products: res.data.products.map((e) => ({...e, units: e.items?.length || 0})),
                };
            });
    },
    deleteOrderProduct: (product: Product, id: string) => {
        console.log('API DELETE ORDER PRODUCT res:', id, product);
        return fetch(`${serverIp}/api/orders/${id}/products/${product.ean}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .catch((error) => {
                throw Error(`API DELETE ORDER PRODUCT error: ${error}`);
            })
            .then((res: {data: Order}) => {
                console.log('API DELETE ORDER PRODUCT res:', res);
                return res.data;
            });
    },
    getPantry: (queryParams: {
        searchText?: string;
        inStorage?: PantryProductStatus;
        pageNumber: number;
    }): Promise<PaginatedResponse<ReadonlyArray<PantryProduct>>> => {
        console.log('API GET PANTRY req:', queryParams);
        const searchTextParam = queryParams.searchText ? `&searchText=${queryParams.searchText}` : '';
        const inStorageParam = queryParams.inStorage ? `&inStorage=${queryParams.inStorage}` : '';
        return fetch(
            `${serverIp}/api/pantry?pageSize=200&pageNumber=${queryParams.pageNumber}${searchTextParam}${inStorageParam}`,
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
                throw error(`API GET PANTRY error: ${error}`);
            })
            .then((res) => {
                console.log('API GET PANTRY res:', res);
                return res;
            });
    },
    updatePantryProduct: (product: PantryProduct): Promise<{data: PantryProduct}> => {
        console.log('API UPDATE PANTRY PRODUCT req:', product);
        return fetch(`${serverIp}/api/pantry/${product._id}`, {
            method: 'POST',
            body: JSON.stringify(product),
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .catch((error) => {
                throw error(`API UPDATE PANTRY PRODUCT error: ${error}`);
            })
            .then((res) => {
                console.log('API UPDATE PANTRY PRODUCT res:', res);
                return res;
            });
    },
};

export default api;
