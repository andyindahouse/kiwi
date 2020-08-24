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
    IonSegment,
    IonSegmentButton,
    IonBadge,
} from '@ionic/react';
import ProductDetail from '../components/product-detail';
import Typography from '../components/typography';
import ProductItem from '../components/product-item';
import palette from '../theme/palette';
import kiwiApi from '../api';
import {useHistory, useParams} from 'react-router-dom';

import type {Order as OrderModel, Product, ProductOrderStatus} from '../models';

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

const Order = () => {
    const classes = useStyles();
    const {id = null} = useParams<{id: string}>();
    const history = useHistory();
    const [order, setOrder] = React.useState<OrderModel | null>(null);
    const [selected, setSelected] = React.useState<Product | null>(null);
    const [productWithNote, setProductWithNote] = React.useState<Product | null>(null);
    const [tab, setTab] = React.useState<ProductOrderStatus>('pending');
    const [showAlert, setShowAlert] = React.useState(false);
    const updateOrderProduct = (product: Product) => {
        kiwiApi.updateOrderProduct(product, order?._id || '').then((res) => {
            setOrder(res);
        });
    };
    const handleOrderCompleted = () => {
        kiwiApi.updateStatusOrder(order?._id || '', 'comming').then((res) => {
            history.replace(`/orders/delivery/${order?._id}`);
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
                                        handleAddNote={() => setProductWithNote(product)}
                                        handleRemoveProduct={() => {}}
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
                            updateProduct={updateOrderProduct}
                            closeModal={() => setSelected(null)}
                            product={selected}
                        />
                    )}
                </IonModal>
            </IonContent>
            {order && (
                <IonFooter>
                    <IonToolbar style={{backgroundColor: palette.background.default}}>
                        <IonButton
                            color="secondary"
                            expand="block"
                            onClick={() => {
                                setShowAlert(true);
                            }}
                        >
                            Comprado, pasar al siguiente paso
                        </IonButton>
                    </IonToolbar>
                </IonFooter>
            )}

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
                        handler: (blah) => {},
                    },
                    {
                        text: 'Aceptar',
                        handler: () => {
                            handleOrderCompleted();
                        },
                    },
                ]}
            />
        </IonPage>
    );
};

export default Order;
