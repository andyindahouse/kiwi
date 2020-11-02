import React from 'react';
import kiwiApi from '../api';
import {createUseStyles} from 'react-jss';
import {
    IonButton,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonModal,
    IonPage,
    IonTitle,
    IonToolbar,
} from '@ionic/react';
import Register from './register';
import Box from '../components/box';
import Typography from '../components/typography';

const useStyles = createUseStyles(() => ({
    container: {
        width: '100%',
    },
    form: {
        marginBottom: 32,
    },
    cta: {
        display: 'flex',
        flexDirection: 'column',
    },
    image: {
        height: 100,
        border: '1px solid #000000',
        marginBottom: 16,
    },
    registerLink: {
        margin: 32,
        alignSelf: 'center',
    },
}));

const Login: React.FC = () => {
    const classes = useStyles();
    const [showRegister, setShowRegister] = React.useState(false);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Inicio</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <Box padding={16} cssClass={classes.container}>
                    <Typography gutterBottom={32} variant="h2">
                        Bienvenido a Kiwi,
                    </Typography>
                    <div className={classes.image}>image</div>
                    <IonList className={classes.form} lines="full">
                        <IonItem>
                            <IonLabel position="floating">Email</IonLabel>
                            <IonInput />
                        </IonItem>
                        <IonItem>
                            <IonLabel position="floating">Password</IonLabel>
                            <IonInput />
                        </IonItem>
                    </IonList>
                    <div className={classes.cta}>
                        <IonButton onClick={() => {}}>Entrar a Kiwi</IonButton>
                        <a className={classes.registerLink} onClick={() => setShowRegister(true)}>
                            Registrame
                        </a>
                    </div>
                </Box>
                <IonModal isOpen={showRegister}>
                    <Register closeModal={() => setShowRegister(false)} />
                </IonModal>
            </IonContent>
        </IonPage>
    );
};

export default Login;
