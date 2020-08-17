import * as React from 'react';
import {createUseStyles} from 'react-jss';
import {chevronForwardOutline} from 'ionicons/icons';
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
    IonList,
    IonAlert,
    IonFooter,
} from '@ionic/react';
import {Product} from '../models';
import ProductDetail from '../components/product-detail';
import {SYNC_SHOPPING_CART, UPDATE_SHOPPING_CART_PRODUCT, useShoppingCart} from '../contexts/shopping-cart';
import Typography from '../components/typography';
import ProductItem from '../components/product-item';
import palette from '../theme/palette';
import kiwiApi from '../api';
import {useHistory} from 'react-router-dom';

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
        color: palette.black,
    },
    feeZone: {
        padding: 16,
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gridGap: 8,
    },
}));

const ShoppingCart = () => {
    const classes = useStyles();
    const history = useHistory();
    const {products, totalCost, totalShoppingCart, deliverFee, shopperFee, dispatch} = useShoppingCart();
    const [selected, setSelected] = React.useState<Product | null>(null);
    const [productWithNote, setProductWithNote] = React.useState<Product | null>(null);
    const handleRemoveProduct = (product: Product) => {
        const productIndex = products.findIndex((e) => e.id === product.id);
        kiwiApi
            .setShoppingCart({
                products: products.slice(0, productIndex).concat(products.slice(productIndex + 1)),
            })
            .then((res) => {
                if (!res) {
                    throw new Error('Carrito desactualizado');
                }
                console.log(res);
                dispatch({
                    type: SYNC_SHOPPING_CART,
                    shoppingCart: res,
                });
            });
    };
    const handleAddNote = (product: Product) => {
        const productIndex = products.findIndex((e) => e.id === product.id);
        kiwiApi
            .setShoppingCart({
                products: products.slice(0, productIndex).concat([product], products.slice(productIndex + 1)),
            })
            .then((res) => {
                if (!res) {
                    throw new Error('Carrito desactualizado');
                }
                console.log(res);
                dispatch({
                    type: SYNC_SHOPPING_CART,
                    shoppingCart: res,
                });
            });
    };
    const handleCheckout = () => {
        kiwiApi.checkout().then((res) => {
            history.push('/others/orders');
            dispatch({
                type: SYNC_SHOPPING_CART,
                shoppingCart: {
                    products: [],
                    deliverFee: 0,
                    shopperFee: 0,
                    totalShoppingCart: 0,
                    totalCost: 0,
                },
            });
        });
    };

    React.useEffect(() => {
        kiwiApi.getShoppingCart().then((res) => {
            console.log(res);
            dispatch({
                type: SYNC_SHOPPING_CART,
                shoppingCart: res,
            });
        });
    }, []);

    return (
        <IonPage>
            <IonContent>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonBackButton text="Volver" defaultHref="/search" />
                        </IonButtons>
                        <IonTitle>Tu carrito</IonTitle>
                    </IonToolbar>
                </IonHeader>
                {products && (
                    <IonList>
                        <div className={classes.list}>
                            {products.map((product) => (
                                <ProductItem
                                    key={product.id}
                                    product={product}
                                    handleClickDetail={() => setSelected(product)}
                                    handleAddNote={() => setProductWithNote(product)}
                                    handleRemoveProduct={handleRemoveProduct}
                                />
                            ))}
                        </div>
                        {products.length === 0 && (
                            <>
                                <Typography center variant="h3">
                                    Añade productos desde la tab de compra
                                </Typography>
                            </>
                        )}
                    </IonList>
                )}

                <IonAlert
                    isOpen={!!productWithNote}
                    onDidDismiss={() => {
                        setProductWithNote(null);
                    }}
                    header="Nota de producto"
                    subHeader="Usa esta nota para añadir cualquier información adicional que quieras indicarle al Shopper"
                    inputs={[
                        {
                            name: 'note',
                            type: 'text',
                            label: 'Nota de producto',
                            value: productWithNote?.note,
                            placeholder: 'Ej: Coger el menos maduro posible',
                        },
                    ]}
                    buttons={[
                        {
                            text: 'Cancelar',
                            role: 'cancel',
                            cssClass: 'secondary',
                        },
                        {
                            text: productWithNote?.note ? 'Modificar' : 'Añadir',
                            handler: ({note}: {note: string}) => {
                                if (productWithNote && note) {
                                    handleAddNote({
                                        ...productWithNote,
                                        note,
                                    });
                                }
                            },
                        },
                    ]}
                />
                <IonModal isOpen={!!selected}>
                    {selected && (
                        <ProductDetail
                            updateProduct={(product) => {
                                dispatch({
                                    type: UPDATE_SHOPPING_CART_PRODUCT,
                                    product,
                                });
                            }}
                            closeModal={() => setSelected(null)}
                            product={selected}
                        />
                    )}
                </IonModal>
            </IonContent>
            {products && products.length > 0 && (
                <IonFooter>
                    <IonToolbar>
                        <div className={classes.feeZone}>
                            <Typography variant="subtitle2">Carrito</Typography>
                            <Typography variant="body2">{totalShoppingCart}</Typography>
                            <Typography variant="subtitle2">Personal shopper</Typography>
                            <Typography variant="body2">{shopperFee}€</Typography>
                            <Typography variant="subtitle2">Envío a domicilio</Typography>
                            <Typography variant="body2">{deliverFee}€</Typography>
                            <Typography variant="subtitle2">Total</Typography>
                            <Typography variant="body2">{totalCost}€</Typography>
                        </div>
                        <IonButton expand="full" size="large" onClick={handleCheckout}>
                            <Typography variant="h3">Realizar pedido</Typography>
                            <IonIcon
                                className={classes.icon}
                                slot="end"
                                icon={chevronForwardOutline}
                            ></IonIcon>
                        </IonButton>
                    </IonToolbar>
                </IonFooter>
            )}
        </IonPage>
    );
};

export default ShoppingCart;
