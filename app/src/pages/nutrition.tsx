import * as React from 'react';
import {Fragment} from '@kiwi/ionic';
import {Box} from '@kiwi/ui';
import {restaurantOutline} from 'ionicons/icons';
import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/react';

const Nutrition: React.FC = () => (
    <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonTitle>Nutrición</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent>
            <IonHeader collapse="condense">
                <IonToolbar>
                    <IonTitle size="large">Nutrición</IonTitle>
                </IonToolbar>
            </IonHeader>
            <Box>
                <Fragment icon={restaurantOutline} text="Ir a tu despensa" link="/" />
            </Box>
        </IonContent>
    </IonPage>
);

export default Nutrition;
