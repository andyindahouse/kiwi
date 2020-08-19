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
} from '@ionic/react';
import {scanSharp} from 'ionicons/icons';
import {Product} from '../models';
import Typography from '../components/typography';
import palette from '../theme/palette';
import ProductDetail from '../components/product-detail';
import Fragment from '../components/fragment';

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
        display: 'grid',
        gridTemplateColumns: '80px 1fr 80px',
        gridGap: 8,
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
    const [showModal, setShowModal] = React.useState(false);
    const [selected, setSelected] = React.useState<Product | null>(null);
    const infiniteScrollRef = React.useRef<HTMLIonInfiniteScrollElement | null>(
        document.getElementById('infiniteScroll') as HTMLIonInfiniteScrollElement
    );
    // const {dispatch} = useShopping();

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
            <IonList>
                {products.map((product, index) => (
                    <IonItemSliding key={index}>
                        <IonItemOptions side="start">
                            <IonItemOption color="primary" expandable>
                                Consumido
                            </IonItemOption>
                        </IonItemOptions>

                        <IonItem
                            onClick={() => {
                                setSelected(product);
                            }}
                        >
                            <div className={classes.card}>
                                <img
                                    alt="product"
                                    src="https://cdn.grupoelcorteingles.es/SGFM/dctm/MEDIA03/201604/07/00118480200130____1__325x325.jpg"
                                />
                                <div>
                                    <Typography variant="body2" ellipsis lineClamp={3}>
                                        LA FINCA Vacuno Joven Dos Primaveras carne picada peso aproximado
                                        bandeja 600g
                                    </Typography>
                                    <Typography variant="subtitle2">2 unidades</Typography>
                                </div>
                                <div className={classes.date}>
                                    <Typography variant="h3">1 día</Typography>
                                    <Typography variant="subtitle2">29/07/2020</Typography>
                                </div>
                            </div>
                        </IonItem>

                        <IonItemOptions side="end">
                            <IonItemOption color="secondary" expandable>
                                Abierto
                            </IonItemOption>
                        </IonItemOptions>
                    </IonItemSliding>
                ))}
            </IonList>
            <IonModal isOpen={!!selected}>
                {selected && <ProductDetail closeModal={() => setSelected(null)} product={selected} />}
            </IonModal>
        </>
    );
};

const Pantry: React.FC = () => {
    const classes = useStyles();
    const [filter, setFilter] = React.useState({
        searchText: '',
        pageNumber: 0,
    });
    const [products, setProducts] = React.useState<ReadonlyArray<any> | null>([
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
    ]);
    const [disableInfiniteScroll, setDisableInfiniteScroll] = React.useState(false);
    const [isLoading, setLoading] = React.useState(false);

    React.useEffect(() => {
        if (filter.searchText) {
            // setLoading(true);
            // kiwiApi.getProducts(filter).then((res) => {
            //     setLoading(false);
            //     setTotalSize(res.totalSize);
            //     setProducts((products) => (products ?? []).concat(res.content));
            // });
        }
    }, [filter]);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Tu despensa</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Tu despensa</IonTitle>
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
                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton>
                        <IonIcon icon={scanSharp} />
                    </IonFabButton>
                </IonFab>
                <IonToolbar>
                    <IonSegment
                        scrollable
                        onIonChange={(e) => console.log('Segment selected', e.detail.value)}
                        value="all"
                    >
                        <IonSegmentButton value="all">
                            <div className={classes.segmentItem}>
                                <Typography variant="caption2">Todo</Typography>
                                <IonBadge color="primary">11</IonBadge>
                            </div>
                        </IonSegmentButton>
                        <IonSegmentButton value="fridge">
                            <div className={classes.segmentItem}>
                                <Typography variant="caption2">Frigo</Typography>
                                <IonBadge color="primary">6</IonBadge>
                            </div>
                        </IonSegmentButton>
                        <IonSegmentButton value="freezer">
                            <div className={classes.segmentItem}>
                                <Typography variant="caption2">Congelador</Typography>
                                <IonBadge color="primary">23</IonBadge>
                            </div>
                        </IonSegmentButton>
                        <IonSegmentButton value="pantry">
                            <div className={classes.segmentItem}>
                                <Typography variant="caption2">Despensa</Typography>
                                <IonBadge color="primary">111</IonBadge>
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
                    />
                ) : (
                    <>
                        <Fragment
                            margin
                            icon={scanSharp}
                            text="Añade productos a tu despensa"
                            link="/shopping/cart"
                        />
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
