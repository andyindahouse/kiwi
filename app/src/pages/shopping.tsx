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
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonProgressBar,
} from '@ionic/react';
import kiwiApi, {Product, getProductsQueryParams} from '../api';
import ProductCard from '../components/product-card';
import ProductDetail from '../components/product-detail';
import {search} from 'ionicons/icons';

const useStyles = createUseStyles((theme) => ({
    container: {
        display: 'grid',
        gridGap: 8,
        gridTemplateColumns: '1fr 1fr 1fr',
        padding: 16,
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
}));

const ShoppingContent = ({
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
        console.log('zeroooo');
        return <IonContent>No hemos encontrado productos para esa busqueda</IonContent>;
    }

    return (
        <>
            <IonContent>
                <div className={classes.container}>
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            units={0}
                            handleClickCart={() => {}}
                            handleClickDetail={() => {
                                setSelected(product);
                                setShowModal(true);
                            }}
                            {...product}
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
            </IonContent>
            <IonModal isOpen={showModal}>
                <IonHeader translucent>
                    <IonToolbar>
                        <IonTitle>Detalle</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={() => setShowModal(false)}>Cerrar</IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    {selected && <ProductDetail units={0} handleUpdateUnits={() => {}} {...selected} />}
                </IonContent>
            </IonModal>
        </>
    );
};

const Shopping: React.FC = () => {
    const classes = useStyles();
    const [filter, setFilter] = React.useState<getProductsQueryParams>({
        searchText: 'ace',
        pageNumber: 0,
    });
    const [products, setProducts] = React.useState<ReadonlyArray<Product> | null>(null);
    const [isLoading, setLoading] = React.useState(false);
    const [disableInfiniteScroll, setDisableInfiniteScroll] = React.useState(false);

    React.useEffect(() => {
        if (filter.searchText) {
            setLoading(true);
            kiwiApi.getProducts(filter).then((res) => {
                setLoading(false);
                if (products && products.length + res.content.length === res.totalSize) {
                    setDisableInfiniteScroll(true);
                } else {
                    setProducts((products ?? []).concat(res.content));
                }
            });
        }
    }, [filter]);

    return (
        <IonPage>
            <IonContent>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Shopping</IonTitle>
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
                                    searchText: e.detail.value ?? null,
                                });
                            }}
                            debounce={1000}
                            animated
                            placeholder="Busca tus productos aquí"
                            showCancelButton="focus"
                            cancelButtonText="Borrar"
                        ></IonSearchbar>
                    </IonToolbar>
                </IonHeader>

                {products ? (
                    <ShoppingContent
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
                    <h2 className={classes.center}>
                        Busca tus productos <br />
                        directamente en el buscador
                    </h2>
                )}
            </IonContent>
        </IonPage>
    );
};

export default Shopping;
