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
import {cartOutline} from 'ionicons/icons';
import Typography from '../components/typography';
import Fragment from '../components/fragment';
import {extendRawProducts} from '../utils';
import InfiniteScroll, {isLastPage} from '../components/infinite-scroll';
import {RouteComponentProps} from 'react-router';
import {Plugins, Capacitor} from '@capacitor/core';

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
                onDidPresent={() => setShowChart(true)}
                onDidDismiss={() => setShowChart(false)}
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
    const classes = useStyles();
    const [filter, setFilter] = React.useState<{searchText: string | null; pageNumber: number}>({
        searchText: 'ace',
        pageNumber: 0,
    });
    const [products, setProducts] = React.useState<ReadonlyArray<Product> | null>(null);
    const [isLoading, setLoading] = React.useState(false);
    const [disableInfiniteScroll, setDisableInfiniteScroll] = React.useState(false);
    const [totalSize, setTotalSize] = React.useState<number | null>(null);
    const {products: shoppingCart, dispatch} = useShoppingCart();
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
                    <IonSearchbar
                        value={filter.searchText}
                        enterkeyhint="search"
                        onIonChange={(e) => {
                            if (Capacitor.isNative) {
                                Plugins.Keyboard.hide();
                            }
                            if (products && products.length > 0) {
                                setProducts(null);
                                setTotalSize(null);
                            }
                            setFilter({
                                pageNumber: 0,
                                searchText: e.detail.value || null,
                            });
                            scrollToTop();
                        }}
                        debounce={1000}
                        animated
                        placeholder="Busca tus productos aquí"
                        showCancelButton="focus"
                        cancelButtonText="Borrar"
                    />
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
                            <Typography variant="h2" gutterBottom={16} className={classes.center}>
                                Busca tus productos <br />
                                directamente en el buscador
                            </Typography>
                        </>
                    )}
                </Box>
            </IonContent>
        </IonPage>
    );
};

export default SearchProducts;
