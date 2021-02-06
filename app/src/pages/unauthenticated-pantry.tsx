import * as React from 'react';
import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import EmptyCase from '../components/empty-case';
import {nutritionSharp} from 'ionicons/icons';

const UnauthenticatedPantry: React.FC = () => (
    <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonTitle>Mi despensa</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent>
            <EmptyCase
                title1="Tu despensa está vacía"
                title2="Regístrate y haz un pedido con Kiwi para gestionar tus alimentos"
                icon={nutritionSharp}
                subtitle="En esta sección podrás consultar los alimentos disponibles en tu despensa además de ver las fechas de caducidad de cada uno de ellos"
            />
        </IonContent>
    </IonPage>
);

export default UnauthenticatedPantry;
