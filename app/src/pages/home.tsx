import React from 'react';
import {createUseStyles} from 'react-jss';
import {IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import Fragment from '../components/fragment';
import {rocketOutline, warningOutline} from 'ionicons/icons';
import Container from '../components/container';
import Typography from '../components/typography';
import FoodToExpire from '../components/food-to-expire';

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
                <Container>
                    <Fragment
                        icon={rocketOutline}
                        color="secondary"
                        text="Ver pedido en curso"
                        link="/others/orders"
                    ></Fragment>
                    <FoodToExpire />
                </Container>
            </IonContent>
        </IonPage>
    );
};

export default Home;
