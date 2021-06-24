import * as React from 'react';
import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import {Typography} from '@kiwi/ui';

const Help = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Ayuda</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <Typography>Ayuda</Typography>
            </IonContent>
        </IonPage>
    );
};

export default Help;
