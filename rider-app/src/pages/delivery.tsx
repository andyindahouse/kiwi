import * as React from 'react';
import {createUseStyles} from 'react-jss';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonBackButton,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonFooter,
    IonButton,
} from '@ionic/react';
import kiwiApi from '../api';
import {useHistory, useParams} from 'react-router-dom';

import type {Order as OrderModel} from '../models';
import palette from '../theme/palette';

const useStyles = createUseStyles(() => ({}));

const Order = () => {
    const classes = useStyles();
    const history = useHistory();
    const {id = null} = useParams<{id: string}>();
    const [order, setOrder] = React.useState<OrderModel | null>(null);

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
                    <IonTitle>Entrega {order?.totalCost}€</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>Dirección de entrega</IonContent>
            <IonFooter>
                <IonToolbar style={{backgroundColor: palette.background.default}}>
                    <IonButton color="secondary" expand="block" onClick={() => {}}>
                        Entregado y pagado, finalizar pedido
                    </IonButton>
                </IonToolbar>
            </IonFooter>
        </IonPage>
    );
};

export default Order;
