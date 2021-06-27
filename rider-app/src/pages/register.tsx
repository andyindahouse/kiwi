import {
    IonButton,
    IonButtons,
    IonContent,
    IonFooter,
    IonHeader,
    IonSlide,
    IonSlides,
    IonSpinner,
    IonTitle,
    IonToolbar,
} from '@ionic/react';
import {Typography, createUseStyles, useTheme} from '@kiwi/ui';
import * as React from 'react';
import kiwiApi from '../api';
import {RegisterUser} from '../models';
import FormUser from '../components/form-user';
import FormRider from '../components/form-rider';
import FormPassword from '../components/form-password';

const useStyles = createUseStyles(() => ({
    registerForm: {
        display: 'flex',
        flexDirection: 'column',
    },
    slideContainer: {
        width: '100%',
        height: '100%',
        padding: 16,
    },
    image: {
        height: 100,
        border: '1px solid #000000',
        marginBottom: 16,
    },
    slider: {
        height: '100%',
    },
}));

type Props = {
    closeModal: (registerSuccess: boolean) => void;
};

const Register: React.FC<Props> = ({closeModal}: Props) => {
    const classes = useStyles();
    const {palette} = useTheme();
    const sliderRef = React.useRef<HTMLIonSlidesElement | null>(null);
    const [data, setData] = React.useState<RegisterUser>({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        deliveryCity: '',
        deliveryVehicle: '',
        password: '',
        rePassword: '',
    });
    const [formUserRef, setFormUserRef] = React.useState<null | {submit: () => void}>();
    const [formDeliveryRef, setFormDeliveryRef] = React.useState<null | {submit: () => void}>();
    const [formPasswordRef, setFormPasswordRef] = React.useState<null | {submit: () => void}>();
    const [currentStep, setCurrentStep] = React.useState(0);
    const [isLoading, setLoading] = React.useState(false);
    const [registerError, setRegisterError] = React.useState(false);
    const updateData = (stepData: Partial<RegisterUser>) => {
        setData((data: RegisterUser) => ({
            ...data,
            ...stepData,
        }));
    };

    React.useEffect(() => {
        if (data.firstName === '') {
            return;
        }

        sliderRef.current?.isEnd().then((lastStep) => {
            if (lastStep) {
                setLoading(true);
                kiwiApi
                    .registerUser(data)
                    .then(() => {
                        setLoading(false);
                        closeModal(true);
                    })
                    .catch(() => {
                        setRegisterError(true);
                    });
            } else {
                sliderRef.current?.lockSwipeToNext(false);
                sliderRef.current?.slideNext();
                sliderRef.current?.lockSwipeToNext(true);
            }
        });
    }, [data]);

    React.useEffect(() => {
        sliderRef.current?.lockSwipeToNext(true);
    }, []);

    return (
        <>
            <IonHeader translucent>
                <IonToolbar>
                    <IonTitle>Registro</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={() => closeModal(false)}>Cerrar</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <div className={classes.slider}>
                    <IonSlides
                        ref={sliderRef}
                        options={{speed: 400}}
                        /** workaround to avoid this issue https://github.com/ionic-team/ionic-framework/issues/19638 */
                        // eslint-disable-next-line no-unused-vars
                        onIonSlidesDidLoad={function (this: any) {
                            this.update();
                        }}
                        onIonSlideDidChange={() => {
                            sliderRef.current?.getActiveIndex().then((step) => {
                                setCurrentStep(step);
                            });
                        }}
                    >
                        <IonSlide>
                            <FormUser
                                showHeader
                                controlRef={(handleSubmit: any) => {
                                    setFormUserRef({
                                        submit: handleSubmit(updateData),
                                    });
                                }}
                            />
                        </IonSlide>
                        <IonSlide>
                            <FormRider
                                showHeader
                                controlRef={(handleSubmit: any) => {
                                    setFormDeliveryRef({
                                        submit: handleSubmit(updateData),
                                    });
                                }}
                            />
                        </IonSlide>
                        <IonSlide>
                            <FormPassword
                                showHeader
                                controlRef={(handleSubmit: any) => {
                                    setFormPasswordRef({
                                        submit: handleSubmit(updateData),
                                    });
                                }}
                            />
                            {registerError && (
                                <Typography color={palette.error.main}>
                                    Ha ocurrido un error desconocido
                                </Typography>
                            )}
                        </IonSlide>
                    </IonSlides>
                </div>
            </IonContent>
            <IonFooter>
                <IonToolbar>
                    <IonButton
                        color="secondary"
                        expand="full"
                        size="large"
                        onClick={() => {
                            if (currentStep === 0) {
                                formUserRef && formUserRef.submit();
                            } else if (currentStep === 1) {
                                formDeliveryRef && formDeliveryRef.submit();
                            } else {
                                formPasswordRef && formPasswordRef.submit();
                            }
                        }}
                    >
                        {isLoading ? (
                            <IonSpinner color={palette.secondary.contrastText} />
                        ) : currentStep === 0 || currentStep === 1 ? (
                            'Siguiente'
                        ) : (
                            'Regístrame'
                        )}
                    </IonButton>
                </IonToolbar>
            </IonFooter>
        </>
    );
};

export default Register;
