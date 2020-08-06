import * as React from 'react';
import {createUseStyles} from 'react-jss';
import {restaurantOutline} from 'ionicons/icons';
import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import Fragment from '../components/fragment';
import Container from '../components/container';

const useStyles = createUseStyles(() => ({
    test: {
        color: 'red',
    },
}));

const Nutrition: React.FC = () => {
    const classes = useStyles();

    return (
        <IonPage>
            <IonHeader collapse="condense">
                <IonToolbar>
                    <IonTitle size="large">Nutrition</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <Container>
                    <Fragment icon={restaurantOutline} text="Ir a tu despensa" link="/" />
                </Container>
            </IonContent>
        </IonPage>
    );
};

export default Nutrition;
