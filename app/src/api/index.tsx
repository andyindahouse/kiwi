import {Order, PantryProduct, PantryProductStatus, Product, ShoppingCart, User} from '../models';

const serverIp = 'http://192.168.1.48:3000';
const token =
    'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1ZjJhZDRlYWYyZTZhZTJiNTRjYzk4ZGIiLCJleHAiOjE2MDA4ODc0MTY1MjQsImVtYWlsIjoiZGFuaWNhbGRlcmFAZ21haWwuY29tIn0.6QyGT3HB-qtZYyFqUDRiMGV3u-jybX3fyIosrvNOxWQ';
const PAGE_SIZE = 20;

export type PaginatedResponse<T> = {
    content: T;
    pageNumber: number;
    pageSize: number;
    totalSize: number;
};

const api = {
    login: ({email, password}: {email: string; password: string}) => {
        console.log('API POST LOGIN req:', email, password);
        return fetch(`${serverIp}/api/register`, {
            method: 'POST',
            body: JSON.stringify({
                email,
                password,
            }),
            headers: {'Content-Type': 'application/json'},
        })
            .then((e) => e.json())
            .catch((error) => {
                throw Error(`API POST LOGIN res: ${error}`);
            })
            .then((res) => {
                console.log('API POST LOGIN res:', res);
                return res;
            });
    },
    registerUser: ({
        email,
        firstName,
        password,
        deliveryAddress,
        deliveryHour,
        deliveryWeekDay,
        deliveryCp,
        phone,
    }: User & {password: string}) => {
        console.log('API POST REGISTER USER req:', email, firstName, password);
        return fetch(`${serverIp}/api/register`, {
            method: 'POST',
            body: JSON.stringify({
                email,
                password,
                firstName,
                deliveryAddress,
                deliveryWeekDay,
                deliveryHour,
                deliveryCp,
                phone,
            }),
            headers: {'Content-Type': 'application/json'},
        })
            .then((e) => e.json())
            .catch((error) => {
                throw Error(`API POST REGISTER USER res: ${error}`);
            })
            .then((res) => {
                console.log('API POST REGISTER USER res:', res);
                return res;
            });
    },
    emailTaken: (email: string) => {
        console.log('API GET EMAIL TAKEN req:', email);
        return fetch(`${serverIp}/api/emailTaken?email=${email}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        })
            .then((e) => e.json())
            .catch((error) => {
                throw Error(`API EMAIL TAKEN res: ${error}`);
            })
            .then((res: {data: {isTaken: boolean}}) => {
                console.log('API GET EMAIL TAKEN USER res:', res);
                return res.data;
            });
    },
    getUser: async (): Promise<User> => {
        return Promise.resolve({
            email: 'andy@kiwi.com',
            firstName: 'andy',
            phone: '670677651',
            deliveryAddress: 'C/ Antonio Suarez 10 28802 Edificio B 116',
            deliveryCp: '28805',
            deliveryWeekDay: '1',
            deliveryHour: '18:00',
        });

        // console.log('API POST GET USER req:', email, password);
        // return fetch(`${serverIp}/api/user`, {
        //     method: 'GET',
        //     headers: {'Content-Type': 'application/json'},
        // })
        //     .then((e) => e.json())
        //     .catch((error) => {
        //         throw Error(`API POST GET USER res: ${error}`);
        //     })
        //     .then((res) => {
        //         console.log('API POST GET USER res:', res);
        //         return res;
        //     });
    },
    getProducts: (queryParams: {
        searchText: string | null;
        pageNumber: number;
    }): Promise<PaginatedResponse<ReadonlyArray<Product>>> => {
        console.log('API GET PRODUCTS req:', queryParams);
        return fetch(
            `${serverIp}/api/products?pageSize=${PAGE_SIZE}&searchText=${queryParams.searchText}&pageNumber=${queryParams.pageNumber}`
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
    getProductDetail: (id: string): Promise<Product> => {
        console.log('API GET PRODUCT DETAIL req:', id);
        return fetch(`${serverIp}/api/products/${id}`)
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
    getOrders: ({pageNumber}: {pageNumber: number}): Promise<PaginatedResponse<ReadonlyArray<Order>>> => {
        console.log('API GET ORDERS req:', pageNumber);
        return fetch(`${serverIp}/api/orders?pageNumber=${pageNumber}&pageSize=${PAGE_SIZE}`, {
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
        return fetch(`${serverIp}/api/orders/${id}/products/${product.id}`, {
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
        return fetch(`${serverIp}/api/orders/${id}/products/${product.id}`, {
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
        pageNumber: number;
        searchText?: string;
        inStorage?: PantryProductStatus;
        pageSize?: number;
        perishable?: boolean;
    }): Promise<PaginatedResponse<ReadonlyArray<PantryProduct>>> => {
        console.log('API GET PANTRY req:', queryParams);
        const searchTextParam = queryParams.searchText ? `&searchText=${queryParams.searchText}` : '';
        const inStorageParam = queryParams.inStorage ? `&inStorage=${queryParams.inStorage}` : '';
        const perishableParam = queryParams.perishable ? `&perishable=true` : '';
        return fetch(
            `${serverIp}/api/pantry?pageSize=${queryParams.pageSize || 200}&pageNumber=${
                queryParams.pageNumber
            }${searchTextParam}${inStorageParam}${perishableParam}&orderBy=date&orderDir=asc`,
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
