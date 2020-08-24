import React, {Fragment} from 'react';
import {createUseStyles} from 'react-jss';
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
import {RefresherEventDetail} from '@ionic/core';
import kiwiApi from '../api';
import {Order, Order as OrderModel, OrderStatus} from '../models';
import Typography from '../components/typography';
import {useHistory} from 'react-router';
import OrderCard from '../components/order-card';
import InfiniteScroll from '../components/infinite-scroll';

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

const tabMap: Record<string, ReadonlyArray<OrderStatus>> = {
    active: ['in-progress', 'comming'],
    toStart: ['pending'],
    history: ['finalized', 'cancelled'],
};

const Orders: React.FC = () => {
    const classes = useStyles();
    const history = useHistory();
    const [tab, setTab] = React.useState<'active' | 'toStart' | 'history'>('active');
    const [filter, setFilter] = React.useState<{
        pageNumber: number;
        status: ReadonlyArray<OrderStatus> | null;
    }>({
        pageNumber: 0,
        status: tabMap['active'],
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

    React.useEffect(() => {
        if (orders && orders.length === totalSize) {
            setDisableInfiniteScroll(true);
        }
    }, [orders, totalSize]);

    React.useEffect(() => {
        setLoading(true);
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
                        <IonButton href="/orders/all">Nuevos</IonButton>
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
                            setTab(value);
                            setOrders([]);
                            setFilter({
                                pageNumber: 0,
                                status: tabMap[value],
                            });
                        }}
                        value={tab}
                    >
                        <IonSegmentButton value="active">
                            <div className={classes.segmentItem}>
                                <Typography variant="caption2">Activos</Typography>
                                {tab === 'active' && <IonBadge color="primary">{totalSize}</IonBadge>}
                            </div>
                        </IonSegmentButton>
                        <IonSegmentButton value="toStart">
                            <div className={classes.segmentItem}>
                                <Typography variant="caption2">Por empezar</Typography>
                                {tab === 'toStart' && <IonBadge color="primary">{totalSize}</IonBadge>}
                            </div>
                        </IonSegmentButton>
                        <IonSegmentButton value="history">
                            <div className={classes.segmentItem}>
                                <Typography variant="caption2">Historial</Typography>
                                {tab === 'history' && <IonBadge color="primary">{totalSize}</IonBadge>}
                            </div>
                        </IonSegmentButton>
                    </IonSegment>
                </IonToolbar>

                {orders && (
                    <>
                        <IonList className={classes.container}>
                            {orders.map((order) => (
                                <Fragment key={order._id}>
                                    {tab === 'active' ? (
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
                                    ) : tab === 'toStart' ? (
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
                                </Fragment>
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
