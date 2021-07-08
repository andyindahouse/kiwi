import * as React from 'react';
import {Typography, createUseStyles, Box, useTheme} from '@kiwi/ui';
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
    IonList,
    IonAlert,
    IonFooter,
} from '@ionic/react';
import ProductDetail from '../components/product-detail';
import ProductItem from '../components/product-item';
import kiwiApi from '../api';
import {RouteComponentProps} from 'react-router-dom';
import {useStatusOrderMap} from '../utils';
import {getCostSubtitle} from '@kiwi/utils';

import type {Order as OrderModel, OrderStatus, Product} from '@kiwi/models';
import PaymentFooter from '../components/payment-fields';

const useStyles = createUseStyles(({palette}) => ({
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
        return 'Podrás cancelar tu pedido mientras tu personal shopper no haya empezado a realizar tu compra (normalmente dos horas antes de la hora de entrega)';
    }

    if (status === 'cancelled') {
        return 'Has cancelado este pedido';
    }

    if (status === 'in-progress') {
        return 'Tu personal shopper está realizando el pedido, en breve recibirás tu compra';
    }

    if (status === 'comming') {
        return 'Tu pedido está en camino';
    }

    if (status === 'finalized') {
        return 'Tu pedido está completado, todos tus productos han sido movidos a tu despensa';
    }
};

const Order = ({match}: RouteComponentProps<{id: string}>) => {
    const classes = useStyles();
    const {palette} = useTheme();
    const statusOrderMap = useStatusOrderMap();
    const id = match.params.id;
    const [order, setOrder] = React.useState<OrderModel | null>(null);
    const [selected, setSelected] = React.useState<Product | null>(null);
    const [showAlert, setShowAlert] = React.useState(false);
    const [showChart, setShowChart] = React.useState(false);
    const handleCancelledOrder = React.useCallback(() => {
        kiwiApi.updateStatusOrder(order?._id || '').then((res) => {
            setOrder(res);
        });
    }, [order?._id]);

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
                            {order.products.map((product) => {
                                const {name, img, brand} = product;
                                console.log(product.units);
                                return (
                                    <ProductItem
                                        key={product.id}
                                        img={img}
                                        title={name.replace(brand, '').trim()}
                                        subtitle={getCostSubtitle(product)}
                                        handleClickDetail={() => setSelected(product)}
                                        disableSwipeOptions
                                        showAlertIcon={!product.available}
                                    >
                                        <div>
                                            <Typography color={palette.secondary.main} variant="caption1">
                                                {product.cost}
                                            </Typography>
                                        </div>
                                    </ProductItem>
                                );
                            })}
                        </div>
                        {order.products.length === 0 && (
                            <>
                                <Typography variant="h3">Añade productos desde la tab de compra</Typography>
                            </>
                        )}
                    </IonList>
                )}
                <IonModal
                    isOpen={!!selected}
                    onDidPresent={() => setShowChart(true)}
                    onDidDismiss={() => {
                        setSelected(null);
                        setShowChart(false);
                    }}
                    backdropDismiss
                >
                    {selected && (
                        <ProductDetail
                            disabled
                            closeModal={() => setSelected(null)}
                            product={selected}
                            showChart={showChart}
                        />
                    )}
                </IonModal>
                <IonAlert
                    isOpen={showAlert}
                    onDidDismiss={() => setShowAlert(false)}
                    cssClass="my-custom-class"
                    header={'¿Estás seguro que deseas cancelar tu pedido?'}
                    buttons={[
                        {
                            text: 'Cancelar',
                            role: 'cancel',
                            cssClass: 'secondary',
                            handler: () => undefined,
                        },
                        {
                            text: 'Aceptar',
                            handler: () => {
                                handleCancelledOrder();
                            },
                        },
                    ]}
                />
            </IonContent>
            {order && (
                <IonFooter>
                    <IonToolbar style={{backgroundColor: palette.background.default}}>
                        <Box>
                            <Typography variant="subtitle2" gutterBottom={4}>
                                Estado de tu pedido
                            </Typography>
                            <Typography
                                style={{color: statusOrderMap[order.status].color}}
                                variant="caption1"
                                gutterBottom={4}
                            >
                                {statusOrderMap[order.status].label}
                            </Typography>
                            <Typography variant="subtitle2">{getMesaggeStatus(order.status)}</Typography>
                        </Box>
                        <PaymentFooter
                            totalShoppingCart={order.totalShoppingCart}
                            deliveryDiscount={order.deliveryDiscount}
                            deliverFee={order.deliverFee}
                            finalDeliverFee={order.finalDeliverFee}
                            shopperFee={order.shopperFee}
                            finalShopperFee={order.finalShopperFee}
                            totalCost={order.totalCost}
                        />
                        <IonButton
                            color="danger"
                            expand="block"
                            onClick={handleCancelledOrder}
                            disabled={order.status !== 'pending'}
                        >
                            Cancelar pedido
                        </IonButton>
                    </IonToolbar>
                </IonFooter>
            )}
        </IonPage>
    );
};

export default Order;
