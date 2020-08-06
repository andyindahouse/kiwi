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
} from '@ionic/react';
import kiwiApi, {GetProductsQueryParams} from '../api';
import {Product} from '../models';
import ProductCard from '../components/product-card';
import ProductDetail from '../components/product-detail';
import Container from '../components/container';
import {useShoppingCart} from '../contexts/shopping-cart';
import {cartOutline} from 'ionicons/icons';
import Typography from '../components/typography';
import Fragment from '../components/fragment';

const useStyles = createUseStyles((theme) => ({
    container: {
        display: 'grid',
        gridGap: 8,
        gridTemplateColumns: '1fr 1fr 1fr',
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

const ShoppingHeader = ({
    searchText,
    handleSearchChange,
}: {
    searchText: string | null;
    handleSearchChange: (value: string | null) => void;
}) => (
    <>
        <IonToolbar>
            <IonSearchbar
                value={searchText}
                onIonChange={(e) => {
                    handleSearchChange(e.detail.value || null);
                }}
                debounce={1000}
                animated
                placeholder="Busca tus productos aquí"
                showCancelButton="focus"
                cancelButtonText="Borrar"
            ></IonSearchbar>
        </IonToolbar>
    </>
);

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
    const {products: contextProducts, dispatch} = useShoppingCart();

    React.useEffect(() => {
        console.log('asdf');
        kiwiApi.setCart({products: contextProducts}).then((res) => {
            if (!res) {
                throw new Error('Carrito desactualizado');
            }
        });
    }, [contextProducts]);

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
                        units={0}
                        updateShopping={(type) => {
                            console.log(type, product);
                            dispatch({
                                type,
                                product,
                            });
                        }}
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
    const [filter, setFilter] = React.useState<GetProductsQueryParams>({
        searchText: '',
        pageNumber: 0,
    });
    const [products, setProducts] = React.useState<ReadonlyArray<Product> | null>(null);
    const [isLoading, setLoading] = React.useState(false);
    const [disableInfiniteScroll, setDisableInfiniteScroll] = React.useState(false);
    const [totalSize, setTotalSize] = React.useState<number | null>(null);

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
                setProducts((products) => (products ?? []).concat(res.content));
            });
        }
    }, [filter]);

    return (
        <IonPage>
            <IonHeader translucent>
                <ShoppingHeader
                    searchText={filter.searchText}
                    handleSearchChange={(value) => {
                        if (products && products.length > 0) {
                            setProducts(null);
                        }
                        setDisableInfiniteScroll(false);
                        setFilter({
                            pageNumber: 0,
                            searchText: value,
                        });
                    }}
                />
            </IonHeader>
            <IonContent>
                <IonHeader collapse="condense">
                    <ShoppingHeader
                        searchText={filter.searchText}
                        handleSearchChange={(value) => {
                            if (products && products.length > 0) {
                                setProducts(null);
                            }
                            setDisableInfiniteScroll(false);
                            setFilter({
                                pageNumber: 0,
                                searchText: value,
                            });
                        }}
                    />
                </IonHeader>
                <Container>
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

export default Shopping;
