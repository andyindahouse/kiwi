import React from 'react';
import {InfiniteScroll, Fragment} from '@kiwi/ionic';
import {Box, createUseStyles} from '@kiwi/ui';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonSearchbar,
    IonModal,
    IonButtons,
    IonButton,
} from '@ionic/react';
import kiwiApi from '../api';
import {Product} from '@kiwi/models';
import ProductCard from '../components/product-card';
import ProductDetail from '../components/product-detail';
import {SYNC_SHOPPING_CART, useShoppingCart} from '../contexts/shopping-cart';
import {cartOutline, searchOutline} from 'ionicons/icons';
import {extendRawProducts, updateProducts} from '../utils';
import {RouteComponentProps} from 'react-router';
import EmptyCase from '../components/empty-case';
import {Capacitor, Plugins} from '@capacitor/core';
import {useAuth} from '../contexts/auth';
import {setPersistedShoppingCartProducts} from '../utils/unauthenticated-persistence';

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
}: {
    isLoading: boolean;
    products: ReadonlyArray<Product>;
    disableInfiniteScroll: boolean;
    handleScrollEvent: () => void;
}) => {
    const classes = useStyles();
    const [selected, setSelected] = React.useState<Product | null>(null);
    const [showChart, setShowChart] = React.useState(false);
    const {products: shoppingCartProducts, dispatch} = useShoppingCart();
    const {user} = useAuth();

    const updateShoppingCart = React.useCallback(
        (updatedProducts: ReadonlyArray<Product>) => {
            const request = user ? kiwiApi.setShoppingCart : setPersistedShoppingCartProducts;

            request({products: updatedProducts})
                .then((res) => {
                    dispatch({
                        type: SYNC_SHOPPING_CART,
                        shoppingCart: res,
                    });
                })
                .catch(() => {
                    throw new Error('Carrito desactualizado');
                });
        },
        [dispatch, user]
    );

    if (products.length === 0 && !isLoading) {
        return <div>No hemos encontrado productos para esa busqueda</div>;
    }

    return (
        <>
            <div className={classes.container}>
                {products.map((product, index) => (
                    <ProductCard
                        key={index}
                        updateUnits={(units: number) => {
                            updateShoppingCart(updateProducts({...product, units}, shoppingCartProducts));
                        }}
                        handleClickDetail={() => {
                            setSelected(product);
                        }}
                        product={product}
                    />
                ))}
            </div>

            <InfiniteScroll
                isLoading={isLoading}
                disabled={disableInfiniteScroll}
                handleScrollEvent={handleScrollEvent}
            />

            <IonModal
                isOpen={!!selected}
                backdropDismiss
                onDidPresent={() => setShowChart(true)}
                onDidDismiss={() => {
                    setSelected(null);
                    setShowChart(false);
                }}
            >
                {selected && (
                    <ProductDetail
                        updateProduct={
                            (product: Product) =>
                                updateShoppingCart(updateProducts(product, shoppingCartProducts))
                            // updateShoppingCart({
                            //     type: UPDATE_SHOPPING_CART_PRODUCT,
                            //     product,
                            // })
                        }
                        closeModal={() => setSelected(null)}
                        product={selected}
                        showChart={showChart}
                    />
                )}
            </IonModal>
        </>
    );
};

const isLastPage = (pageNumber: number, pageSize: number, totalSize: number, contentLength: number) =>
    (pageNumber > 0 ? pageNumber * pageSize + contentLength : contentLength) === totalSize;

const SearchProducts: React.FC<RouteComponentProps> = ({history}: RouteComponentProps) => {
    const {products: shoppingCart} = useShoppingCart();
    const [filter, setFilter] = React.useState<{searchText: string | null; pageNumber: number}>({
        searchText: '',
        pageNumber: 0,
    });
    const [products, setProducts] = React.useState<ReadonlyArray<Product> | null>(null);
    const [isLoading, setLoading] = React.useState(false);
    const [disableInfiniteScroll, setDisableInfiniteScroll] = React.useState(false);
    const [totalSize, setTotalSize] = React.useState<number | null>(null);
    const contentRef = React.useRef<HTMLIonContentElement | null>(null);
    const scrollToTop = () => {
        contentRef.current && contentRef.current.scrollToTop();
    };

    React.useEffect(() => {
        setProducts((products) => {
            if (products) {
                return extendRawProducts(products, shoppingCart);
            }
            return products;
        });
    }, [shoppingCart]);

    React.useEffect(() => {
        if (filter.searchText) {
            setLoading(true);
            kiwiApi.getProducts(filter).then((res) => {
                setLoading(false);
                setTotalSize(res.totalSize);
                setProducts((products) =>
                    (products ?? []).concat(extendRawProducts(res.content, shoppingCart))
                );
                if (isLastPage(res.pageNumber, res.pageSize, res.totalSize, res.content.length)) {
                    setDisableInfiniteScroll(true);
                } else {
                    setDisableInfiniteScroll(false);
                }
            });
        }
    }, [filter, shoppingCart]);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{totalSize ? `${totalSize} resultados` : 'Comprar'}</IonTitle>
                    <IonButtons slot="primary">
                        <IonButton
                            size="large"
                            color="secondary"
                            onClick={() => history.push('/search/cart')}
                        >
                            Ver Carrito ({shoppingCart.length})
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
                <IonToolbar>
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            if (Capacitor.isNative) {
                                Plugins.Keyboard.hide();
                            }
                        }}
                    >
                        <IonSearchbar
                            enterkeyhint="search"
                            onIonFocus={() => {
                                scrollToTop();
                            }}
                            onIonChange={(e) => {
                                if (products && products.length > 0) {
                                    setProducts(null);
                                    setTotalSize(null);
                                }
                                setFilter({
                                    pageNumber: 0,
                                    searchText: e.detail.value || null,
                                });
                            }}
                            debounce={500}
                            animated
                            placeholder="Busca tus productos aquí"
                            showCancelButton="focus"
                            cancelButtonText="Borrar"
                        />
                    </form>
                </IonToolbar>
            </IonHeader>
            <IonContent ref={contentRef} scrollEvents={true}>
                <Box>
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
                        />
                    ) : (
                        <>
                            <Fragment icon={cartOutline} text="Tu compra actual" link="/search/cart" />
                            <EmptyCase
                                icon={searchOutline}
                                title1="Busca tus productos"
                                title2="directamente en el buscador"
                            />
                        </>
                    )}
                </Box>
            </IonContent>
        </IonPage>
    );
};

export default SearchProducts;
