import React from 'react';
import {
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,

} from '@ionic/react';
import {RefresherEventDetail} from '@ionic/core';
import kiwiApi from '../api';
import {Order as OrderModel} from '../models';
import OrderList from '../components/order-list';
import {useHistory} from 'react-router';

const AllOrders: React.FC = () => {
    const history = useHistory();
    const [filter, setFilter] = React.useState<{pageNumber: number}>({
        pageNumber: 0,
    });
    const [orders, setOrders] = React.useState<ReadonlyArray<OrderModel> | null>(null);
    const [isLoading, setLoading] = React.useState(false);
    const [totalSize, setTotalSize] = React.useState<number | null>(null);
    const refresh = (event?: CustomEvent<RefresherEventDetail>) => {
        setLoading(true);
        kiwiApi.getNewOrders({pageNumber: 0}).then((res) => {
            setLoading(false);
            event && event.detail.complete();
            setTotalSize(res.totalSize);
            setOrders(res.content);
        });
    };
    const selectOrder = (order: OrderModel) => {
        kiwiApi.takeOrder(order._id).then(() => {
            history.push('/orders?segment=toStart');
        });
    };

    React.useEffect(() => {
        setLoading(true);
        kiwiApi.getNewOrders(filter).then((res) => {
            setLoading(false);
            setTotalSize(res.totalSize);
            setOrders((orders) => (orders ? orders : []).concat(res.content));
        });
    }, [filter]);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton text="Volver" defaultHref="/orders" />
                    </IonButtons>
                    <IonTitle>Nuevos pedidos</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <OrderList
                    orders={orders}
                    isLoading={isLoading}
                    totalSize={totalSize}
                    handleScrollEvent={() => {
                        setFilter({
                            ...filter,
                            pageNumber: filter.pageNumber + 1,
                        });
                    }}
                    refresh={refresh}
                    handleManageOrder={selectOrder}
                />
            </IonContent>
        </IonPage>
    );
};

export default AllOrders;
