import {Product, ShoppingCart} from '../models';

const serverIp = 'http://192.168.1.48:3000';
const token =
    'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1ZjJhZDU4N2M0M2ZkNzBjMTQ0ZDMwMGMiLCJleHAiOjE1OTY2NDMxNjk2NDcsImVtYWlsIjoiZmFrZS50ZXN0In0.1pU0rkQrZRpz72fUPZt5iJY1H2PxUuXR05oLssWZZRg';

export interface SetCartRequest {
    products: ReadonlyArray<{ean: string; quantity: number}>;
}

export interface ProductsResponse {
    content: ReadonlyArray<Product>;
    pageNumber: number;
    pageSize: number;
    totalSize: number;
}

export interface GetProductsQueryParams {
    searchText: string | null;
    pageNumber: number;
}

const api = {
    getProducts: (queryParams: GetProductsQueryParams): Promise<ProductsResponse> => {
        console.log('API GET PRODUCTS req:', queryParams);
        return fetch(
            `${serverIp}/api/products?searchText=${queryParams.searchText}&pageNumber=${queryParams.pageNumber}`
        )
            .then((e) => e.json())
            .catch((error) => {
                console.log('API GET PRODUCTS res:', error);
                return null;
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
                console.log('API GET PRODUCT DETAIL error:', error);
                return null;
            })
            .then((res: any) => {
                console.log('API GET PRODUCT DETAIL res:', res);
                return res;
            });
    },
    setCart: (cart: ShoppingCart) => {
        console.log('API SET CART req:', cart);
        return fetch(`${serverIp}/api/shoppingCart`, {
            method: 'POST',
            body: JSON.stringify(cart),
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .catch((error) => {
                console.log('API SET CART error:', error);
                return null;
            })
            .then((res) => {
                console.log('API SET CART res:', res);
                return res;
            });
    },
    getCart: (): Promise<ShoppingCart> => {
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
                console.log('API GET CART error:', error);
                return null;
            })
            .then((res) => {
                console.log('API GET CART res:', res);
                return res;
            });
    },
};

export default api;
