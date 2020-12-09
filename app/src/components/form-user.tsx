import {IonInput, IonItem, IonLabel, IonList} from '@ionic/react';
import {createUseStyles} from 'react-jss';
import * as React from 'react';
import kiwiApi from '../api';
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

type Props = {
    controlRef: (handleSubmit: any) => void;
    defaultValues?: {email: string; firstName: string; phone: string};
    showHeader?: boolean;
    disableEmail?: boolean;
};

const FormUser = ({controlRef, defaultValues, showHeader, disableEmail}: Props) => {
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
                <Typography gutterBottom={32} variant="h3">
                    Vamos con tus datos,
                </Typography>
            )}
            <IonList lines="full">
                <IonItem>
                    <IonLabel position="floating">Email</IonLabel>
                    <Controller
                        control={control}
                        name="email"
                        rules={{
                            required: true,
                            validate: async (value: string) => {
                                const {isTaken} = await kiwiApi.emailTaken(value);
                                const sameEmail = value === defaultValues?.email;
                                return sameEmail || !isTaken;
                            },
                        }}
                        render={({onChange, onBlur, value, name, ref}) => (
                            <IonInput
                                autocomplete="email"
                                disabled={disableEmail}
                                onIonChange={onChange}
                                name={name}
                                ref={ref}
                                onBlur={onBlur}
                                value={value}
                            />
                        )}
                    />

                    {errors.email?.type === 'required' && (
                        <Typography color={palette.error.main} variant="caption2">
                            Tu correo es obligatorio
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
                    <Controller
                        control={control}
                        name="firstName"
                        rules={{
                            required: true,
                        }}
                        render={({onChange, onBlur, value, name, ref}) => (
                            <IonInput
                                autocomplete="name"
                                onIonChange={onChange}
                                name={name}
                                ref={ref}
                                onBlur={onBlur}
                                value={value}
                            />
                        )}
                    />
                    {errors.firstName?.type === 'required' && (
                        <Typography color={palette.error.main} variant="caption2">
                            Tu nombre es obligatorio
                        </Typography>
                    )}
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Teléfono</IonLabel>
                    <Controller
                        control={control}
                        name="phone"
                        rules={{
                            required: true,
                            pattern: /^\d{9}$/g,
                        }}
                        render={({onChange, onBlur, value, name, ref}) => (
                            <IonInput
                                autocomplete="tel"
                                onIonChange={onChange}
                                name={name}
                                type="number"
                                ref={ref}
                                onBlur={onBlur}
                                value={value}
                            />
                        )}
                    />
                    {errors.phone?.type === 'required' && (
                        <Typography color={palette.error.main} variant="caption2">
                            Tu teléfono es obligatorio
                        </Typography>
                    )}
                    {errors.phone?.type === 'pattern' && (
                        <Typography color={palette.error.main} variant="caption2">
                            Este teléfono no parece válido
                        </Typography>
                    )}
                </IonItem>
                <Typography variant="subtitle2" style={{textAlign: 'start'}}>
                    Necesitamos tu teléfono para llamarte si hay algún problema con tu pedido o entrega
                </Typography>
            </IonList>
        </form>
    );
};

export default FormUser;
