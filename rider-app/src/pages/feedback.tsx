import * as React from 'react';
import {createUseStyles} from 'react-jss';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonFooter,
    IonButton,
    IonIcon,
} from '@ionic/react';
import {useHistory, useLocation} from 'react-router-dom';
import {palette, Typography} from '@kiwi/ui';
import {cashOutline} from 'ionicons/icons';

const useStyles = createUseStyles(() => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '64px',
    },
    icon: {
        width: 64,
        height: 64,
        color: palette.primary.dark,
    },
}));

const Feedback = () => {
    const classes = useStyles();
    const history = useHistory();
    const {search} = useLocation();
    const earns = new URLSearchParams(search).get('earns');

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>¡Entregado con éxito!</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <div className={classes.container}>
                    <IonIcon className={classes.icon} icon={cashOutline} />
                    <Typography variant="h2" gutterBottom={16}>
                        Enhorabuena
                    </Typography>
                    <Typography center>has ganado</Typography>
                    <Typography variant="h1">{earns}€</Typography>
                    <Typography>por este pedido</Typography>
                </div>
            </IonContent>
            <IonFooter>
                <IonToolbar style={{backgroundColor: palette.background.default}}>
                    <IonButton
                        color="secondary"
                        expand="block"
                        onClick={() => {
                            history.push('/orders');
                        }}
                    >
                        Volver a mis pedidos
                    </IonButton>
                </IonToolbar>
            </IonFooter>
        </IonPage>
    );
};

export default Feedback;
