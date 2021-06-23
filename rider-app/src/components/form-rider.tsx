import {IonItem, IonLabel, IonList, IonSelect, IonSelectOption} from '@ionic/react';
import {createUseStyles} from 'react-jss';
import * as React from 'react';
import Typography from './typography';
import {Controller, useForm} from 'react-hook-form';
import palette from '../theme/palette';

const useStyles = createUseStyles(() => ({
    slideContainer: {
        width: '100%',
        height: '100%',
        padding: 16,
    },
}));

const cities = [
    {
        label: 'Alcalá de Henares',
        value: 'Alcalá de Henares',
    },
];

const vehicles = [
    {
        label: 'Bici',
        value: 'bike',
    },
    {
        label: 'Bici Eléctrica',
        value: 'electric-bike',
    },
    {
        label: 'Moto',
        value: 'motorcycle',
    },
    {
        label: 'Coche',
        value: 'car',
    },
];

type Props = {
    controlRef: (handleSubmit: any) => void;
    defaultValues?: {
        deliveryCity: string;
        deliveryVehicle: string;
    };
    showHeader?: boolean;
};

const FormRider = ({controlRef, defaultValues, showHeader}: Props) => {
    const classes = useStyles();
    const {handleSubmit, errors, control} = useForm({
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
                        Cuentanos un poco más,
                    </Typography>
                </>
            )}
            <IonList lines="full">
                <IonItem>
                    <IonLabel position="floating">¿Dónde te gustaría realizar pedidos?</IonLabel>
                    <Controller
                        control={control}
                        name="deliveryCity"
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
                                {cities.map((e: {value: string; label: string}) => (
                                    <IonSelectOption key={e.value} value={e.value}>
                                        {e.label}
                                    </IonSelectOption>
                                ))}
                            </IonSelect>
                        )}
                    />
                    {errors.deliveryCity?.type === 'required' && (
                        <Typography color={palette.error.main} variant="caption2">
                            Debes elegir una ciudad en la que te gustaría realizar los pedidos
                        </Typography>
                    )}
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Tipo de vehículo</IonLabel>
                    <Controller
                        control={control}
                        name="deliveryVehicle"
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
                                {vehicles.map((e: {value: string; label: string}) => (
                                    <IonSelectOption key={e.value} value={e.value}>
                                        {e.label}
                                    </IonSelectOption>
                                ))}
                            </IonSelect>
                        )}
                    />
                    {errors.deliveryVehicle?.type === 'required' && (
                        <Typography color={palette.error.main} variant="caption2">
                            Debes elegir un día para la entrega de tu compra
                        </Typography>
                    )}
                </IonItem>
            </IonList>
        </form>
    );
};

export default FormRider;
