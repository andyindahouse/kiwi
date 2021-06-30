import {IonDatetime, IonInput, IonItem, IonLabel, IonList, IonSelect, IonSelectOption} from '@ionic/react';
import {Typography, createUseStyles, useTheme} from '@kiwi/ui';
import * as React from 'react';
import {Controller, useForm} from 'react-hook-form';

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
    const {palette} = useTheme();
    const {
        handleSubmit,
        formState: {errors},
        control,
    } = useForm({
        shouldFocusError: true,
        defaultValues,
    });

    React.useEffect(() => {
        controlRef(handleSubmit);
    }, [controlRef, handleSubmit]);

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
                        render={({field}) => (
                            <IonInput {...field} onIonChange={field.onChange} autocomplete="street-address" />
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
                        render={({field}) => (
                            <IonInput {...field} onIonChange={field.onChange} autocomplete="postal-code" />
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
                        render={({field}) => (
                            <IonSelect
                                {...field}
                                onIonChange={field.onChange}
                                okText="Ok"
                                cancelText="Cancelar"
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
                    Recibirás tu compra siempre este día de cada semana
                </Typography>
                <IonItem>
                    <IonLabel position="floating">Hora de entrega</IonLabel>
                    <Controller
                        control={control}
                        name="deliveryHour"
                        rules={{
                            required: true,
                        }}
                        render={({field}) => (
                            <IonDatetime
                                {...field}
                                onIonChange={field.onChange}
                                displayFormat="HH:mm"
                                minuteValues="0,15,30,45"
                                hourValues="11,12,13,14,15,16,17,18,19,20"
                                pickerFormat="HH:mm"
                            />
                        )}
                    />
                    {errors.deliveryHour?.type === 'required' && (
                        <Typography color={palette.error.main} variant="caption2">
                            Debes elegir una hora para la entrega de tu compra
                        </Typography>
                    )}
                </IonItem>
                <Typography variant="subtitle2">Recibirás tu compra a esta hora el día elegido</Typography>
            </IonList>
        </form>
    );
};

export default FormDelivery;
