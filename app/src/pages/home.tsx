import React from 'react';
import {createUseStyles} from 'react-jss';
import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import Fragment from '../components/fragment';
import {rocketOutline, barcodeOutline} from 'ionicons/icons';
import FoodToExpire from '../components/food-to-expire';
import NextShopping from '../components/next-shopping';

const useStyles = createUseStyles(() => ({}));

const Home: React.FC = () => {
    const classes = useStyles();
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Inicio</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Inicio</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <Fragment
                    icon={rocketOutline}
                    color="secondary"
                    text="Ver pedido en curso"
                    link="/others/orders"
                ></Fragment>
                <Fragment
                    icon={barcodeOutline}
                    color="secondary"
                    text="Escanea un producto"
                    link="/others/orders"
                ></Fragment>
                <FoodToExpire />
                <NextShopping />
            </IonContent>
        </IonPage>
    );
};

export default Home;
