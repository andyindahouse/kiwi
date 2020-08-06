import * as React from 'react';
import {createUseStyles} from 'react-jss';
import {addCircleSharp, removeCircleSharp} from 'ionicons/icons';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonBackButton,
    IonTitle,
    IonToolbar,
    IonModal,
    IonButtons,
    IonButton,
    IonIcon,
} from '@ionic/react';
import {Product} from '../models';
import ProductDetail from '../components/product-detail';
import {useShoppingCart} from '../contexts/shopping-cart';
import Typography from '../components/typography';
import Container from '../components/container';
import palette from '../theme/palette';

const useStyles = createUseStyles(() => ({
    list: {
        display: 'grid',
        gridGap: 16,
    },
    itemWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    item: {
        display: 'grid',
        gridTemplateColumns: '64px 1fr 64px',
        gridGap: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    price: {
        fontWeight: 600,
        color: palette.primary.dark,
    },
    units: {
        maxWidth: 150,
        width: '100%',
        height: 32,
        borderRadius: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    icon: {
        width: 32,
        height: 32,
        color: palette.primary.main,
    },
}));

const ShoppingCart = () => {
    const classes = useStyles();
    const {products, dispatch} = useShoppingCart();
    const [selected, setSelected] = React.useState<Product | null>(null);

    return (
        <IonPage>
            <IonContent>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonBackButton text="Volver" defaultHref="/shopping" />
                        </IonButtons>
                        <IonTitle>Tu compra</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <Container>
                    <div className={classes.list}>
                        {products.map((product) => (
                            <div key={product.id} className={classes.itemWrapper}>
                                <div
                                    className={classes.item}
                                    onClick={() => {
                                        setSelected(product);
                                    }}
                                >
                                    <img alt="img" src={product.img} />

                                    <Typography>{product.name}</Typography>
                                    <div>
                                        <Typography className={classes.price}>
                                            {product.units * Number(product.price.final)}€
                                        </Typography>
                                        <Typography variant="subtitle2">
                                            {product.units}ud x {product.price.final}€
                                        </Typography>
                                    </div>
                                </div>

                                <div className={classes.units}>
                                    <IonIcon
                                        role="button"
                                        className={classes.icon}
                                        icon={removeCircleSharp}
                                        onClick={() => {
                                            if (product.units > 0) {
                                                dispatch({
                                                    type: 'removeProduct',
                                                    product,
                                                });
                                            }
                                        }}
                                    />
                                    <Typography>{`${product.units}ud`}</Typography>
                                    <IonIcon
                                        className={classes.icon}
                                        icon={addCircleSharp}
                                        onClick={() => {
                                            dispatch({type: 'addProduct', product});
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    {products.length === 0 && (
                        <Typography variant="h2">Añade productos desde la tab de compra</Typography>
                    )}
                </Container>
                <IonModal isOpen={!!selected}>
                    <IonHeader translucent>
                        <IonToolbar>
                            <IonTitle>Detalle</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={() => setSelected(null)}>Cerrar</IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        {selected && <ProductDetail units={0} handleUpdateUnits={() => {}} {...selected} />}
                    </IonContent>
                </IonModal>
            </IonContent>
        </IonPage>
    );
};

export default ShoppingCart;
