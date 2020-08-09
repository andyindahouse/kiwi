import React from 'react';
import {createUseStyles} from 'react-jss';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonSearchbar,
    IonModal,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
} from '@ionic/react';
import kiwiApi, {GetProductsQueryParams} from '../api';
import {Product} from '../models';
import ProductCard from '../components/product-card';
import ProductDetail from '../components/product-detail';
import Container from '../components/container';
import {
    UpdateShoppingCartProduct,
    UPDATE_SHOPPING_CART_PRODUCT,
    useShoppingCart,
} from '../contexts/shopping-cart';
import {cartOutline} from 'ionicons/icons';
import Typography from '../components/typography';
import Fragment from '../components/fragment';
import {extendRawProducts} from '../utils';
import ShoppingCart from './shopping-cart';

const useStyles = createUseStyles(() => ({
    container: {
        display: 'grid',
        gridGap: 8,
        gridTemplateColumns: '1fr 1fr 1fr',
        marginBottom: 40,
    },
    center: {
        marginTop: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    },
    modal: {
        padding: 16,
    },
    image: {
        margin: 16,
        height: 325,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        position: 'relative',
    },
    price: {
        padding: '4px',
        borderRadius: '16px',
        backgroundColor: '#EC445A',
        display: 'inline-block',
        position: 'absolute',
        right: '5px',
        bottom: '5px',
        color: '#FFFFFF',
        fontSize: '24px',
        fontWeight: '600',
    },
    icon: {},
    footer: {},
}));

const ProductList = ({
    isLoading,
    products,
    disableInfiniteScroll,
    handleScrollEvent,
    updateShoppingCart,
}: {
    isLoading: boolean;
    products: ReadonlyArray<Product>;
    disableInfiniteScroll: boolean;
    handleScrollEvent: () => void;
    updateShoppingCart: (action: UpdateShoppingCartProduct) => void;
}) => {
    const classes = useStyles();
    const [showModal, setShowModal] = React.useState(false);
    const [selected, setSelected] = React.useState<Product | null>(null);
    const infiniteScrollRef = React.useRef<HTMLIonInfiniteScrollElement | null>(
        document.getElementById('infiniteScroll') as HTMLIonInfiniteScrollElement
    );
    const {products: shoppingCart} = useShoppingCart();

    React.useEffect(() => {
        kiwiApi.setShoppingCart({products: shoppingCart}).then((res) => {
            if (!res) {
                throw new Error('Carrito desactualizado');
            }
        });
    }, [shoppingCart]);

    React.useEffect(() => {
        if (!isLoading) {
            if (!infiniteScrollRef.current) {
                infiniteScrollRef.current = document.getElementById(
                    'infiniteScroll'
                ) as HTMLIonInfiniteScrollElement;
            }
            infiniteScrollRef.current?.complete();
        }
    }, [isLoading]);

    if (products.length === 0 && !isLoading) {
        return <div>No hemos encontrado productos para esa busqueda</div>;
    }

    return (
        <>
            <div className={classes.container}>
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        updateUnits={(units: number) => {
                            updateShoppingCart({
                                type: UPDATE_SHOPPING_CART_PRODUCT,
                                product: {...product, units},
                            });
                        }}
                        handleClickDetail={() => {
                            setSelected(product);
                        }}
                        product={product}
                    />
                ))}
            </div>
            <IonInfiniteScroll
                threshold="100px"
                id="infiniteScroll"
                disabled={disableInfiniteScroll}
                onIonInfinite={() => handleScrollEvent()}
            >
                <IonInfiniteScrollContent loadingSpinner="crescent" loadingText="Cargando..." />
            </IonInfiniteScroll>

            <IonModal isOpen={!!selected}>
                {selected && (
                    <ProductDetail
                        updateShoppingCartProduct={(product: Product) =>
                            updateShoppingCart({
                                type: UPDATE_SHOPPING_CART_PRODUCT,
                                product,
                            })
                        }
                        closeModal={() => setSelected(null)}
                        product={selected}
                    />
                )}
            </IonModal>
        </>
    );
};

const SearchProducts: React.FC = () => {
    const classes = useStyles();
    const [filter, setFilter] = React.useState<GetProductsQueryParams>({
        searchText: '',
        pageNumber: 0,
    });
    const [products, setProducts] = React.useState<ReadonlyArray<Product> | null>(null);
    const [isLoading, setLoading] = React.useState(false);
    const [disableInfiniteScroll, setDisableInfiniteScroll] = React.useState(false);
    const [totalSize, setTotalSize] = React.useState<number | null>(null);
    const {products: shoppingCart, dispatch} = useShoppingCart();

    React.useEffect(() => {
        if (products) {
            setProducts((products) => {
                if (products) {
                    return extendRawProducts(products, shoppingCart);
                }
                return products;
            });
        }
    }, [shoppingCart]);

    React.useEffect(() => {
        if (products && products.length === totalSize) {
            setDisableInfiniteScroll(true);
        }
    }, [products, totalSize]);

    React.useEffect(() => {
        if (filter.searchText) {
            setLoading(true);
            kiwiApi.getProducts(filter).then((res) => {
                setLoading(false);
                setTotalSize(res.totalSize);
                setProducts((products) =>
                    (products ?? []).concat(extendRawProducts(res.content, shoppingCart))
                );
            });
        }
    }, [filter]);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Comprar</IonTitle>
                </IonToolbar>
                <IonToolbar>
                    <IonSearchbar
                        value={filter.searchText}
                        onIonChange={(e) => {
                            if (products && products.length > 0) {
                                setProducts(null);
                            }
                            setDisableInfiniteScroll(false);
                            setFilter({
                                pageNumber: 0,
                                searchText: e.detail.value || null,
                            });
                        }}
                        debounce={1000}
                        animated
                        placeholder="Busca tus productos aquí"
                        showCancelButton="focus"
                        cancelButtonText="Borrar"
                    />
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <Container>
                    {products ? (
                        <ProductList
                            products={products}
                            isLoading={isLoading}
                            handleScrollEvent={() => {
                                setFilter({
                                    ...filter,
                                    pageNumber: filter.pageNumber + 1,
                                });
                            }}
                            disableInfiniteScroll={disableInfiniteScroll}
                            updateShoppingCart={dispatch}
                        />
                    ) : (
                        <>
                            <Fragment icon={cartOutline} text="Tu compra actual" link="/shopping/cart" />
                            <Typography variant="h2" gutterBottom={16} className={classes.center}>
                                Busca tus productos <br />
                                directamente en el buscador
                            </Typography>
                        </>
                    )}
                </Container>
            </IonContent>
        </IonPage>
    );
};

export default SearchProducts;
