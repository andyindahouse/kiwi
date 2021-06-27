import React from 'react';
import {Typography, InfiniteScroll, createUseStyles} from '@kiwi/ui';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonSegment,
    IonSegmentButton,
    IonBadge,
    IonButtons,
    IonButton,
    IonList,
} from '@ionic/react';
import kiwiApi from '../api';
import {Order, Order as OrderModel, OrderStatus} from '../models';
import {RouteComponentProps} from 'react-router';
import OrderCard from '../components/order-card';

const useStyles = createUseStyles(() => ({
    container: {
        padding: 16,
        '& > div': {
            marginBottom: 16,
        },
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

const segmentMap: Record<string, ReadonlyArray<OrderStatus>> = {
    active: ['in-progress', 'comming'],
    toStart: ['pending'],
    history: ['finalized', 'cancelled'],
};

type Segment = 'active' | 'toStart' | 'history';

const getParam = (search: string, param: string) => {
    return new URLSearchParams(search).get(param) as Segment;
};

const Orders = ({history, location: {search}}: RouteComponentProps) => {
    const classes = useStyles();
    const [segment, setSegment] = React.useState<Segment>(getParam(search, 'tab') || 'active');
    const [filter, setFilter] = React.useState<{
        pageNumber: number;
        status: ReadonlyArray<OrderStatus> | null;
    }>({
        pageNumber: 0,
        status: segmentMap[segment],
    });
    const [orders, setOrders] = React.useState<ReadonlyArray<OrderModel> | null>(null);
    const [isLoading, setLoading] = React.useState(false);
    const [totalSize, setTotalSize] = React.useState<number | null>(null);
    const [disableInfiniteScroll, setDisableInfiniteScroll] = React.useState(false);
    const updateOrder = (order: Order) => {
        kiwiApi.updateStatusOrder(order._id, 'in-progress').then((res) => {
            console.log(res);
            history.push(`/orders/${order._id}`);
        });
    };
    const changeSegment = (newSegment: Segment) => {
        setSegment(newSegment);
        setOrders([]);
        setDisableInfiniteScroll(false);
        setFilter({
            pageNumber: 0,
            status: segmentMap[newSegment],
        });
    };

    React.useEffect(() => {
        if (orders && totalSize && orders.length === totalSize) {
            setDisableInfiniteScroll(true);
        }
    }, [orders, totalSize]);

    React.useEffect(() => {
        setLoading(true);
        console.log(filter);
        kiwiApi.getMyOrders(filter).then((res) => {
            setLoading(false);
            setTotalSize(res.totalSize);
            setOrders((orders) => (orders ? orders : []).concat(res.content));
        });
    }, [filter]);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="end">
                        <IonButton
                            onClick={() => {
                                history.push('/orders/all');
                            }}
                        >
                            Nuevos
                        </IonButton>
                    </IonButtons>
                    <IonTitle>Tus pedidos</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonToolbar>
                    <IonSegment
                        scrollable
                        onIonChange={(e) => {
                            const value = e.detail.value as 'active' | 'toStart' | 'history';
                            changeSegment(value);
                        }}
                        value={segment}
                    >
                        <IonSegmentButton value="active">
                            <div className={classes.segmentItem}>
                                <Typography variant="caption2">Activos</Typography>
                                {segment === 'active' && <IonBadge color="primary">{totalSize}</IonBadge>}
                            </div>
                        </IonSegmentButton>
                        <IonSegmentButton value="toStart">
                            <div className={classes.segmentItem}>
                                <Typography variant="caption2">Por empezar</Typography>
                                {segment === 'toStart' && <IonBadge color="primary">{totalSize}</IonBadge>}
                            </div>
                        </IonSegmentButton>
                        <IonSegmentButton value="history">
                            <div className={classes.segmentItem}>
                                <Typography variant="caption2">Historial</Typography>
                                {segment === 'history' && <IonBadge color="primary">{totalSize}</IonBadge>}
                            </div>
                        </IonSegmentButton>
                    </IonSegment>
                </IonToolbar>

                {orders && (
                    <>
                        <IonList className={classes.container}>
                            {orders.map((order) => (
                                <React.Fragment key={order._id}>
                                    {segment === 'active' ? (
                                        <OrderCard
                                            order={order}
                                            handleOpen={() => {
                                                if (order.status === 'in-progress') {
                                                    history.push(`/orders/${order._id}`);
                                                } else {
                                                    history.push(`/orders/delivery/${order._id}`);
                                                }
                                            }}
                                        />
                                    ) : segment === 'toStart' ? (
                                        <OrderCard
                                            order={order}
                                            handleManageOrder={() => updateOrder(order)}
                                            labelCta="Comenzar con este pedido"
                                        />
                                    ) : (
                                        <OrderCard
                                            order={order}
                                            handleOpen={() => {
                                                history.push(`/orders/${order._id}`);
                                            }}
                                        />
                                    )}
                                </React.Fragment>
                            ))}
                        </IonList>

                        <InfiniteScroll
                            isLoading={isLoading}
                            disabled={disableInfiniteScroll}
                            handleScrollEvent={() => {
                                setFilter({
                                    ...filter,
                                    pageNumber: filter.pageNumber + 1,
                                });
                            }}
                        />
                    </>
                )}
            </IonContent>
        </IonPage>
    );
};

export default Orders;
