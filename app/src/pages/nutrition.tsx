import * as React from 'react';
import {createUseStyles} from 'react-jss';
import {restaurantOutline} from 'ionicons/icons';
import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import Fragment from '../components/fragment';
import {Box} from '@kiwi/ui';

const useStyles = createUseStyles(() => ({
    test: {
        color: 'red',
    },
}));

const Nutrition: React.FC = () => {
    const classes = useStyles();

    return (
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
};

export default Nutrition;
