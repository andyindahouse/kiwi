import React from 'react';
import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import Fragment from '../components/fragment';
import {rocketOutline} from 'ionicons/icons';
import FoodToExpire from '../components/food-to-expire';
import NextShopping from '../components/next-shopping';

const Home: React.FC = () => {
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
                    text="Ver pedidos en curso"
                    link="/others/orders"
                ></Fragment>
                {/* <Fragment
                    icon={barcodeOutline}
                    color="secondary"
                    text="Escanea un producto"
                    link="/others/orders"
                ></Fragment> */}
                <FoodToExpire />
                <NextShopping />
            </IonContent>
        </IonPage>
    );
};

export default Home;
