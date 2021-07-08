import * as React from 'react';
import {Typography, createUseStyles, useTheme} from '@kiwi/ui';
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
    IonSegment,
    IonSegmentButton,
    IonBadge,
    IonIcon,
} from '@ionic/react';
import ProductDetail from '../components/product-detail';
import ProductItem from '../components/product-item';
import kiwiApi from '../api';
import {RouteComponentProps} from 'react-router-dom';

import type {Order as OrderModel, Product, ProductOrderStatus} from '@kiwi/models/rider';
import {chevronForwardOutline} from 'ionicons/icons';

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

const Order = ({history, match}: RouteComponentProps<{id: string}>) => {
    const classes = useStyles();
    const {palette} = useTheme();
    const id = match.params.id;
    const [order, setOrder] = React.useState<OrderModel | null>(null);
    const [selected, setSelected] = React.useState<Product | null>(null);
    const [tab, setTab] = React.useState<ProductOrderStatus>('pending');
    const [showAlert, setShowAlert] = React.useState(false);
    const updateOrderProduct = React.useCallback(
        (product: Product) => {
            kiwiApi.updateOrderProduct(product, order?._id || '').then((res) => {
                setOrder(res);
            });
        },
        [order?._id]
    );
    const handleOrderCompleted = React.useCallback(() => {
        kiwiApi.updateStatusOrder(order?._id || '', 'comming').then(() => {
            history.replace(`/orders/delivery/${order?._id}`);
        });
    }, [order?._id, history]);

    React.useEffect(() => {
        if (id) {
            kiwiApi.getOrder({id}).then((res) => {
                setOrder(res);
            });
        }
    }, [id]);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton text="Volver" defaultHref="/orders" />
                    </IonButtons>
                    <IonTitle>Pedido {order?.totalShoppingCart}€</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonToolbar>
                    <IonSegment
                        scrollable
                        onIonChange={(e) => setTab(e.detail.value as ProductOrderStatus)}
                        value={tab}
                    >
                        <IonSegmentButton value="pending">
                            <div className={classes.segmentItem}>
                                <Typography variant="caption2">Por coger</Typography>
                                <IonBadge color="primary">
                                    {order?.products.filter((e) => e.statusOrder === 'pending').length}
                                </IonBadge>
                            </div>
                        </IonSegmentButton>
                        <IonSegmentButton value="saved">
                            <div className={classes.segmentItem}>
                                <Typography variant="caption2">Carrito</Typography>
                                <IonBadge color="primary">
                                    {order?.products.filter((e) => e.statusOrder === 'saved').length}
                                </IonBadge>
                            </div>
                        </IonSegmentButton>
                        <IonSegmentButton value="not-available">
                            <div className={classes.segmentItem}>
                                <Typography variant="caption2">No disponible</Typography>
                                <IonBadge color="primary">
                                    {order?.products.filter((e) => e.statusOrder === 'not-available').length}
                                </IonBadge>
                            </div>
                        </IonSegmentButton>
                    </IonSegment>
                </IonToolbar>
                {order?.products && (
                    <IonList>
                        <div className={classes.list}>
                            {order.products
                                .filter((e) => e.statusOrder === tab)
                                .map((product) => (
                                    <ProductItem
                                        key={product.id}
                                        product={product}
                                        handleClickDetail={() => setSelected(product)}
                                    />
                                ))}
                        </div>
                    </IonList>
                )}

                <IonModal isOpen={!!selected}>
                    {selected && (
                        <ProductDetail
                            updateProduct={updateOrderProduct}
                            closeModal={() => setSelected(null)}
                            product={selected}
                            replaceProduct={order?.replaceProducts}
                        />
                    )}
                </IonModal>
                <IonAlert
                    isOpen={showAlert}
                    onDidDismiss={() => setShowAlert(false)}
                    cssClass="my-custom-class"
                    header={'Confirmar que el pedido está comprado'}
                    message={'¿Has comprado el pedido y estás listo para ir a entregarlo?'}
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
                                handleOrderCompleted();
                            },
                        },
                    ]}
                />
            </IonContent>
            {order && (
                <IonFooter>
                    <IonToolbar style={{backgroundColor: palette.background.default}}>
                        <IonButton
                            color="secondary"
                            expand="full"
                            onClick={() => {
                                setShowAlert(true);
                            }}
                        >
                            <Typography color={palette.white} variant="h3">
                                Comprado y listo para entregar
                            </Typography>
                            <IonIcon slot="end" icon={chevronForwardOutline}></IonIcon>
                        </IonButton>
                    </IonToolbar>
                </IonFooter>
            )}
        </IonPage>
    );
};

export default Order;
