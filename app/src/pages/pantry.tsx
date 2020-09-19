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
    IonItem,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonFabButton,
    IonFab,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonBadge,
    IonList,
    IonAlert,
    IonToast,
    IonButtons,
    IonBackButton,
} from '@ionic/react';
import {scanSharp} from 'ionicons/icons';
import {Product, PantryProductStatus, PantryProduct} from '../models';
import Typography from '../components/typography';
import palette from '../theme/palette';
import ProductDetail from '../components/product-detail';
import kiwiApi from '../api';
import {getFormatDate} from '../utils/format-date';
import {differenceInDays, isSameDay} from 'date-fns';
import {RouteComponentProps, useHistory} from 'react-router';
import {useShoppingCart} from '../contexts/shopping-cart';
import ProductItem from '../components/product-item';

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

const getExpiryObj = (date: string) => {
    const expiryDate = new Date(date);
    const currentDate = new Date();
    const daysDiff = differenceInDays(expiryDate, currentDate);

    if (isSameDay(expiryDate, currentDate)) {
        return {
            color: palette.error.main,
            label: 'Hoy',
        };
    }

    if (daysDiff < 0) {
        return {
            color: palette.error.main,
            label: 'Caducado',
        };
    }

    if (daysDiff <= 3) {
        return {
            color: palette.warning.dark,
            label: `${daysDiff} días`,
        };
    }

    return {
        color: palette.primary.dark,
        label: `${daysDiff} días`,
    };
};

const segmentMap: Record<PantryProductStatus, {emptyMessage: string}> = {
    pending: {
        emptyMessage:
            'Ahora mismo no tienes productos por clasificar. Aquí encontrarás los productos según tu pedido sea entregado.',
    },
    cooled: {
        emptyMessage:
            'Ahora mismo no tienes alimentos en el frigorífico. Puedes añadir tus alimentos al frigorífico desde la sección de "Por clasificar"',
    },
    frozen: {
        emptyMessage:
            'Ahora mismo no tienes alimentos en el congelador. Puedes añadir tus alimentos al congelador desde la sección de "Por clasificar", esto afectará a las notificaciones de proximos a caducar dado que los alimentos congelados resisten más tiempo',
    },
    storaged: {
        emptyMessage:
            'Ahora mismo no tienes alimentos en tu despensa. Puedes añadir alimentos a tu despensa desde la sección de "Por clasificar"',
    },
    consumed: {
        emptyMessage:
            'Ahora mismo no tienes alimentos consumidos puedes marcar tus alimentos según los vayas consumiendo. Podrás encontrar los mismos en la sección en las que los tengas clasificados o usando el buscador.',
    },
    others: {
        emptyMessage:
            'Ahora mismo no tienes productos aquí. Usa esta categoría para clasificar todos los productos que no encajen en las otras categorías.',
    },
};

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
    refreshSegmentClassifyProduct,
}: {
    isLoading: boolean;
    products: ReadonlyArray<PantryProduct>;
    segment: PantryProductStatus;
    refreshProducts: (products: ReadonlyArray<PantryProduct>) => void;
    refreshSegmentClassifyProduct: (target: PantryProductStatus) => void;
}) => {
    const classes = useStyles();
    const history = useHistory();
    const {products: shoppingCartProducts} = useShoppingCart();
    const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
    const [selectedPantryProduct, setSelectedPantryProduct] = React.useState<PantryProduct | null>(null);
    const [showClassifyAlert, setShowClassifyAlert] = React.useState(false);
    const [showExpiryDateAlert, setShowExpiryDateAlert] = React.useState(false);
    const [showToast, setShowToast] = React.useState(false);
    const listRef = React.useRef<HTMLIonListElement | null>(null);

    const getProduct = (ean: string) => kiwiApi.getProductDetail(ean);
    const consumedProduct = async (consumedDate: string) => {
        if (selectedPantryProduct) {
            try {
                const {data} = await updatePantryProduct({
                    ...selectedPantryProduct,
                    inStorage: 'consumed',
                    consumedDate: consumedDate,
                });
                const product = await getProduct(data.ean);
                const productIndex = shoppingCartProducts.findIndex((e) => e.id === product.id);
                await kiwiApi.setShoppingCart({
                    products:
                        productIndex === -1
                            ? [
                                  ...shoppingCartProducts,
                                  {
                                      ...product,
                                      units: 1,
                                  },
                              ]
                            : shoppingCartProducts
                                  .slice(0, productIndex)
                                  .concat(shoppingCartProducts.slice(productIndex + 1)),
                });
                setShowToast(true);
            } catch (err) {
                console.log(err);
            }
        } else {
            throw Error('selectedPantryProduct should have a value');
        }
    };
    const updatePantryProduct = async (product: PantryProduct) =>
        kiwiApi.updatePantryProduct(product).then((res) => {
            listRef.current?.closeSlidingItems();
            refreshProducts(products.filter((e) => e._id !== product._id));
            return res;
        });

    if (products.length === 0 && !isLoading) {
        return (
            <div className={classes.center}>
                <Typography>{segmentMap[segment].emptyMessage}</Typography>
            </div>
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
                                getProduct(product.ean).then((res) => {
                                    setSelectedProduct(res);
                                });
                            }}
                            labelLeftAction="Clasificar"
                            labelRightAction="Consumido"
                            handleClickLeftAction={() => {
                                setSelectedPantryProduct(product);
                                setShowClassifyAlert(true);
                            }}
                            disableSwipeOptions={segment === 'consumed'}
                            handleClickRightAction={() => {
                                if (hasExpiredDate(product.date)) {
                                    setSelectedPantryProduct(product);
                                    setShowExpiryDateAlert(true);
                                } else {
                                    consumedProduct(new Date().toISOString());
                                }
                            }}
                        >
                            <div className={classes.date}>
                                <Typography style={{color: expiryObj.color}}>{expiryObj.label}</Typography>
                                <Typography variant="subtitle2">
                                    caducidad
                                    <br />
                                    {new Date(product.date).toLocaleDateString()}
                                </Typography>
                            </div>
                        </ProductItem>
                    );
                })}
            </IonList>

            <IonAlert
                isOpen={showClassifyAlert}
                onDidDismiss={() => setShowClassifyAlert(false)}
                cssClass="my-custom-class"
                header={'Radio'}
                inputs={[
                    {
                        name: 'radio2',
                        type: 'radio',
                        label: 'Frigorífico',
                        value: 'cooled',
                        checked: segment === 'cooled',
                    },
                    {
                        name: 'radio3',
                        type: 'radio',
                        label: 'Congelador',
                        value: 'frozen',
                        checked: segment === 'frozen',
                    },
                    {
                        name: 'radio4',
                        type: 'radio',
                        label: 'Despensa',
                        value: 'storaged',
                        checked: segment === 'storaged',
                    },
                    {
                        name: 'radio5',
                        type: 'radio',
                        label: 'Otros',
                        value: 'others',
                        checked: segment === 'others',
                    },
                ]}
                buttons={[
                    {
                        text: 'Cancelar',
                        role: 'cancel',
                        handler: () => {
                            listRef.current?.closeSlidingItems();
                        },
                    },
                    {
                        text: 'Aceptar',
                        handler: (value: PantryProductStatus) => {
                            if (selectedPantryProduct) {
                                updatePantryProduct({
                                    ...selectedPantryProduct,
                                    inStorage: value,
                                }).then(() => {
                                    console.log('works', refreshSegmentClassifyProduct);
                                    refreshSegmentClassifyProduct && refreshSegmentClassifyProduct(value);
                                });
                            }
                        },
                    },
                ]}
            />

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
                isOpen={showExpiryDateAlert}
                onDidDismiss={() => setShowExpiryDateAlert(false)}
                cssClass="my-custom-class"
                header="El producto aparece como caducado"
                message={'¿Consumiste este producto <strong>antes</strong> de que caducará?'}
                buttons={[
                    {
                        text: 'No',
                        handler: () => {
                            consumedProduct(new Date().toISOString());
                        },
                    },
                    {
                        text: 'Sí',
                        handler: () => {
                            if (selectedPantryProduct) {
                                consumedProduct(selectedPantryProduct.date);
                            }
                        },
                    },
                ]}
            />

            <IonModal isOpen={!!selectedProduct}>
                {selectedProduct && (
                    <ProductDetail closeModal={() => setSelectedProduct(null)} product={selectedProduct} />
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

const Pantry: React.FC<RouteComponentProps> = ({location}) => {
    const classes = useStyles();
    const [segment, setSegment] = React.useState<PantryProductStatus>('pending');
    const [searchText, setSearchText] = React.useState('');
    const [pendingProducts, setPendingProducts] = React.useState<PantryProductsView | null>(null);
    const [cooledProducts, setCooledProducts] = React.useState<PantryProductsView | null>(null);
    const [frozenProducts, setFrozenProducts] = React.useState<PantryProductsView | null>(null);
    const [storagedProducts, setStoragedProducts] = React.useState<PantryProductsView | null>(null);
    const [othersProducts, setOthersProducts] = React.useState<PantryProductsView | null>(null);
    const refresh = (
        inStorage: PantryProductStatus,
        setter: React.Dispatch<
            React.SetStateAction<{
                products: ReadonlyArray<PantryProduct>;
                isLoading: boolean;
                totalSize: number | null;
            } | null>
        >,
        searchText?: string
    ) => {
        setter({
            products: [],
            totalSize: null,
            isLoading: true,
        });
        kiwiApi
            .getPantry({
                pageNumber: 0,
                inStorage,
                searchText,
            })
            .then((res) => {
                setter({
                    products: res.content,
                    totalSize: res.totalSize,
                    isLoading: false,
                });
            });
    };
    const refreshSegment = (segment: PantryProductStatus) => {
        console.log(segment, 'andy');
        switch (segment) {
            case 'cooled':
                refresh('cooled', setCooledProducts, searchText);
                break;
            case 'frozen':
                refresh('frozen', setFrozenProducts, searchText);
                break;
            case 'storaged':
                refresh('storaged', setStoragedProducts, searchText);
                break;
            case 'consumed':
                break;
            case 'pending':
                refresh('pending', setPendingProducts, searchText);
                break;
            case 'others':
                refresh('others', setOthersProducts, searchText);
                break;
            default:
                break;
        }
    };

    React.useEffect(() => {
        refreshSegment('pending');
        refreshSegment('cooled');
        refreshSegment('frozen');
        refreshSegment('storaged');
        refreshSegment('others');
    }, [searchText]);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton text="Volver" defaultHref="/others" />
                    </IonButtons>
                    <IonTitle>Tu despensa</IonTitle>
                </IonToolbar>
                <IonToolbar>
                    <IonSearchbar
                        value={searchText}
                        onIonChange={(e) => {
                            setSearchText(e.detail.value ?? '');
                        }}
                        animated
                        debounce={1000}
                        placeholder="Buscar en tu despensa"
                        showCancelButton="focus"
                        cancelButtonText="Borrar"
                    ></IonSearchbar>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton>
                        <IonIcon icon={scanSharp} />
                    </IonFabButton>
                </IonFab>
                <IonToolbar>
                    <IonSegment
                        scrollable
                        onIonChange={(e) => {
                            setSegment(e.detail.value as PantryProductStatus);
                        }}
                        value={segment}
                    >
                        <IonSegmentButton value="pending">
                            <div className={classes.segmentItem}>
                                <Typography variant="caption2">Por clasificar</Typography>
                                {pendingProducts?.totalSize && (
                                    <IonBadge color="primary">{pendingProducts.totalSize}</IonBadge>
                                )}
                            </div>
                        </IonSegmentButton>
                        <IonSegmentButton value="cooled">
                            <div className={classes.segmentItem}>
                                <Typography variant="caption2">Frigo</Typography>
                                {cooledProducts?.totalSize && (
                                    <IonBadge color="primary">{cooledProducts.totalSize}</IonBadge>
                                )}
                            </div>
                        </IonSegmentButton>
                        <IonSegmentButton value="frozen">
                            <div className={classes.segmentItem}>
                                <Typography variant="caption2">Congelador</Typography>
                                {frozenProducts?.totalSize && (
                                    <IonBadge color="primary">{frozenProducts.totalSize}</IonBadge>
                                )}
                            </div>
                        </IonSegmentButton>
                        <IonSegmentButton value="storaged">
                            <div className={classes.segmentItem}>
                                <Typography variant="caption2">Despensa</Typography>
                                {storagedProducts?.totalSize && (
                                    <IonBadge color="primary">{storagedProducts.totalSize}</IonBadge>
                                )}
                            </div>
                        </IonSegmentButton>
                        <IonSegmentButton value="others">
                            <div className={classes.segmentItem}>
                                <Typography variant="caption2">Otros</Typography>
                                {othersProducts?.totalSize && (
                                    <IonBadge color="primary">{othersProducts.totalSize}</IonBadge>
                                )}
                            </div>
                        </IonSegmentButton>
                    </IonSegment>
                </IonToolbar>

                {segment === 'pending' && pendingProducts && (
                    <ProductList
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
                        refreshSegmentClassifyProduct={refreshSegment}
                    />
                )}
                {segment === 'cooled' && cooledProducts && (
                    <ProductList
                        products={cooledProducts?.products}
                        isLoading={cooledProducts.isLoading}
                        segment="cooled"
                        refreshProducts={(products) => {
                            setCooledProducts({
                                isLoading: false,
                                totalSize: products.length,
                                products,
                            });
                        }}
                        refreshSegmentClassifyProduct={refreshSegment}
                    />
                )}
                {segment === 'frozen' && frozenProducts && (
                    <ProductList
                        products={frozenProducts?.products}
                        isLoading={frozenProducts.isLoading}
                        segment="frozen"
                        refreshProducts={(products) => {
                            setFrozenProducts({
                                isLoading: false,
                                totalSize: products.length,
                                products,
                            });
                        }}
                        refreshSegmentClassifyProduct={refreshSegment}
                    />
                )}
                {segment === 'storaged' && storagedProducts && (
                    <ProductList
                        products={storagedProducts?.products}
                        isLoading={storagedProducts.isLoading}
                        segment="storaged"
                        refreshProducts={(products) => {
                            setStoragedProducts({
                                isLoading: false,
                                totalSize: products.length,
                                products,
                            });
                        }}
                        refreshSegmentClassifyProduct={refreshSegment}
                    />
                )}
                {segment === 'others' && othersProducts && (
                    <ProductList
                        products={othersProducts?.products}
                        isLoading={othersProducts.isLoading}
                        segment="others"
                        refreshProducts={(products) => {
                            setOthersProducts({
                                isLoading: false,
                                totalSize: products.length,
                                products,
                            });
                        }}
                        refreshSegmentClassifyProduct={refreshSegment}
                    />
                )}
            </IonContent>
        </IonPage>
    );
};

export default Pantry;
