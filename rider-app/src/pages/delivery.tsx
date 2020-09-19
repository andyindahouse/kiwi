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
    IonList,
    IonItem,
    IonItemDivider,
    IonIcon,
    IonAlert,
} from '@ionic/react';
import kiwiApi from '../api';
import {useHistory, useParams} from 'react-router-dom';

import type {Order as OrderModel} from '../models';
import palette from '../theme/palette';
import Typography from '../components/typography';
import {getFormatDate} from '../utils/format-date';
import {chevronForwardOutline} from 'ionicons/icons';

const useStyles = createUseStyles(() => ({
    container: {
        paddingTop: 16,
    },
    footer: {
        padding: 16,
    },
}));

const Delivery = () => {
    const classes = useStyles();
    const history = useHistory();
    const {id = null} = useParams<{id: string}>();
    const [order, setOrder] = React.useState<OrderModel | null>(null);
    const [showAlert, setShowAlert] = React.useState(false);
    const handleFinalized = () => {
        if (id) {
            kiwiApi.finalizeOrder(id).then((res) => {
                if (order) {
                    history.replace(`/feedback?earns=${order.deliverFee + order.shopperFee}`);
                }
            });
        }
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
                    <IonTitle>Información de entrega</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList lines="full">
                    <IonItem>
                        <div className={classes.container}>
                            <Typography variant="subtitle1">Dirección de entrega:</Typography>
                            <Typography gutterBottom={16}>{order?.deliveryAddress}</Typography>
                            <Typography variant="subtitle1">Día de entrega:</Typography>
                            <Typography gutterBottom={16}>
                                {order?.deliveryDate && getFormatDate(order.deliveryDate)}
                            </Typography>
                            <Typography variant="subtitle1">Hora de entrega:</Typography>
                            <Typography gutterBottom={16}>
                                {order?.deliveryHour && getFormatDate(order.deliveryHour)}
                            </Typography>
                        </div>
                    </IonItem>
                    <IonItemDivider />
                    <IonItem>
                        <div className={classes.container}>
                            <Typography variant="subtitle1">Nombre de cliente:</Typography>
                            <Typography gutterBottom={16}>
                                Fulanito DiSousa Fulanito DiSousa Fulanito DiSousa
                            </Typography>

                            <Typography variant="subtitle1">Número de teléfono:</Typography>
                            <Typography>666 666 666</Typography>
                            <Typography gutterBottom={16} variant="subtitle2">
                                Llamar solamente en caso de no encontrar al cliente
                            </Typography>
                        </div>
                    </IonItem>
                    <IonItemDivider />

                    <IonItem>
                        <div className={classes.container}>
                            <Typography variant="subtitle2" gutterBottom={8}>
                                Si tienes problemas con la entrega o el pago llama al:
                            </Typography>
                            <Typography gutterBottom={16} variant="subtitle1">
                                605 949 209
                            </Typography>
                        </div>
                    </IonItem>
                    <IonItemDivider />

                    <IonItemDivider />
                </IonList>
                <IonAlert
                    isOpen={showAlert}
                    onDidDismiss={() => setShowAlert(false)}
                    cssClass="my-custom-class"
                    header={'Finalizar el pedido'}
                    message={'¿Has entregado el pedido y recibido el pago?'}
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
                                handleFinalized();
                            },
                        },
                    ]}
                />
            </IonContent>
            <IonFooter>
                <div className={classes.footer}>
                    <Typography variant="subtitle1" gutterBottom={16}>
                        Cobrar vía
                    </Typography>
                    <Typography gutterBottom={16}>Bizum</Typography>
                    <Typography variant="caption">Total a Pagar: {order?.totalCost} €</Typography>
                </div>
                <IonToolbar style={{backgroundColor: palette.background.default}}>
                    <IonButton
                        color="secondary"
                        expand="full"
                        onClick={() => {
                            setShowAlert(true);
                        }}
                    >
                        <Typography color={palette.white} variant="h3">
                            Finalizar pedido
                        </Typography>
                        <IonIcon slot="end" icon={chevronForwardOutline}></IonIcon>
                    </IonButton>
                </IonToolbar>
            </IonFooter>
        </IonPage>
    );
};

export default Delivery;
