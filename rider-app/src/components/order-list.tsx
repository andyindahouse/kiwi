import React from 'react';
import {createUseStyles} from 'react-jss';
import {IonRefresher, IonRefresherContent, IonList} from '@ionic/react';
import {RefresherEventDetail} from '@ionic/core';
import {Order} from '../models';
import OrderCard from '../components/order-card';
import {chevronDownCircleOutline} from 'ionicons/icons';
import {Typography, InfiniteScroll} from '@kiwi/ui';

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
}));

const OrderList = ({
    isLoading,
    orders,
    totalSize,
    handleScrollEvent,
    refresh,
    handleManageOrder,
    labelCta,
}: {
    isLoading: boolean;
    orders: ReadonlyArray<Order> | null;
    totalSize: number | null;
    labelCta?: string;
    handleScrollEvent: () => void;
    handleManageOrder: (order: Order) => void;
    refresh: (event: CustomEvent<RefresherEventDetail>) => void;
}) => {
    const classes = useStyles();
    const [disableInfiniteScroll, setDisableInfiniteScroll] = React.useState(false);

    React.useEffect(() => {
        if (orders && orders.length === totalSize) {
            setDisableInfiniteScroll(true);
        }
    }, [orders, totalSize]);

    if (orders && orders.length === 0 && !isLoading) {
        return (
            <>
                <Typography variant="h2" gutterBottom={16} className={classes.center}>
                    Ahora mismo no hay pedidos disponibles
                    <br />
                    En breve recibirás pedidos
                </Typography>
            </>
        );
    }

    return (
        orders && (
            <>
                <IonRefresher
                    slot="fixed"
                    onIonRefresh={(event) => {
                        setDisableInfiniteScroll(false);
                        refresh(event);
                    }}
                >
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
                            handleManageOrder={() => handleManageOrder(order)}
                            labelCta={labelCta}
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

export default OrderList;
