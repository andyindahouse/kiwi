import {IonDatetime, IonInput, IonItem, IonLabel, IonList, IonSelect, IonSelectOption} from '@ionic/react';
import {createUseStyles} from 'react-jss';
import * as React from 'react';
import Typography from '../components/typography';
import {Controller, useForm} from 'react-hook-form';
import palette from '../theme/palette';

const useStyles = createUseStyles(() => ({
    slideContainer: {
        width: '100%',
        height: '100%',
        padding: 16,
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

type Props = {
    controlRef: (handleSubmit: any) => void;
    defaultValues?: {
        deliveryAddress: string;
        deliveryPostalCode: string;
        deliveryWeekDay: string;
        deliveryHour: string;
    };
    showHeader?: boolean;
};

const FormDelivery = ({controlRef, defaultValues, showHeader}: Props) => {
    const classes = useStyles();
    const {handleSubmit, register, errors, control} = useForm({
        shouldFocusError: true,
        defaultValues,
    });

    React.useEffect(() => {
        controlRef(handleSubmit);
    }, []);

    return (
        <form className={classes.slideContainer}>
            {showHeader && (
                <Typography gutterBottom={32} variant="h3">
                    Ahora tu información de entrega,
                </Typography>
            )}
            <IonList lines="full">
                <IonItem>
                    <IonLabel position="floating">Dirección</IonLabel>
                    <Controller
                        control={control}
                        name="deliveryAddress"
                        rules={{
                            required: true,
                        }}
                        render={({onChange, onBlur, value, name, ref}) => (
                            <IonInput
                                autocomplete="street-address"
                                onIonChange={onChange}
                                name={name}
                                ref={ref}
                                onBlur={onBlur}
                                value={value}
                            />
                        )}
                    />
                    {errors.deliveryAddress?.type === 'required' && (
                        <Typography color={palette.error.main} variant="caption2">
                            Tu dirección es obligatoria
                        </Typography>
                    )}
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Código postal</IonLabel>
                    <Controller
                        control={control}
                        name="deliveryPostalCode"
                        rules={{
                            required: true,
                            pattern: /^\d{5}$/g,
                        }}
                        render={({onChange, onBlur, value, name, ref}) => (
                            <IonInput
                                autocomplete="postal-code"
                                onIonChange={onChange}
                                name={name}
                                ref={ref}
                                type="number"
                                onBlur={onBlur}
                                value={value}
                            />
                        )}
                    />
                    {errors.deliveryPostalCode?.type === 'required' && (
                        <Typography color={palette.error.main} variant="caption2">
                            Tu código postal es obligatorio
                        </Typography>
                    )}
                    {errors.deliveryPostalCode?.type === 'pattern' && (
                        <Typography color={palette.error.main} variant="caption2">
                            Este código postal no parece válido
                        </Typography>
                    )}
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Día semanal de entrega</IonLabel>
                    <Controller
                        control={control}
                        name="deliveryWeekDay"
                        rules={{
                            required: true,
                        }}
                        render={({onChange, onBlur, value, name, ref}) => (
                            <IonSelect
                                name={name}
                                value={value}
                                onBlur={onBlur}
                                onIonChange={onChange}
                                okText="Ok"
                                cancelText="Cancelar"
                                ref={ref}
                            >
                                {days.map((e: {value: string; label: string}) => (
                                    <IonSelectOption key={e.value} value={e.value}>
                                        {e.label}
                                    </IonSelectOption>
                                ))}
                            </IonSelect>
                        )}
                    />
                    {errors.deliveryWeekDay?.type === 'required' && (
                        <Typography color={palette.error.main} variant="caption2">
                            Debes elegir un día para la entrega de tu compra
                        </Typography>
                    )}
                </IonItem>
                <Typography variant="subtitle2">
                    Recibiras tu compra siempre este día de cada semana
                </Typography>
                <IonItem>
                    <IonLabel position="floating">Hora de entrega</IonLabel>
                    <Controller
                        control={control}
                        name="deliveryHour"
                        rules={{
                            required: true,
                        }}
                        render={({onChange, onBlur, value, name, ref}) => (
                            <IonDatetime
                                name={name}
                                onBlur={onBlur}
                                onIonChange={onChange}
                                displayFormat="HH:mm"
                                minuteValues="0,15,30,45"
                                hourValues="11,12,13,14,15,16,17,18,19,20"
                                pickerFormat="HH:mm"
                                value={value}
                                ref={ref}
                            />
                        )}
                    />
                    {errors.deliveryHour?.type === 'required' && (
                        <Typography color={palette.error.main} variant="caption2">
                            Debes elegir una hora para la entrega de tu compra
                        </Typography>
                    )}
                </IonItem>
                <Typography variant="subtitle2">Recibiras tu compra a esta hora el día elegido</Typography>
            </IonList>
        </form>
    );
};

export default FormDelivery;
