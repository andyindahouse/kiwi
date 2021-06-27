import * as React from 'react';
import {createUseStyles} from 'react-jss';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonSearchbar,
    IonModal,
    IonList,
    IonAlert,
    IonToast,
} from '@ionic/react';
import {Product, PantryProductStatus, PantryProduct} from '@kiwi/models';
import {Typography, palette} from '@kiwi/ui';
import ProductDetail from '../components/product-detail';
import kiwiApi from '../api';
import {getFormatDate} from '../utils/format-date';
import {differenceInDays} from 'date-fns';
import {RouteComponentProps, useHistory} from 'react-router';
import {SYNC_SHOPPING_CART, useShoppingCart} from '../contexts/shopping-cart';
import ProductItem, {ProductListItemSkeleton} from '../components/product-item';
import {getExpiryObj} from '../utils';
import EmptyCase from '../components/empty-case';
import {helpOutline, nutritionOutline} from 'ionicons/icons';

const useStyles = createUseStyles(() => ({
    center: {
        marginTop: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 16px',
    },
    title: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: 16,
        '& > h3': {
            marginRight: 8,
        },
    },
    list: {
        '& > div': {
            marginBottom: 16,
        },
    },
    card: {
        padding: '8px 0',
        display: 'grid',
        gridTemplateColumns: '64px 1fr 80px',
        gridGap: 8,
        '& > div': {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
        },
    },
    name: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        lineClamp: 2,
        display: 'box',
        boxOrient: 'vertical',
    },
    date: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        '& > h3': {
            color: palette.warning.dark,
        },
    },
    segmentItem: {
        display: 'flex',
        flexDirection: 'columns',
        alignItems: 'center',
        justifyContent: 'center',
        '& > p': {
            marginRight: 8,
        },
    },
}));

const hasExpiredDate = (date: string) => {
    const expiryDate = new Date(date);
    const currentDate = new Date();
    const daysDiff = differenceInDays(expiryDate, currentDate);

    return daysDiff < 0;
};

const ProductList = ({
    isLoading,
    products,
    segment,
    refreshProducts,
    isSearching,
}: {
    isLoading: boolean;
    products: ReadonlyArray<PantryProduct>;
    segment: PantryProductStatus;
    refreshProducts: (products: ReadonlyArray<PantryProduct>) => void;
    isSearching: boolean;
}) => {
    const classes = useStyles();
    const history = useHistory();
    const {products: shoppingCartProducts, dispatch} = useShoppingCart();
    const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
    const [selectedPantryProduct, setSelectedPantryProduct] = React.useState<PantryProduct | null>(null);
    const [showExpiryDateAlert, setShowExpiryDateAlert] = React.useState(false);
    const [showToast, setShowToast] = React.useState(false);
    const listRef = React.useRef<HTMLIonListElement | null>(null);
    const [showChart, setShowChart] = React.useState(false);

    const getProduct = React.useCallback((id: string) => kiwiApi.getProductDetail(id), []);
    const updatePantryProduct = React.useCallback(
        (product: PantryProduct) =>
            kiwiApi.updatePantryProduct(product).then((res) => {
                listRef.current?.closeSlidingItems();
                refreshProducts(products.filter((e) => e._id !== product._id));
                return res;
            }),
        [products, refreshProducts]
    );
    const consumedProduct = React.useCallback(
        async (selected: PantryProduct, consumedDate: string) => {
            try {
                const data = await updatePantryProduct({
                    ...selected,
                    inStorage: 'consumed',
                    consumedDate: consumedDate,
                });
                const product = await getProduct(data.id);
                const productIndex = shoppingCartProducts.findIndex((e) => e.id === product.id);
                const shoppingCart = await kiwiApi.setShoppingCart({
                    products:
                        productIndex === -1
                            ? [
                                  ...shoppingCartProducts,
                                  {
                                      ...product,
                                      units: 1,
                                  },
                              ]
                            : [
                                  ...shoppingCartProducts.slice(0, productIndex),
                                  {
                                      ...{
                                          ...shoppingCartProducts[productIndex],
                                          units: shoppingCartProducts[productIndex].units + 1,
                                      },
                                  },
                                  ...shoppingCartProducts.slice(productIndex + 1),
                              ],
                });
                dispatch({
                    type: SYNC_SHOPPING_CART,
                    shoppingCart,
                });
                setShowToast(true);
            } catch (err) {
                console.log(err);
            }
        },
        [shoppingCartProducts, dispatch, updatePantryProduct, getProduct]
    );

    if (isLoading) {
        return <ProductListItemSkeleton rows={4} />;
    }

    if (isSearching && products.length === 0 && !isLoading) {
        return (
            <EmptyCase
                title1="No se han encontrado productos"
                subtitle="No tienes productos en tu despensa que coincidan con esta búsqueda"
                icon={helpOutline}
            />
        );
    }

    if (products.length === 0 && !isLoading) {
        return (
            <EmptyCase
                title1="Bienvenido a tu despensa"
                subtitle="Aquí encontrarás tus productos una vez hagas tu compra"
                icon={nutritionOutline}
            />
        );
    }

    return (
        <>
            <IonList ref={listRef}>
                {products.map((product) => {
                    const expiryObj = getExpiryObj(product.date);
                    return (
                        <ProductItem
                            key={product._id}
                            img={product.img}
                            title={product.name}
                            subtitle={`Comprado el ${getFormatDate(product.buyedDate)}`}
                            handleClickDetail={() => {
                                getProduct(product.id).then((res) => {
                                    setSelectedProduct(res);
                                });
                            }}
                            labelRightAction="Consumido"
                            disableSwipeOptions={segment === 'consumed'}
                            handleClickRightAction={() => {
                                setSelectedPantryProduct(product);
                                if (hasExpiredDate(product.date)) {
                                    setShowExpiryDateAlert(true);
                                } else {
                                    consumedProduct(product, new Date().toISOString());
                                }
                            }}
                        >
                            {product.date && (
                                <div className={classes.date}>
                                    <Typography variant="caption1" style={{color: expiryObj.color}}>
                                        {expiryObj.label}
                                    </Typography>
                                    <Typography variant="subtitle2">caducidad</Typography>
                                    <Typography variant="subtitle2">
                                        {new Date(product.date).toLocaleDateString()}
                                    </Typography>
                                </div>
                            )}
                        </ProductItem>
                    );
                })}
            </IonList>
            <IonToast
                isOpen={!!showToast}
                onDidDismiss={() => setShowToast(false)}
                message="Producto añadido al carrito"
                position="bottom"
                duration={4000}
                translucent
                buttons={[
                    {
                        text: 'Ver carrito',
                        role: 'cancel',
                        handler: () => {
                            history.push('/search/cart');
                        },
                    },
                ]}
            />

            <IonAlert
                isOpen={showExpiryDateAlert && !!selectedPantryProduct}
                onDidDismiss={() => setShowExpiryDateAlert(false)}
                cssClass="my-custom-class"
                header="El producto aparece como caducado"
                message={'¿Consumiste este producto <strong>antes</strong> de que caducara?'}
                buttons={[
                    {
                        text: 'No',
                        handler: () => {
                            if (selectedPantryProduct) {
                                consumedProduct(selectedPantryProduct, new Date().toISOString());
                            }
                        },
                    },
                    {
                        text: 'Sí',
                        handler: () => {
                            if (selectedPantryProduct) {
                                consumedProduct(selectedPantryProduct, selectedPantryProduct.date);
                            }
                        },
                    },
                ]}
            />

            <IonModal
                isOpen={!!selectedProduct}
                onDidPresent={() => setShowChart(true)}
                onDidDismiss={() => {
                    setShowChart(false);
                    setSelectedProduct(null);
                }}
                backdropDismiss
            >
                {selectedProduct && (
                    <ProductDetail
                        closeModal={() => setSelectedProduct(null)}
                        product={selectedProduct}
                        showChart={showChart}
                    />
                )}
            </IonModal>
        </>
    );
};

type PantryProductsView = {
    products: ReadonlyArray<PantryProduct>;
    isLoading: boolean;
    totalSize: number | null;
};

const Pantry: React.FC<RouteComponentProps> = () => {
    const [searchText, setSearchText] = React.useState('');
    const [pendingProducts, setPendingProducts] = React.useState<PantryProductsView | null>(null);

    React.useEffect(() => {
        setPendingProducts({
            products: [],
            totalSize: null,
            isLoading: true,
        });
        kiwiApi
            .getPantry({
                pageNumber: 0,
                inStorage: 'pending',
                searchText,
            })
            .then((res) => {
                setPendingProducts({
                    products: res.content,
                    totalSize: res.totalSize,
                    isLoading: false,
                });
            });
    }, [searchText]);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Mi despensa</IonTitle>
                </IonToolbar>
                <IonToolbar>
                    <IonSearchbar
                        value={searchText}
                        onIonChange={(e) => {
                            setSearchText(e.detail.value ?? '');
                        }}
                        animated
                        debounce={300}
                        placeholder="Buscar en mi despensa"
                        showCancelButton="focus"
                        cancelButtonText="Borrar"
                    />
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {pendingProducts && (
                    <ProductList
                        isSearching={!!searchText}
                        products={pendingProducts?.products}
                        isLoading={pendingProducts.isLoading}
                        segment="pending"
                        refreshProducts={(products) => {
                            setPendingProducts({
                                isLoading: false,
                                totalSize: products.length,
                                products,
                            });
                        }}
                    />
                )}
            </IonContent>
        </IonPage>
    );
};

export default Pantry;
