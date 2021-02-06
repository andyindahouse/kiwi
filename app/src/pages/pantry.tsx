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
import {Product, PantryProductStatus, PantryProduct} from '../models';
import Typography from '../components/typography';
import palette from '../theme/palette';
import ProductDetail from '../components/product-detail';
import kiwiApi from '../api';
import {getFormatDate} from '../utils/format-date';
import {differenceInDays} from 'date-fns';
import {RouteComponentProps, useHistory} from 'react-router';
import {SYNC_SHOPPING_CART, useShoppingCart} from '../contexts/shopping-cart';
import ProductItem from '../components/product-item';
import {getExpiryObj} from '../utils';
import EmptyCase from '../components/empty-case';
import {bandageOutline, cafeOutline, fishOutline, shapesOutline, snowOutline} from 'ionicons/icons';

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

const segmentMap: Record<
    PantryProductStatus,
    {emptyMessage: {title1: string; title2: string}; icon: string}
> = {
    pending: {
        emptyMessage: {
            title1: 'No tienes productos por clasificar',
            title2: 'Aquí encontrarás los productos cuando tus pedidos sean entregados',
        },
        icon: shapesOutline,
    },
    cooled: {
        emptyMessage: {
            title1: 'No tienes alimentos en el frigorífico',
            title2: 'Puedes añadir tus alimentos al frigorífico desde la sección de "Por clasificar"',
        },
        icon: fishOutline,
    },
    frozen: {
        emptyMessage: {
            title1: 'No tienes alimentos en el congelador',
            title2: 'Puedes añadir tus alimentos al congelador desde la sección de "Por clasificar"',
        },
        icon: snowOutline,
    },
    storaged: {
        emptyMessage: {
            title1: 'No tienes alimentos en tu despensa',
            title2: 'Puedes añadir alimentos a tu despensa desde la sección de "Por clasificar"',
        },
        icon: cafeOutline,
    },
    consumed: {
        emptyMessage: {
            title1: 'No tienes alimentos consumidos puedes marcar tus alimentos según los vayas consumiendo',
            title2:
                'Podrás encontrar los mismos en la sección en las que los tengas clasificados o usando el buscador',
        },
        icon: shapesOutline,
    },
    others: {
        emptyMessage: {
            title1: 'No tienes productos aquí',
            title2:
                'Usa esta categoría para clasificar todos los productos que no encajen en las otras categorías.',
        },
        icon: bandageOutline,
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
}: {
    isLoading: boolean;
    products: ReadonlyArray<PantryProduct>;
    segment: PantryProductStatus;
    refreshProducts: (products: ReadonlyArray<PantryProduct>) => void;
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

    const getProduct = (id: string) => kiwiApi.getProductDetail(id);
    const consumedProduct = async (selected: PantryProduct, consumedDate: string) => {
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
    };
    const updatePantryProduct = async (product: PantryProduct) =>
        kiwiApi.updatePantryProduct(product).then((res) => {
            listRef.current?.closeSlidingItems();
            refreshProducts(products.filter((e) => e._id !== product._id));
            return res;
        });

    if (products.length === 0 && !isLoading) {
        return (
            <EmptyCase
                title1={segmentMap[segment].emptyMessage.title1}
                subtitle={segmentMap[segment].emptyMessage.title2}
                icon={segmentMap[segment].icon}
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
                            expandableRightAction
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

    React.useEffect(() => {
        refresh('pending', setPendingProducts, searchText);
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
                        debounce={3000}
                        placeholder="Buscar en mi despensa"
                        showCancelButton="focus"
                        cancelButtonText="Borrar"
                    ></IonSearchbar>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {pendingProducts && (
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
                    />
                )}
            </IonContent>
        </IonPage>
    );
};

export default Pantry;
