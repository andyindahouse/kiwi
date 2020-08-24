import * as React from 'react';
import {createUseStyles} from 'react-jss';
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
import ProductDetail from '../components/product-detail';
import Typography from '../components/typography';
import ProductItem from '../components/product-item';
import palette from '../theme/palette';
import kiwiApi from '../api';
import {useHistory, useParams} from 'react-router-dom';
import {statusOrderMap} from '../utils';

import type {Order as OrderModel, OrderStatus, Product} from '../models';

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

const getMesaggeStatus = (status: OrderStatus) => {
    if (status === 'pending') {
        return 'Podrás modificar tu pedido mientras tu personal shopper no haya empezado a realizar tu compra';
    }

    if (status === 'cancelled') {
        return 'Has cancelado este pedido';
    }

    if (status === 'in-progress') {
        return 'Tu personal shopper está realizando el pedido, en breves recibiras tu compra';
    }

    if (status === 'comming') {
        return 'Tu pedido está en camino';
    }

    if (status === 'finalized') {
        return 'Tu pedido está completado, todos tus productos han sido movidos a tu despensa';
    }
};

const Order = () => {
    const classes = useStyles();
    const {id = null} = useParams<{id: string}>();
    const [order, setOrder] = React.useState<OrderModel | null>(null);
    const [selected, setSelected] = React.useState<Product | null>(null);
    const [productWithNote, setProductWithNote] = React.useState<Product | null>(null);
    const updateOrderProduct = (product: Product) => {
        kiwiApi.updateOrderProduct(product, order?._id || '').then((res) => {
            setOrder(res);
        });
    };
    const handleCancelledOrder = () => {
        kiwiApi.updateStatusOrder(order?._id || '').then((res) => {
            setOrder(res);
        });
    };
    const handleUpdateOrderProduct = (product: Product) => {
        let updatedProduct;
        if (product.units < (product.items?.length || 0)) {
            updatedProduct = {
                ...product,
                items: product.items?.slice(0, product.units),
            };
        } else {
            updatedProduct = {
                ...product,
                items: new Array(product.units).fill({date: null}),
            };
        }

        updateOrderProduct(updatedProduct);
    };
    const handleRemoveOrderProduct = (product: Product) => {
        kiwiApi.deleteOrderProduct(product, order?._id || '').then((res) => {
            setOrder(res);
        });
    };

    React.useEffect(() => {
        if (id) {
            kiwiApi.getOrder({id}).then((res) => {
                setOrder(res);
            });
        }
    }, [id]);

    return (
        <IonPage>
            <IonContent>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonBackButton text="Volver" defaultHref="/others/orders" />
                        </IonButtons>
                        <IonTitle>Tu pedido</IonTitle>
                    </IonToolbar>
                </IonHeader>
                {order?.products && (
                    <IonList>
                        <div className={classes.list}>
                            {order.products.map((product) => (
                                <ProductItem
                                    key={product.id}
                                    product={product}
                                    handleClickDetail={() => setSelected(product)}
                                    handleAddNote={() => setProductWithNote(product)}
                                    handleRemoveProduct={handleRemoveOrderProduct}
                                    disabled={order.status !== 'pending'}
                                />
                            ))}
                        </div>
                        {order.products.length === 0 && (
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
                            text: productWithNote ? 'Modificar' : 'Añadir',
                            handler: ({note}: {note: string}) => {
                                if (productWithNote && note) {
                                    updateOrderProduct({
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
                            disabled={order?.status !== 'pending'}
                            updateProduct={handleUpdateOrderProduct}
                            closeModal={() => setSelected(null)}
                            product={selected}
                        />
                    )}
                </IonModal>
            </IonContent>
            {order && (
                <IonFooter>
                    <IonToolbar style={{backgroundColor: palette.background.default}}>
                        <div className={classes.feeZone}>
                            <Typography variant="subtitle2">Estado de tu pedido</Typography>
                            <Typography style={{color: statusOrderMap[order.status].color}} variant="body2">
                                {statusOrderMap[order.status].label}
                            </Typography>
                            <Typography variant="subtitle2">Carrito</Typography>
                            <Typography variant="body2">{order.totalShoppingCart}€</Typography>
                            <Typography variant="subtitle2">Personal shopper</Typography>
                            <Typography variant="body2">{order.shopperFee}€</Typography>
                            <Typography variant="subtitle2">Envío a domicilio</Typography>
                            <Typography variant="body2">{order.deliverFee}€</Typography>
                            <Typography variant="subtitle2">Total</Typography>
                            <Typography variant="body2">{order.totalCost}€</Typography>
                        </div>
                        <IonButton
                            color="danger"
                            expand="block"
                            size="small"
                            onClick={handleCancelledOrder}
                            disabled={order.status !== 'pending'}
                        >
                            <Typography>Cancelar pedido</Typography>
                        </IonButton>
                        <Typography variant="subtitle2" center>
                            {getMesaggeStatus(order.status)}
                        </Typography>
                    </IonToolbar>
                </IonFooter>
            )}
        </IonPage>
    );
};

export default Order;
