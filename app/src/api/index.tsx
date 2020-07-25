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

export interface ProductsResponse {
    content: ReadonlyArray<Product>;
    pageNumber: number;
}

const api = {
    searchProducts: (searchText: string): Promise<ProductsResponse> => {
        return Promise.resolve({
            content: [
                {
                    id: '0110120902600244__1',
                    brand: 'EL CORTE INGLES',
                    category: ['Alimentación General', 'Alimentación general', 'Aceites', 'Aceite de oliva'],
                    name: 'EL CORTE INGLES aceite de oliva suave 0,4º botella 1 l',
                    price: {
                        final: '2.68',
                    },
                    discount: false,
                    status: 'AVAILABLE',
                    quantity: 1,
                    currency: 'EUR',
                    img:
                        'https://cdn.grupoelcorteingles.es/SGFM/dctm/MEDIA02/CONTENIDOS/201510/05/00120902600244____2__325x325.jpg',
                    url:
                        '/supermercado/0110120902600244-el-corte-ingles-aceite-de-oliva-suave-04-botella-1-l/',
                    ean: '8433329065641',
                },
                {
                    id: '0110120902600244__2',
                    brand: 'EL CORTE INGLES',
                    category: ['Alimentación General', 'Alimentación general', 'Aceites', 'Aceite de oliva'],
                    name: 'EL CORTE INGLES aceite de oliva suave 0,4º botella 1 l',
                    price: {
                        final: '2.68',
                    },
                    discount: false,
                    status: 'AVAILABLE',
                    quantity: 1,
                    currency: 'EUR',
                    img:
                        'https://cdn.grupoelcorteingles.es/SGFM/dctm/MEDIA02/CONTENIDOS/201510/05/00120902600244____2__325x325.jpg',
                    url:
                        '/supermercado/0110120902600244-el-corte-ingles-aceite-de-oliva-suave-04-botella-1-l/',
                    ean: '8433329065641',
                },
                {
                    id: '0110120902600244__3',
                    brand: 'EL CORTE INGLES',
                    category: ['Alimentación General', 'Alimentación general', 'Aceites', 'Aceite de oliva'],
                    name: 'EL CORTE INGLES aceite de oliva suave 0,4º botella 1 l',
                    price: {
                        final: '2.68',
                    },
                    discount: false,
                    status: 'AVAILABLE',
                    quantity: 1,
                    currency: 'EUR',
                    img:
                        'https://cdn.grupoelcorteingles.es/SGFM/dctm/MEDIA02/CONTENIDOS/201510/05/00120902600244____2__325x325.jpg',
                    url:
                        '/supermercado/0110120902600244-el-corte-ingles-aceite-de-oliva-suave-04-botella-1-l/',
                    ean: '8433329065641',
                },
                {
                    id: '0110120902600244__4',
                    brand: 'EL CORTE INGLES',
                    category: ['Alimentación General', 'Alimentación general', 'Aceites', 'Aceite de oliva'],
                    name: 'EL CORTE INGLES aceite de oliva suave 0,4º botella 1 l',
                    price: {
                        final: '2.68',
                    },
                    discount: false,
                    status: 'AVAILABLE',
                    quantity: 1,
                    currency: 'EUR',
                    img:
                        'https://cdn.grupoelcorteingles.es/SGFM/dctm/MEDIA02/CONTENIDOS/201510/05/00120902600244____2__325x325.jpg',
                    url:
                        '/supermercado/0110120902600244-el-corte-ingles-aceite-de-oliva-suave-04-botella-1-l/',
                    ean: '8433329065641',
                },
                {
                    id: '0110120902600244__5',
                    brand: 'EL CORTE INGLES',
                    category: ['Alimentación General', 'Alimentación general', 'Aceites', 'Aceite de oliva'],
                    name: 'EL CORTE INGLES aceite de oliva suave 0,4º botella 1 l',
                    price: {
                        final: '2.68',
                    },
                    discount: false,
                    status: 'AVAILABLE',
                    quantity: 1,
                    currency: 'EUR',
                    img:
                        'https://cdn.grupoelcorteingles.es/SGFM/dctm/MEDIA02/CONTENIDOS/201510/05/00120902600244____2__325x325.jpg',
                    url:
                        '/supermercado/0110120902600244-el-corte-ingles-aceite-de-oliva-suave-04-botella-1-l/',
                    ean: '8433329065641',
                },
                {
                    id: '0110120902600244__6',
                    brand: 'EL CORTE INGLES',
                    category: ['Alimentación General', 'Alimentación general', 'Aceites', 'Aceite de oliva'],
                    name: 'EL CORTE INGLES aceite de oliva suave 0,4º botella 1 l',
                    price: {
                        final: '2.68',
                    },
                    discount: false,
                    status: 'AVAILABLE',
                    quantity: 1,
                    currency: 'EUR',
                    img:
                        'https://cdn.grupoelcorteingles.es/SGFM/dctm/MEDIA02/CONTENIDOS/201510/05/00120902600244____2__325x325.jpg',
                    url:
                        '/supermercado/0110120902600244-el-corte-ingles-aceite-de-oliva-suave-04-botella-1-l/',
                    ean: '8433329065641',
                },
                {
                    id: '0110120902600244__7',
                    brand: 'EL CORTE INGLES',
                    category: ['Alimentación General', 'Alimentación general', 'Aceites', 'Aceite de oliva'],
                    name: 'EL CORTE INGLES aceite de oliva suave 0,4º botella 1 l',
                    price: {
                        final: '2.68',
                    },
                    discount: false,
                    status: 'AVAILABLE',
                    quantity: 1,
                    currency: 'EUR',
                    img:
                        'https://cdn.grupoelcorteingles.es/SGFM/dctm/MEDIA02/CONTENIDOS/201510/05/00120902600244____2__325x325.jpg',
                    url:
                        '/supermercado/0110120902600244-el-corte-ingles-aceite-de-oliva-suave-04-botella-1-l/',
                    ean: '8433329065641',
                },
                {
                    id: '0110120902600244__8',
                    brand: 'EL CORTE INGLES',
                    category: ['Alimentación General', 'Alimentación general', 'Aceites', 'Aceite de oliva'],
                    name: 'EL CORTE INGLES aceite de oliva suave 0,4º botella 1 l',
                    price: {
                        final: '2.68',
                    },
                    discount: false,
                    status: 'AVAILABLE',
                    quantity: 1,
                    currency: 'EUR',
                    img:
                        'https://cdn.grupoelcorteingles.es/SGFM/dctm/MEDIA02/CONTENIDOS/201510/05/00120902600244____2__325x325.jpg',
                    url:
                        '/supermercado/0110120902600244-el-corte-ingles-aceite-de-oliva-suave-04-botella-1-l/',
                    ean: '8433329065641',
                },
                {
                    id: '0110120902600244__9',
                    brand: 'EL CORTE INGLES',
                    category: ['Alimentación General', 'Alimentación general', 'Aceites', 'Aceite de oliva'],
                    name: 'EL CORTE INGLES aceite de oliva suave 0,4º botella 1 l',
                    price: {
                        final: '2.68',
                    },
                    discount: false,
                    status: 'AVAILABLE',
                    quantity: 1,
                    currency: 'EUR',
                    img:
                        'https://cdn.grupoelcorteingles.es/SGFM/dctm/MEDIA02/CONTENIDOS/201510/05/00120902600244____2__325x325.jpg',
                    url:
                        '/supermercado/0110120902600244-el-corte-ingles-aceite-de-oliva-suave-04-botella-1-l/',
                    ean: '8433329065641',
                },
                {
                    id: '0110120902600244__10',
                    brand: 'EL CORTE INGLES',
                    category: ['Alimentación General', 'Alimentación general', 'Aceites', 'Aceite de oliva'],
                    name: 'EL CORTE INGLES aceite de oliva suave 0,4º botella 1 l',
                    price: {
                        final: '2.68',
                    },
                    discount: false,
                    status: 'AVAILABLE',
                    quantity: 1,
                    currency: 'EUR',
                    img:
                        'https://cdn.grupoelcorteingles.es/SGFM/dctm/MEDIA02/CONTENIDOS/201510/05/00120902600244____2__325x325.jpg',
                    url:
                        '/supermercado/0110120902600244-el-corte-ingles-aceite-de-oliva-suave-04-botella-1-l/',
                    ean: '8433329065641',
                },
                {
                    id: '0110120902600244__11',
                    brand: 'EL CORTE INGLES',
                    category: ['Alimentación General', 'Alimentación general', 'Aceites', 'Aceite de oliva'],
                    name: 'EL CORTE INGLES aceite de oliva suave 0,4º botella 1 l',
                    price: {
                        final: '2.68',
                    },
                    discount: false,
                    status: 'AVAILABLE',
                    quantity: 1,
                    currency: 'EUR',
                    img:
                        'https://cdn.grupoelcorteingles.es/SGFM/dctm/MEDIA02/CONTENIDOS/201510/05/00120902600244____2__325x325.jpg',
                    url:
                        '/supermercado/0110120902600244-el-corte-ingles-aceite-de-oliva-suave-04-botella-1-l/',
                    ean: '8433329065641',
                },
                {
                    id: '0110120902600244__12',
                    brand: 'EL CORTE INGLES',
                    category: ['Alimentación General', 'Alimentación general', 'Aceites', 'Aceite de oliva'],
                    name: 'EL CORTE INGLES aceite de oliva suave 0,4º botella 1 l',
                    price: {
                        final: '2.68',
                    },
                    discount: false,
                    status: 'AVAILABLE',
                    quantity: 1,
                    currency: 'EUR',
                    img:
                        'https://cdn.grupoelcorteingles.es/SGFM/dctm/MEDIA02/CONTENIDOS/201510/05/00120902600244____2__325x325.jpg',
                    url:
                        '/supermercado/0110120902600244-el-corte-ingles-aceite-de-oliva-suave-04-botella-1-l/',
                    ean: '8433329065641',
                },
                {
                    id: '0110120902600244__13',
                    brand: 'EL CORTE INGLES',
                    category: ['Alimentación General', 'Alimentación general', 'Aceites', 'Aceite de oliva'],
                    name: 'EL CORTE INGLES aceite de oliva suave 0,4º botella 1 l',
                    price: {
                        final: '2.68',
                    },
                    discount: false,
                    status: 'AVAILABLE',
                    quantity: 1,
                    currency: 'EUR',
                    img:
                        'https://cdn.grupoelcorteingles.es/SGFM/dctm/MEDIA02/CONTENIDOS/201510/05/00120902600244____2__325x325.jpg',
                    url:
                        '/supermercado/0110120902600244-el-corte-ingles-aceite-de-oliva-suave-04-botella-1-l/',
                    ean: '8433329065641',
                },
                {
                    id: '0110120902600244__14',
                    brand: 'EL CORTE INGLES',
                    category: ['Alimentación General', 'Alimentación general', 'Aceites', 'Aceite de oliva'],
                    name: 'EL CORTE INGLES aceite de oliva suave 0,4º botella 1 l',
                    price: {
                        final: '2.68',
                    },
                    discount: false,
                    status: 'AVAILABLE',
                    quantity: 1,
                    currency: 'EUR',
                    img:
                        'https://cdn.grupoelcorteingles.es/SGFM/dctm/MEDIA02/CONTENIDOS/201510/05/00120902600244____2__325x325.jpg',
                    url:
                        '/supermercado/0110120902600244-el-corte-ingles-aceite-de-oliva-suave-04-botella-1-l/',
                    ean: '8433329065641',
                },
                {
                    id: '0110120902600244__15',
                    brand: 'EL CORTE INGLES',
                    category: ['Alimentación General', 'Alimentación general', 'Aceites', 'Aceite de oliva'],
                    name: 'EL CORTE INGLES aceite de oliva suave 0,4º botella 1 l',
                    price: {
                        final: '2.68',
                    },
                    discount: false,
                    status: 'AVAILABLE',
                    quantity: 1,
                    currency: 'EUR',
                    img:
                        'https://cdn.grupoelcorteingles.es/SGFM/dctm/MEDIA02/CONTENIDOS/201510/05/00120902600244____2__325x325.jpg',
                    url:
                        '/supermercado/0110120902600244-el-corte-ingles-aceite-de-oliva-suave-04-botella-1-l/',
                    ean: '8433329065641',
                },
                {
                    id: '0110120902600244__16',
                    brand: 'EL CORTE INGLES',
                    category: ['Alimentación General', 'Alimentación general', 'Aceites', 'Aceite de oliva'],
                    name: 'EL CORTE INGLES aceite de oliva suave 0,4º botella 1 l',
                    price: {
                        final: '2.68',
                    },
                    discount: false,
                    status: 'AVAILABLE',
                    quantity: 1,
                    currency: 'EUR',
                    img:
                        'https://cdn.grupoelcorteingles.es/SGFM/dctm/MEDIA02/CONTENIDOS/201510/05/00120902600244____2__325x325.jpg',
                    url:
                        '/supermercado/0110120902600244-el-corte-ingles-aceite-de-oliva-suave-04-botella-1-l/',
                    ean: '8433329065641',
                },
                {
                    id: '0110120902600244__17',
                    brand: 'EL CORTE INGLES',
                    category: ['Alimentación General', 'Alimentación general', 'Aceites', 'Aceite de oliva'],
                    name: 'EL CORTE INGLES aceite de oliva suave 0,4º botella 1 l',
                    price: {
                        final: '2.68',
                    },
                    discount: false,
                    status: 'AVAILABLE',
                    quantity: 1,
                    currency: 'EUR',
                    img:
                        'https://cdn.grupoelcorteingles.es/SGFM/dctm/MEDIA02/CONTENIDOS/201510/05/00120902600244____2__325x325.jpg',
                    url:
                        '/supermercado/0110120902600244-el-corte-ingles-aceite-de-oliva-suave-04-botella-1-l/',
                    ean: '8433329065641',
                },
                {
                    id: '0110120902600244__18',
                    brand: 'EL CORTE INGLES',
                    category: ['Alimentación General', 'Alimentación general', 'Aceites', 'Aceite de oliva'],
                    name: 'EL CORTE INGLES aceite de oliva suave 0,4º botella 1 l',
                    price: {
                        final: '2.68',
                    },
                    discount: false,
                    status: 'AVAILABLE',
                    quantity: 1,
                    currency: 'EUR',
                    img:
                        'https://cdn.grupoelcorteingles.es/SGFM/dctm/MEDIA02/CONTENIDOS/201510/05/00120902600244____2__325x325.jpg',
                    url:
                        '/supermercado/0110120902600244-el-corte-ingles-aceite-de-oliva-suave-04-botella-1-l/',
                    ean: '8433329065641',
                },
                {
                    id: '0110120902600244__19',
                    brand: 'EL CORTE INGLES',
                    category: ['Alimentación General', 'Alimentación general', 'Aceites', 'Aceite de oliva'],
                    name: 'EL CORTE INGLES aceite de oliva suave 0,4º botella 1 l',
                    price: {
                        final: '2.68',
                    },
                    discount: false,
                    status: 'AVAILABLE',
                    quantity: 1,
                    currency: 'EUR',
                    img:
                        'https://cdn.grupoelcorteingles.es/SGFM/dctm/MEDIA02/CONTENIDOS/201510/05/00120902600244____2__325x325.jpg',
                    url:
                        '/supermercado/0110120902600244-el-corte-ingles-aceite-de-oliva-suave-04-botella-1-l/',
                    ean: '8433329065641',
                },
                {
                    id: '0110120902600244__20',
                    brand: 'EL CORTE INGLES',
                    category: ['Alimentación General', 'Alimentación general', 'Aceites', 'Aceite de oliva'],
                    name: 'EL CORTE INGLES aceite de oliva suave 0,4º botella 1 l',
                    price: {
                        final: '2.68',
                    },
                    discount: false,
                    status: 'AVAILABLE',
                    quantity: 1,
                    currency: 'EUR',
                    img:
                        'https://cdn.grupoelcorteingles.es/SGFM/dctm/MEDIA02/CONTENIDOS/201510/05/00120902600244____2__325x325.jpg',
                    url:
                        '/supermercado/0110120902600244-el-corte-ingles-aceite-de-oliva-suave-04-botella-1-l/',
                    ean: '8433329065641',
                },
            ],
            pageNumber: 0,
        });
    },
};

export default api;
