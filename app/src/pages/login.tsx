import React from 'react';
import {Typography, createUseStyles, Box, useTheme} from '@kiwi/ui';
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
    IonSpinner,
    IonTitle,
    IonToolbar,
} from '@ionic/react';
import Register from './register';
import {useAuth} from '../contexts/auth';
import {useForm, Controller} from 'react-hook-form';
import KiwiLogo from '../components/logo';

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
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 16,
    },
    registerLink: {
        padding: 32,
        alignSelf: 'center',
    },
}));

const Login: React.FC = () => {
    const classes = useStyles();
    const {palette} = useTheme();
    const {login} = useAuth();
    const [showRegister, setShowRegister] = React.useState(false);
    const [loginError, setLoginError] = React.useState(false);
    const [isLoading, setLoading] = React.useState(false);
    const [showRegisterMessage, setShowRegisterMessage] = React.useState(false);
    const {
        handleSubmit,
        formState: {errors},
        control,
    } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
    });
    const onSubmit = React.useCallback(
        (data: {email: string; password: string}) => {
            setLoading(true);
            setLoginError(false);
            setShowRegisterMessage(false);
            login(data)
                .catch(() => {
                    setLoginError(true);
                })
                .finally(() => setLoading(false));
        },
        [login]
    );
    const handleCloseModal = React.useCallback((registerSuccess) => {
        if (registerSuccess) {
            setShowRegisterMessage(true);
        }
        setShowRegister(false);
    }, []);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Inicio</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box padding={16} cssClass={classes.container}>
                        <Typography gutterBottom={8} center variant="h2">
                            Bienvenido a Kiwi
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom={16} center>
                            Tu aplicación para automatizar tu compra online, evitar tirar comida y tener
                            siempre el frigo lleno
                        </Typography>
                        <div className={classes.image}>
                            <KiwiLogo />
                        </div>
                        <IonList className={classes.form} lines="full">
                            <IonItem>
                                <IonLabel position="floating">Email</IonLabel>
                                <Controller
                                    control={control}
                                    name="email"
                                    rules={{
                                        required: true,
                                    }}
                                    render={({field}) => (
                                        <IonInput {...field} onIonChange={field.onChange} type="email" />
                                    )}
                                />
                                {errors.email?.type === 'required' && (
                                    <Typography color={palette.error.main} variant="caption2">
                                        Tu correo es obligatorio
                                    </Typography>
                                )}
                            </IonItem>
                            <IonItem>
                                <IonLabel position="floating">Password</IonLabel>
                                <Controller
                                    control={control}
                                    name="password"
                                    rules={{
                                        required: true,
                                    }}
                                    render={({field}) => (
                                        <IonInput {...field} onIonChange={field.onChange} type="password" />
                                    )}
                                />
                                {errors.password?.type === 'required' && (
                                    <Typography color={palette.error.main} variant="caption2">
                                        Tu contraseña es obligatoria
                                    </Typography>
                                )}
                            </IonItem>
                        </IonList>
                        <div className={classes.cta}>
                            <IonButton disabled={isLoading} type="submit">
                                {!isLoading ? 'Entrar a Kiwi' : <IonSpinner color="dark" />}
                            </IonButton>
                            {!isLoading && (
                                <a
                                    className={classes.registerLink}
                                    onClick={() => {
                                        setShowRegisterMessage(false);
                                        setShowRegister(true);
                                    }}
                                >
                                    <Typography variant="h5" color={palette.primary.dark}>
                                        Regístrame
                                    </Typography>
                                </a>
                            )}
                        </div>
                        {loginError && (
                            <Typography center color={palette.error.main} gutterBottom={16}>
                                Usuario no activo o las credeneciales no son correctas
                            </Typography>
                        )}
                        {showRegisterMessage && (
                            <>
                                <Typography
                                    center
                                    variant="h5"
                                    color={palette.secondary.main}
                                    gutterBottom={8}
                                >
                                    ¡Enhorabuena! Te has registrado con éxito <br />
                                </Typography>
                                <Typography center color={palette.secondary.main}>
                                    En breve activaremos tu cuenta y te notificaremos por correo para que
                                    puedas acceder. <br /> Tardaremos poco ;)
                                </Typography>
                            </>
                        )}
                    </Box>
                </form>
                <IonModal
                    isOpen={showRegister}
                    backdropDismiss
                    onDidDismiss={() => {
                        setShowRegister(false);
                    }}
                >
                    <Register closeModal={handleCloseModal} />
                </IonModal>
            </IonContent>
        </IonPage>
    );
};

export default Login;
