const serverIp = 'http://192.168.1.48:3000';
const openFoodApi = 'https://world.openfoodfacts.org/api/v0/product';

export interface Product {
    id: string;
    brand: string;
    category: ReadonlyArray<string>;
    name: string;
    price: {
        final: string;
    };
    discount: false;
    status: string;
    quantity: number;
    currency: string;
    img: string;
    url: string;
    ean: string;
}

export interface IProductDetail {
    nutriments: {
        nutritionDataPer: string;
        energyKcal100g: string;
        fat100g: string;
        saturedFat100g: string;
        carbohydrates100g: string;
        sugar100g: string;
        proteins100g: string;
        salt100g: string;
    };
}

export interface ProductsResponse {
    content: ReadonlyArray<Product>;
    pageNumber: number;
    pageSize: number;
    totalSize: number;
}

export interface getProductsQueryParams {
    searchText: string | null;
    pageNumber: number;
}

const api = {
    getProducts: (queryParams: getProductsQueryParams): Promise<ProductsResponse> => {
        console.log('API GET PRODUCTS req:', queryParams);
        return fetch(
            `${serverIp}/products?searchText=${queryParams.searchText}&pageNumber=${queryParams.pageNumber}`
        )
            .then((e) => e.json())
            .then((res) => {
                console.log('API GET PRODUCTS res:', res);
                return res;
            });
    },
    getProductDetail: (ean: string): Promise<IProductDetail> => {
        console.log('API GET PRODUCT DETAIL req:', ean);
        return fetch(`${openFoodApi}/${ean}`)
            .then((e) => e.json())
            .then(({product}: any) => {
                console.log('API GET PRODUCT DETAIL res:', product);
                return {
                    nutriments: {
                        nutritionDataPer: `${product['nutrition_data_per']}`,
                        energyKcal100g: `${product.nutriments['energy-kcal_100g']}${product.nutriments['energy-kcal_unit']}`,
                        fat100g: `${product.nutriments['fat_100g']}${product.nutriments['fat_unit']}`,
                        saturedFat100g: `${product.nutriments['saturated-fat_100g']}${product.nutriments['saturated-fat_unit']}`,
                        carbohydrates100g: `${product.nutriments['carbohydrates_100g']}${product.nutriments['carbohydrates_unit']}`,
                        sugar100g: `${product.nutriments['sugars_100g']}${product.nutriments['sugars_unit']}`,
                        proteins100g: `${product.nutriments['proteins_100g']}${product.nutriments['proteins_unit']}`,
                        salt100g: `${product.nutriments['salt_100g']}${product.nutriments['salt_unit']}`,
                    },
                };
            });
    },
};

export default api;
