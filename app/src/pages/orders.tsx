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
    IonButtons,
    IonBackButton,
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
    orders: ReadonlyArray<Order>;
    disableInfiniteScroll: boolean;
    handleScrollEvent: () => void;
    refresh: (event: CustomEvent<RefresherEventDetail>) => void;
}) => {
    const classes = useStyles();
    const history = useHistory();
    const [selected, setSelected] = React.useState<Order | null>(null);

    if (orders.length === 0 && !isLoading) {
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
    );
};

const Orders: React.FC = () => {
    const [orders, setOrders] = React.useState<{
        isLoading: boolean;
        pageNumber: number;
        totalSize: number;
        data: ReadonlyArray<OrderModel>;
    }>({
        isLoading: false,
        pageNumber: 0,
        totalSize: 0,
        data: [],
    });
    const [disableInfiniteScroll, setDisableInfiniteScroll] = React.useState(false);
    const refresh = (event: CustomEvent<RefresherEventDetail>) => {
        setOrders({
            ...orders,
            isLoading: true,
        });
        kiwiApi.getOrders({pageNumber: 0}).then((res) => {
            event.detail.complete();
            setOrders({
                pageNumber: 0,
                isLoading: false,
                totalSize: res.totalSize,
                data: res.content,
            });
        });
    };

    React.useEffect(() => {
        if (orders.data.length === orders.totalSize) {
            setDisableInfiniteScroll(true);
        } else {
            setDisableInfiniteScroll(false);
        }
    }, [orders.data.length, orders.totalSize]);

    React.useEffect(() => {
        setOrders({
            ...orders,
            isLoading: true,
        });
        kiwiApi.getOrders({pageNumber: orders.pageNumber}).then((res) => {
            setOrders((orders) => ({
                pageNumber: orders.pageNumber,
                isLoading: false,
                totalSize: res.totalSize,
                data: orders.data.concat(res.content),
            }));
        });
    }, [orders.pageNumber]);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton text="Volver" defaultHref="/others" />
                    </IonButtons>
                    <IonTitle>Pedidos</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <OrderList
                    orders={orders.data}
                    isLoading={orders.isLoading}
                    handleScrollEvent={() => {
                        setOrders({
                            ...orders,
                            pageNumber: orders.pageNumber + 1,
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
