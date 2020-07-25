import React from 'react';
import {createUseStyles} from 'react-jss';
import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/react';

const useStyles = createUseStyles((theme) => ({
    test: {
        color: 'red',
    },
}));

const Home: React.FC = () => {
    const classes = useStyles();
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Home</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large" className={classes.test}>
                            Home
                        </IonTitle>
                    </IonToolbar>
                </IonHeader>
            </IonContent>
        </IonPage>
    );
};

export default Home;
