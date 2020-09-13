import React from 'react';
import {createUseStyles} from 'react-jss';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonRefresher,
    IonRefresherContent,
    IonList,
} from '@ionic/react';
import {RefresherEventDetail} from '@ionic/core';
import kiwiApi from '../api';
import {Order, Order as OrderModel} from '../models';
import OrderCard from '../components/order-card';
import {chevronDownCircleOutline} from 'ionicons/icons';
import Typography from '../components/typography';
import InfiniteScroll from '../components/infinite-scroll';
import {useHistory} from 'react-router-dom';

const useStyles = createUseStyles(() => ({
    container: {
        padding: 16,
        '& > div': {
            marginBottom: 16,
        },
    },
    center: {
        marginTop: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    },
    orderList: {
        '& > div': {},
    },
}));

const OrderList = ({
    isLoading,
    orders,
    disableInfiniteScroll,
    handleScrollEvent,
    refresh,
}: {
    isLoading: boolean;
    orders: ReadonlyArray<Order> | null;
    disableInfiniteScroll: boolean;
    handleScrollEvent: () => void;
    refresh: (event: CustomEvent<RefresherEventDetail>) => void;
}) => {
    const classes = useStyles();
    const history = useHistory();
    const [selected, setSelected] = React.useState<Order | null>(null);

    if (orders && orders.length === 0 && !isLoading) {
        return (
            <>
                <Typography variant="h2" gutterBottom={16} className={classes.center}>
                    No tienes pedidos <br />
                    Cuando realices compras aquí podrás hacer seguimiento de tus pedidos
                </Typography>
            </>
        );
    }

    return (
        orders && (
            <>
                <IonRefresher slot="fixed" onIonRefresh={refresh}>
                    <IonRefresherContent
                        pullingIcon={chevronDownCircleOutline}
                        pullingText=""
                        refreshingSpinner="circles"
                        refreshingText="Cargando..."
                    ></IonRefresherContent>
                </IonRefresher>

                <IonList className={classes.container}>
                    {orders.map((order) => (
                        <OrderCard
                            key={order._id}
                            order={order}
                            selected={order._id === selected?._id}
                            handleOpen={() => {
                                if (selected && order._id === selected?._id) {
                                    setSelected(null);
                                } else {
                                    setSelected(order);
                                }
                            }}
                            handleManageOrder={() => {
                                history.push(`/others/orders/${order._id}`);
                            }}
                        />
                    ))}
                </IonList>

                <InfiniteScroll
                    isLoading={isLoading}
                    disabled={disableInfiniteScroll}
                    handleScrollEvent={handleScrollEvent}
                />
            </>
        )
    );
};

const Orders: React.FC = () => {
    const classes = useStyles();
    const [filter, setFilter] = React.useState<{pageNumber: number; pageSize: number}>({
        pageNumber: 0,
        pageSize: 5,
    });
    const [orders, setOrders] = React.useState<ReadonlyArray<OrderModel> | null>(null);
    const [isLoading, setLoading] = React.useState(false);
    const [disableInfiniteScroll, setDisableInfiniteScroll] = React.useState(false);
    const [totalSize, setTotalSize] = React.useState<number | null>(null);
    const refresh = (event: CustomEvent<RefresherEventDetail>) => {
        setLoading(true);
        kiwiApi.getOrders(filter).then((res) => {
            setLoading(false);
            event.detail.complete();
            setTotalSize(res.totalSize);
            setOrders(res.content);
        });
    };

    React.useEffect(() => {
        if (orders && orders.length === totalSize) {
            setDisableInfiniteScroll(true);
        }
    }, [orders, totalSize]);

    React.useEffect(() => {
        setLoading(true);
        kiwiApi.getOrders(filter).then((res) => {
            setLoading(false);
            setTotalSize(res.totalSize);
            setOrders((orders) => (orders ? orders : []).concat(res.content));
        });
    }, [filter]);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Pedidos</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <OrderList
                    orders={orders}
                    isLoading={isLoading}
                    handleScrollEvent={() => {
                        setFilter({
                            ...filter,
                            pageNumber: filter.pageNumber + 1,
                        });
                    }}
                    refresh={refresh}
                    disableInfiniteScroll={disableInfiniteScroll}
                />
            </IonContent>
        </IonPage>
    );
};

export default Orders;
