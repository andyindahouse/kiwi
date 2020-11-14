import {IonDatetime, IonInput, IonItem, IonLabel, IonList, IonSelect, IonSelectOption} from '@ionic/react';
import {createUseStyles} from 'react-jss';
import * as React from 'react';
import Typography from '../components/typography';
import {useForm} from 'react-hook-form';
import palette from '../theme/palette';

const useStyles = createUseStyles(() => ({
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
    const {handleSubmit, register, errors} = useForm({
        shouldFocusError: true,
        defaultValues,
    });

    React.useEffect(() => {
        controlRef(handleSubmit);
    }, []);

    return (
        <form className={classes.slideContainer}>
            {showHeader && (
                <>
                    <Typography gutterBottom={32} variant="h3">
                        Ahora tu información de entrega,
                    </Typography>
                    <div className={classes.image}>image</div>
                </>
            )}
            <IonList lines="full">
                <IonItem>
                    <IonLabel position="floating">Dirección</IonLabel>
                    <IonInput name="deliveryAddress" ref={register({required: true}) as any} />
                    {errors.deliveryAddress?.type === 'required' && (
                        <Typography color={palette.error.main} variant="caption2">
                            Tu dirección es obligatoria
                        </Typography>
                    )}
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Código postal</IonLabel>
                    <IonInput
                        type="number"
                        name="deliveryPostalCode"
                        ref={register({required: true, pattern: /^\d{5}$/g}) as any}
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
                    <IonSelect
                        name="deliveryWeekDay"
                        okText="Ok"
                        cancelText="Cancelar"
                        ref={register({required: true}) as any}
                    >
                        {days.map((e: {value: string; label: string}) => (
                            <IonSelectOption key={e.value} value={e.value}>
                                {e.label}
                            </IonSelectOption>
                        ))}
                    </IonSelect>
                    {errors.deliveryWeekDay?.type === 'required' && (
                        <Typography color={palette.error.main} variant="caption2">
                            Debes elegir un día para la entrega de tu compra
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
                        ref={register({required: true}) as any}
                    ></IonDatetime>
                    {errors.deliveryHour?.type === 'required' && (
                        <Typography color={palette.error.main} variant="caption2">
                            Debes elegir una hora para la entrega de tu compra
                        </Typography>
                    )}
                </IonItem>
            </IonList>
        </form>
    );
};

export default FormDelivery;
