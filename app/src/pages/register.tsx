import {
    IonButton,
    IonButtons,
    IonContent,
    IonDatetime,
    IonFooter,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonSelect,
    IonSelectOption,
    IonSlide,
    IonSlides,
    IonTitle,
    IonToolbar,
} from '@ionic/react';
import {createUseStyles} from 'react-jss';
import * as React from 'react';
import kiwiApi from '../api';
import Typography from '../components/typography';
import {useForm, Controller} from 'react-hook-form';
import palette from '../theme/palette';
import {User} from '../models';
import {watch} from 'fs';

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

const days = [
    {
        label: 'Lunes',
        value: '1',
    },
    {
        label: 'Martes',
        value: '2',
    },
    {
        label: 'Miércoles',
        value: '3',
    },
    {
        label: 'Jueves',
        value: '4',
    },
    {
        label: 'Viernes',
        value: '5',
    },
    {
        label: 'Sábado',
        value: '6',
    },
    {
        label: 'Domingo',
        value: '0',
    },
];

type RegisterUser = User & {password: string; rePassword: string};

type Props = {
    closeModal: () => void;
};

const Register: React.FC<Props> = ({closeModal}: Props) => {
    const classes = useStyles();
    const sliderRef = React.useRef<HTMLIonSlidesElement | null>(null);
    const [data, setData] = React.useState<RegisterUser>({
        firstName: '',
        phone: '',
        email: '',
        deliveryAddress: '',
        deliveryCp: '',
        deliveryWeekDay: '1',
        deliveryHour: '',
        password: '',
        rePassword: '',
    });
    const [currentStep, setCurrentStep] = React.useState(0);
    const {handleSubmit, register, unregister, errors, watch} = useForm({
        shouldFocusError: true,
    });
    const nextStep = async (currentForm: Partial<RegisterUser>) => {
        console.log('submit');
        setData({...data, ...currentForm});
        const lastStep = await sliderRef.current?.isEnd();
        if (lastStep) {
            const res = await kiwiApi.registerUser(data);
        } else {
            await sliderRef.current?.lockSwipeToNext(false);
            await sliderRef.current?.slideNext();
            await sliderRef.current?.lockSwipeToNext(true);
        }
    };
    const updateFields = () => {
        if (currentStep === 0) {
            unregister([
                'deliveryAddress',
                'deliveryCp',
                'deliveryHour',
                'deliveryWeekDay',
                'password',
                'rePassword',
            ]);
        } else if (currentStep === 1) {
            register('deliveryAddress');
            register('deliveryHour');
            register('deliveryCp');
            register('deliveryWeekDay');
            unregister(['password', 'rePassword']);
        } else {
            register('password');
            register('rePassword');
        }
    };

    React.useEffect(() => {
        sliderRef.current?.lockSwipeToNext(true);
    }, []);

    console.log(errors);

    return (
        <>
            <IonHeader translucent>
                <IonToolbar>
                    <IonTitle>Registro</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={() => closeModal()}>Cerrar</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <div className={classes.slider}>
                    <IonSlides
                        ref={sliderRef}
                        options={{speed: 400}}
                        /** workaround to avoid this issue https://github.com/ionic-team/ionic-framework/issues/19638 */
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
                            <form className={classes.slideContainer}>
                                <Typography gutterBottom={32} variant="h3">
                                    Vamos con tus datos,
                                </Typography>
                                <div className={classes.image}>image</div>
                                <IonList lines="full">
                                    <IonItem>
                                        <IonLabel position="floating">Email</IonLabel>
                                        <IonInput
                                            name="email"
                                            ref={register({
                                                required: true,
                                                validate: async (value: string) => {
                                                    const {isTaken} = await kiwiApi.emailTaken(value);
                                                    return !isTaken;
                                                },
                                            })}
                                        />
                                        {errors.email?.type === 'required' && (
                                            <Typography color={palette.error.main} variant="caption2">
                                                ouch! Tu correo es obligatorio
                                            </Typography>
                                        )}
                                        {errors.email?.type === 'validate' && (
                                            <Typography color={palette.error.main} variant="caption2">
                                                Este correo ya está registrado
                                            </Typography>
                                        )}
                                    </IonItem>
                                    <IonItem>
                                        <IonLabel position="floating">Nombre</IonLabel>
                                        <IonInput name="firstName" ref={register({required: true})} />
                                        {errors.firstName?.type === 'required' && (
                                            <Typography color={palette.error.main} variant="caption2">
                                                ouch! Tu nombre es obligatorio
                                            </Typography>
                                        )}
                                    </IonItem>
                                    <IonItem>
                                        <IonLabel position="floating">Teléfono</IonLabel>
                                        <IonInput
                                            name="phone"
                                            type="number"
                                            ref={register({required: true, pattern: /^\d{9}$/g})}
                                        />
                                        {errors.phone?.type === 'required' && (
                                            <Typography color={palette.error.main} variant="caption2">
                                                ouch! Tu teléfono es obligatorio
                                            </Typography>
                                        )}
                                        {errors.phone?.type === 'pattern' && (
                                            <Typography color={palette.error.main} variant="caption2">
                                                Este teléfono no parece válido
                                            </Typography>
                                        )}
                                    </IonItem>
                                </IonList>
                            </form>
                             
                        </IonSlide>
                        <IonSlide>
                            <form className={classes.slideContainer}>
                                <Typography gutterBottom={32} variant="h3">
                                    Ahora tu información de entrega,
                                </Typography>
                                <div className={classes.image}>image</div>
                                <IonList lines="full">
                                    <IonItem>
                                        <IonLabel position="floating">Dirección</IonLabel>
                                        <IonInput name="deliveryAddress" ref={register({required: true})} />
                                        {errors.deliveryAddress?.type === 'required' && (
                                            <Typography color={palette.error.main} variant="caption2">
                                                ouch! Tu teléfono es obligatorio
                                            </Typography>
                                        )}
                                    </IonItem>
                                    <IonItem>
                                        <IonLabel position="floating">Código postal</IonLabel>
                                        <IonInput
                                            type="number"
                                            name="deliveryCp"
                                            ref={register({required: true, pattern: /^\d{5}$/g})}
                                        />
                                        {errors.deliveryCp?.type === 'required' && (
                                            <Typography color={palette.error.main} variant="caption2">
                                                ouch! Tu código postal es obligatorio
                                            </Typography>
                                        )}
                                        {errors.deliveryCp?.type === 'pattern' && (
                                            <Typography color={palette.error.main} variant="caption2">
                                                Este código postal no parece válido
                                            </Typography>
                                        )}
                                    </IonItem>
                                    <IonItem>
                                        <IonLabel position="floating">Día semanal de entrega</IonLabel>
                                        <IonSelect
                                            name="deliveryWeekDay"
                                            okText="Ok"
                                            cancelText="Cancelar"
                                            ref={register({required: true})}
                                        >
                                            {days.map((e: {value: string; label: string}) => (
                                                <IonSelectOption key={e.value} value={e.value}>
                                                    {e.label}
                                                </IonSelectOption>
                                            ))}
                                        </IonSelect>
                                        {errors.deliveryWeekDay?.type === 'required' && (
                                            <Typography color={palette.error.main} variant="caption2">
                                                ouch! Debes elegir un día para la entrega de tu compra
                                            </Typography>
                                        )}
                                    </IonItem>
                                    <IonItem>
                                        <IonLabel position="floating">Hora de entrega</IonLabel>
                                        <IonDatetime
                                            name="deliveryHour"
                                            displayFormat="HH:mm"
                                            minuteValues="0,15,30,45"
                                            hourValues="11,12,13,14,15,16,17,18,19,20"
                                            pickerFormat="HH:mm"
                                            ref={register({required: true})}
                                        ></IonDatetime>
                                        {errors.deliveryHour?.type === 'required' && (
                                            <Typography color={palette.error.main} variant="caption2">
                                                ouch! Debes elegir una hora para la entrega de tu compra
                                            </Typography>
                                        )}
                                    </IonItem>
                                </IonList>
                            </form>
                        </IonSlide>
                        <IonSlide>
                            <form className={classes.slideContainer}>
                                <Typography gutterBottom={32} variant="h3">
                                    Ya casi está, último paso.
                                </Typography>
                                <div className={classes.image}>image</div>
                                <IonList lines="full">
                                    <IonItem>
                                        <IonLabel position="floating">Tu contraseña</IonLabel>
                                        <IonInput
                                            name="password"
                                            type="password"
                                            ref={register({required: true})}
                                        />
                                        {errors.password?.type === 'required' && (
                                            <Typography color={palette.error.main} variant="caption2">
                                                ouch! Tu contraseña es obligatoria
                                            </Typography>
                                        )}
                                    </IonItem>

                                    <IonItem>
                                        <IonLabel position="floating">Repite tu contraseña</IonLabel>
                                        <IonInput
                                            name="rePassword"
                                            type="password"
                                            ref={register({
                                                required: true,
                                                validate: (value) => value === watch('password'),
                                            })}
                                        />
                                        {errors.rePassword?.type === 'required' && (
                                            <Typography color={palette.error.main} variant="caption2">
                                                ouch! Tienes que confirmar tu contraseña
                                            </Typography>
                                        )}
                                        {errors.rePassword?.type === 'validate' && (
                                            <Typography color={palette.error.main} variant="caption2">
                                                ouch! Tu contraseña no coincide
                                            </Typography>
                                        )}
                                    </IonItem>
                                </IonList>
                            </form>
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
                            updateFields();
                            handleSubmit(nextStep, (err: any) => {
                                console.error(err);
                            })();
                        }}
                    >
                        {currentStep === 0 || currentStep === 1 ? 'Siguiente' : 'Registrame'}
                    </IonButton>
                </IonToolbar>
            </IonFooter>
        </>
    );
};

export default Register;
