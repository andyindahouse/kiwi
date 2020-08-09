import * as React from 'react';
import {createUseStyles} from 'react-jss';
import {documentTextOutline, trashOutline, chevronForwardOutline} from 'ionicons/icons';
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
    IonItemSliding,
    IonItem,
    IonItemOptions,
    IonItemOption,
    IonList,
    IonAlert,
    IonFooter,
} from '@ionic/react';
import {Product} from '../models';
import ProductDetail from '../components/product-detail';
import {SYNC_SHOPPING_CART, useShoppingCart} from '../contexts/shopping-cart';
import Typography from '../components/typography';
import palette from '../theme/palette';
import kiwiApi from '../api';

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
    card: {
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '40px 1fr auto',
        gridGap: 8,
        alignItems: 'center',
    },
    img: {
        width: 40,
    },
    feeZone: {
        padding: 16,
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gridGap: 8,
    },
}));

type Props = {
    product: Product;
    handleClickDetail: () => void;
    handleAddNote: () => void;
    handleRemoveProduct: (product: Product) => void;
};

const ProductItem = ({product, handleClickDetail, handleAddNote, handleRemoveProduct}: Props) => {
    const {name, units, price, img} = product;
    const classes = useStyles();
    return (
        <IonItemSliding id="item100">
            <IonItem onClick={handleClickDetail}>
                <div className={classes.card}>
                    <img className={classes.img} alt="product" src={img} />
                    <div>
                        <Typography ellipsis lineClamp={2}>
                            {name}
                        </Typography>
                        <Typography variant="subtitle2">
                            {units}ud x {price.final}€
                        </Typography>
                    </div>
                    <Typography variant="h5">{price.final}€</Typography>
                </div>
            </IonItem>

            <IonItemOptions side="end">
                <IonItemOption onClick={handleAddNote}>
                    <IonIcon slot="icon-only" icon={documentTextOutline} />
                </IonItemOption>
                <IonItemOption color="danger" onClick={() => handleRemoveProduct(product)}>
                    <IonIcon slot="icon-only" icon={trashOutline} />
                </IonItemOption>
            </IonItemOptions>
        </IonItemSliding>
    );
};

const ShoppingCart = () => {
    const classes = useStyles();
    const {products, dispatch} = useShoppingCart();
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
                                <Typography variant="h2">Añade productos desde la tab de compra</Typography>
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
                            text: 'Añadir',
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
                            updateShoppingCartProduct={() => {}}
                            closeModal={() => setSelected(null)}
                            product={selected}
                        />
                    )}
                </IonModal>
            </IonContent>
            <IonFooter>
                <IonToolbar>
                    <div className={classes.feeZone}>
                        <Typography variant="subtitle2">Carrito</Typography>
                        <Typography variant="body2">99,65€</Typography>
                        <Typography variant="subtitle2">Servicio de personal shopper</Typography>
                        <Typography variant="body2">3,95€</Typography>
                        <Typography variant="subtitle2">Envío a domicilio</Typography>
                        <Typography variant="body2">1,95€</Typography>
                        <Typography variant="subtitle2">Total</Typography>
                        <Typography variant="body2">999,65€</Typography>
                    </div>
                    <IonButton expand="full" size="large">
                        <Typography variant="h3">Realizar pedido</Typography>
                        <IonIcon className={classes.icon} slot="end" icon={chevronForwardOutline}></IonIcon>
                    </IonButton>
                </IonToolbar>
            </IonFooter>
        </IonPage>
    );
};

export default ShoppingCart;
