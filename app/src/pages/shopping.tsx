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
    IonGrid,
    IonCol,
    IonRow,
    IonButtons,
    IonButton,
} from '@ionic/react';
import kiwiApi, {Product} from '../api';
import ProductCard from '../components/product-card';
import {relative} from 'path';

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
}: {
    isLoading: boolean;
    products: ReadonlyArray<Product> | null;
}) => {
    const classes = useStyles();
    const [showModal, setShowModal] = React.useState(false);
    const [selected, setSelected] = React.useState<Product | null>(null);

    if (isLoading) {
        return (
            <IonContent>
                <h2 className={classes.center}>Cargando...</h2>
            </IonContent>
        );
    }

    if (!products) {
        return (
            <IonContent>
                <h2 className={classes.center}>
                    Busca tus productos <br />
                    directamente en el buscador
                </h2>
            </IonContent>
        );
    }

    if (products.length === 0) {
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
                    <div className={classes.modal}>
                        <div className={classes.image} style={{backgroundImage: `url(${selected?.img})`}}>
                            <h3 className={classes.price}>{selected?.price.final}€</h3>
                        </div>
                        <h2>{selected?.name}</h2>
                    </div>
                </IonContent>
            </IonModal>
        </>
    );
};

const Shopping: React.FC = () => {
    const classes = useStyles();
    const [searchText, setSearchText] = React.useState('');
    const [products, setProducts] = React.useState<ReadonlyArray<Product> | null>(null);
    const [isLoading, setLoading] = React.useState(false);

    React.useEffect(() => {
        if (searchText) {
            setLoading(true);
            kiwiApi.searchProducts(searchText).then((res) => {
                setLoading(false);
                setProducts(res.content);
            });
        }
    }, [searchText]);

    return (
        <IonPage>
            <IonHeader collapse="condense">
                <IonToolbar>
                    <IonTitle size="large">Shopping</IonTitle>
                </IonToolbar>
                <IonToolbar>
                    <IonSearchbar
                        value={searchText}
                        onIonChange={(e) => setSearchText(e.detail.value!)}
                        debounce={1000}
                        animated
                        placeholder="Busca tus productos aquí"
                        showCancelButton="focus"
                        cancelButtonText="Borrar"
                    ></IonSearchbar>
                </IonToolbar>
            </IonHeader>
            <ShoppingContent products={products} isLoading={isLoading} />
        </IonPage>
    );
};

export default Shopping;
