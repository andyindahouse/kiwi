import * as React from 'react';
import {createUseStyles} from 'react-jss';
import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import Typography from '../components/typography';

const useStyles = createUseStyles(() => ({
    container: {},
}));

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
