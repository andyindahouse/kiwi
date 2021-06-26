import React from 'react';
import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import {Fragment} from '@kiwi/ui';
import {rocketOutline} from 'ionicons/icons';
import FoodToExpire from '../components/food-to-expire';
import NextShopping from '../components/next-shopping';
import {useAuth} from '../contexts/auth';

const Home: React.FC = () => {
    const {user} = useAuth();

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
                {user && (
                    <Fragment
                        icon={rocketOutline}
                        color="secondary"
                        text="Ver pedidos en curso"
                        link="/others/orders"
                    ></Fragment>
                )}
                {user && <FoodToExpire />}
                <NextShopping />
            </IonContent>
        </IonPage>
    );
};

export default Home;
