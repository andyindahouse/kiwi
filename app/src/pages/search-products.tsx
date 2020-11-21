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
    IonButtons,
    IonButton,
} from '@ionic/react';
import kiwiApi from '../api';
import {Product} from '../models';
import ProductCard from '../components/product-card';
import ProductDetail from '../components/product-detail';
import Box from '../components/box';
import {
    UpdateShoppingCartProduct,
    UPDATE_SHOPPING_CART_PRODUCT,
    useShoppingCart,
} from '../contexts/shopping-cart';
import {cartOutline, searchOutline} from 'ionicons/icons';
import Fragment from '../components/fragment';
import {extendRawProducts} from '../utils';
import InfiniteScroll, {isLastPage} from '../components/infinite-scroll';
import {RouteComponentProps} from 'react-router';
import EmptyCase from '../components/empty-case';
import {Capacitor, Plugins} from '@capacitor/core';

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
    const [selected, setSelected] = React.useState<Product | null>(null);
    const [showChart, setShowChart] = React.useState(false);
    const {products: shoppingCart} = useShoppingCart();

    React.useEffect(() => {
        kiwiApi.setShoppingCart({products: shoppingCart}).catch((res) => {
            throw new Error('Carrito desactualizado');
        });
    }, [shoppingCart]);

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
                        updateProduct={(product: Product) =>
                            updateShoppingCart({
                                type: UPDATE_SHOPPING_CART_PRODUCT,
                                product,
                            })
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

const SearchProducts: React.FC<RouteComponentProps> = ({history}: RouteComponentProps) => {
    const {products: shoppingCart, dispatch} = useShoppingCart();
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
    }, [filter]);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{totalSize ? `${totalSize} resultados` : 'Comprar'}</IonTitle>
                    <IonButtons slot="primary">
                        <IonButton onClick={() => history.push('/search/cart')}>Carrito</IonButton>
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
                            updateShoppingCart={dispatch}
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
