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
    IonList,
    IonAlert,
    IonFooter,
} from '@ionic/react';
import ProductDetail from '../components/product-detail';
import {Typography, palette, Box} from '@kiwi/ui';
import ProductItem from '../components/product-item';
import kiwiApi from '../api';
import {RouteComponentProps} from 'react-router-dom';
import {statusOrderMap} from '../utils';

import type {Order as OrderModel, OrderStatus, Product} from '../models';
import PaymentFooter from '../components/payment-fields';

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

const Order: React.FC<RouteComponentProps<{id: string}>> = ({match}) => {
    const classes = useStyles();
    const id = match.params.id;
    const [order, setOrder] = React.useState<OrderModel | null>(null);
    const [selected, setSelected] = React.useState<Product | null>(null);
    const [productWithNote, setProductWithNote] = React.useState<Product | null>(null);
    const [showAlert, setShowAlert] = React.useState(false);
    const [showChart, setShowChart] = React.useState(false);
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
                                const {name, price, img, brand} = product;
                                const getUnits = (product: Product) => product.units ?? product.items?.length;
                                return (
                                    <ProductItem
                                        key={product.id}
                                        img={img}
                                        title={name.replace(brand, '').trim()}
                                        subtitle={`${getUnits(product)} ud x ${price.final}€ / ud`}
                                        handleClickDetail={() => setSelected(product)}
                                        disableSwipeOptions
                                        showAlertIcon={!product.available}
                                    >
                                        <div>
                                            <Typography color={palette.secondary.main} variant="caption1">
                                                {(getUnits(product) * Number(price.final)).toFixed(2)}€
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
                            updateProduct={handleUpdateOrderProduct}
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
                            handler: (blah) => {},
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
