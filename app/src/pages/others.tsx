import * as React from 'react';
import {createUseStyles} from 'react-jss';
import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import Fragment from '../components/fragment';
import Box from '../components/box';
import {restaurantOutline} from 'ionicons/icons';

const useStyles = createUseStyles(() => ({
    test: {
        color: 'red',
    },
}));

const Others: React.FC = () => {
    const classes = useStyles();

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Otros</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Otros</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <Box>
                    <Fragment icon={restaurantOutline} text="Ir a tu despensa" link="/others/pantry" />
                </Box>
            </IonContent>
        </IonPage>
    );
};

export default Others;
