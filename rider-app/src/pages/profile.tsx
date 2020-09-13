import * as React from 'react';
import {createUseStyles} from 'react-jss';
import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/react';

import palette from '../theme/palette';
import Typography from '../components/typography';

const useStyles = createUseStyles(() => ({
    container: {},
}));

const Profile = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Tu perfil</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <Typography>Perfil</Typography>
            </IonContent>
        </IonPage>
    );
};

export default Profile;
