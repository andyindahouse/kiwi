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
} from '@ionic/react';
import {scanSharp} from 'ionicons/icons';
import {Product, PantryProductStatus, PantryProduct} from '../models';
import Typography from '../components/typography';
import palette from '../theme/palette';
import ProductDetail from '../components/product-detail';
import kiwiApi from '../api';
import InfiniteScroll, {isLastPage} from '../components/infinite-scroll';
import {getFormatDate} from '../utils/format-date';
import {differenceInDays, isSameDay} from 'date-fns';

const useStyles = createUseStyles(() => ({
    center: {
        marginTop: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
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

const ProductList = ({
    isLoading,
    products,
    disableInfiniteScroll,
    handleScrollEvent,
    segment,
}: {
    isLoading: boolean;
    products: ReadonlyArray<PantryProduct>;
    disableInfiniteScroll: boolean;
    handleScrollEvent: () => void;
    segment: PantryProductStatus;
}) => {
    const classes = useStyles();
    const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
    const [selectedPantryProduct, setSelectedPantryProduct] = React.useState<PantryProduct | null>(null);
    const [showClassifyAlert, setShowClassifyAlert] = React.useState(false);
    const listRef = React.useRef<HTMLIonListElement | null>(null);

    const getProduct = (ean: string) => {
        kiwiApi.getProductDetail(ean).then((res) => {
            setSelectedProduct(res);
        });
    };
    const consumedProduct = (product: PantryProduct) => {
        setSelectedPantryProduct(product);
        updatePantryProduct({
            ...product,
            inStorage: 'consumed',
            consumedDate: new Date().toISOString(),
        });
    };
    const updatePantryProduct = (product: PantryProduct) =>
        kiwiApi.updatePantryProduct(product).then((res) => {
            console.log(res);
            listRef.current?.closeSlidingItems();
        });

    if (products.length === 0 && !isLoading) {
        return <div>No hemos encontrado productos para esta busqueda</div>;
    }

    return (
        <>
            <IonList ref={listRef}>
                {products.map((product) => {
                    const expiryObj = getExpiryObj(product.date);
                    return (
                        <IonItemSliding key={product._id}>
                            <IonItem
                                onClick={() => {
                                    getProduct(product.ean);
                                }}
                            >
                                <div className={classes.card}>
                                    <img alt="product-image" src={product.img} />
                                    <div>
                                        <Typography variant="body2" ellipsis lineClamp={3} gutterBottom={4}>
                                            {product.name}
                                        </Typography>
                                        <Typography variant="subtitle2" ellipsis>
                                            Comprado el {getFormatDate(product.buyedDate)}
                                        </Typography>
                                    </div>
                                    <div className={classes.date}>
                                        <Typography style={{color: expiryObj.color}}>
                                            {expiryObj.label}
                                        </Typography>
                                        <Typography variant="subtitle2">
                                            f. caducidad:
                                            <br />
                                            {new Date(product.date).toLocaleDateString()}
                                        </Typography>
                                    </div>
                                </div>
                            </IonItem>

                            {segment !== 'consumed' && segment !== 'pending' && (
                                <IonItemOptions
                                    side="end"
                                    onIonSwipe={() => {
                                        consumedProduct(product);
                                    }}
                                >
                                    <IonItemOption color="secondary" expandable>
                                        Consumido
                                    </IonItemOption>
                                </IonItemOptions>
                            )}

                            {segment !== 'consumed' && segment === 'pending' && (
                                <IonItemOptions side="end">
                                    <IonItemOption
                                        onClick={() => {
                                            setSelectedPantryProduct(product);
                                            setShowClassifyAlert(true);
                                        }}
                                    >
                                        Clasificar
                                    </IonItemOption>
                                    <IonItemOption
                                        color="secondary"
                                        onClick={() => {
                                            consumedProduct(product);
                                        }}
                                    >
                                        Consumido
                                    </IonItemOption>
                                </IonItemOptions>
                            )}
                        </IonItemSliding>
                    );
                })}
            </IonList>

            <InfiniteScroll
                isLoading={isLoading}
                disabled={disableInfiniteScroll}
                handleScrollEvent={handleScrollEvent}
            />

            <IonAlert
                isOpen={showClassifyAlert}
                onDidDismiss={() => setShowClassifyAlert(false)}
                cssClass="my-custom-class"
                header={'Radio'}
                inputs={[
                    {
                        name: 'radio1',
                        type: 'radio',
                        label: 'Por clasificar',
                        value: 'pending',
                        checked: segment === 'pending',
                    },
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
                ]}
                buttons={[
                    {
                        text: 'Cancelar',
                        role: 'cancel',
                    },
                    {
                        text: 'Aceptar',
                        handler: (value: PantryProductStatus) => {
                            if (selectedPantryProduct) {
                                updatePantryProduct({
                                    ...selectedPantryProduct,
                                    inStorage: value,
                                });
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

const Pantry: React.FC = () => {
    const classes = useStyles();
    const [filter, setFilter] = React.useState<{
        searchText: string;
        inStorage: PantryProductStatus;
        pageNumber: number;
    }>({
        searchText: '',
        inStorage: 'pending',
        pageNumber: 0,
    });
    const [products, setProducts] = React.useState<ReadonlyArray<any> | null>();
    const [disableInfiniteScroll, setDisableInfiniteScroll] = React.useState(false);
    const [isLoading, setLoading] = React.useState(false);
    const [totalSize, setTotalSize] = React.useState<number | null>(null);
    const getPantry = React.useCallback(() => {
        setLoading(true);
        kiwiApi.getPantry(filter).then((res) => {
            setLoading(false);
            setTotalSize(res.totalSize);
            setProducts((products) => (products ?? []).concat(res.content));

            if (isLastPage(res.pageNumber, res.pageSize, res.totalSize, res.content.length)) {
                setDisableInfiniteScroll(true);
            } else {
                setDisableInfiniteScroll(false);
            }
        });
    }, [filter]);

    React.useEffect(() => {
        getPantry();
    }, [getPantry]);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Tu despensa</IonTitle>
                </IonToolbar>
                <IonToolbar>
                    <IonSearchbar
                        value={filter.searchText}
                        onIonChange={(e) => {
                            if (products && products.length > 0) {
                                setProducts(null);
                            }
                            setFilter({
                                ...filter,
                                pageNumber: 0,
                                searchText: e.detail.value ?? '',
                            });
                        }}
                        debounce={1000}
                        animated
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
                            const newValue = e.detail.value as PantryProductStatus;
                            setFilter({
                                ...filter,
                                pageNumber: 0,
                                inStorage: newValue,
                            });
                            setProducts([]);
                        }}
                        value={filter.inStorage}
                    >
                        <IonSegmentButton value="pending">
                            <div className={classes.segmentItem}>
                                <Typography variant="caption2">Por clasificar</Typography>
                                {filter.inStorage === 'pending' && (
                                    <IonBadge color="primary">{totalSize}</IonBadge>
                                )}
                            </div>
                        </IonSegmentButton>
                        <IonSegmentButton value="cooled">
                            <div className={classes.segmentItem}>
                                <Typography variant="caption2">Frigo</Typography>
                                {filter.inStorage === 'cooled' && (
                                    <IonBadge color="primary">{totalSize}</IonBadge>
                                )}
                            </div>
                        </IonSegmentButton>
                        <IonSegmentButton value="frozen">
                            <div className={classes.segmentItem}>
                                <Typography variant="caption2">Congelador</Typography>
                                {filter.inStorage === 'frozen' && (
                                    <IonBadge color="primary">{totalSize}</IonBadge>
                                )}
                            </div>
                        </IonSegmentButton>
                        <IonSegmentButton value="storaged">
                            <div className={classes.segmentItem}>
                                <Typography variant="caption2">Despensa</Typography>
                                {filter.inStorage === 'storaged' && (
                                    <IonBadge color="primary">{totalSize}</IonBadge>
                                )}
                            </div>
                        </IonSegmentButton>
                        <IonSegmentButton value="consumed">
                            <div className={classes.segmentItem}>
                                <Typography variant="caption2">Consumidos</Typography>
                                {filter.inStorage === 'consumed' && (
                                    <IonBadge color="primary">{totalSize}</IonBadge>
                                )}
                            </div>
                        </IonSegmentButton>
                    </IonSegment>
                </IonToolbar>

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
                        segment={filter.inStorage}
                    />
                ) : (
                    <>
                        <Typography variant="h2" gutterBottom={16} className={classes.center}>
                            Todavia no tienes <br />
                            Productos en tu despensa
                        </Typography>
                    </>
                )}
            </IonContent>
        </IonPage>
    );
};

export default Pantry;
