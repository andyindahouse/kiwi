import {IonInput, IonItem, IonLabel, IonList} from '@ionic/react';
import {createUseStyles} from 'react-jss';
import * as React from 'react';
import kiwiApi from '../api';
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

type Props = {
    controlRef: (handleSubmit: any) => void;
    defaultValues?: {email: string; firstName: string; phone: string};
    showHeader?: boolean;
    disableEmail?: boolean;
};

const FormUser = ({controlRef, defaultValues, showHeader, disableEmail}: Props) => {
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
                        Vamos con tus datos,
                    </Typography>
                    <div className={classes.image}>image</div>
                </>
            )}
            <IonList lines="full">
                <IonItem>
                    <IonLabel position="floating">Email</IonLabel>
                    <IonInput
                        name="email"
                        disabled={disableEmail}
                        ref={
                            register({
                                required: true,
                                validate: async (value: string) => {
                                    const {isTaken} = await kiwiApi.emailTaken(value);
                                    const sameEmail = value === defaultValues?.email;
                                    return sameEmail || !isTaken;
                                },
                            }) as any
                        }
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
                    <IonInput name="firstName" ref={register({required: true}) as any} />
                    {errors.firstName?.type === 'required' && (
                        <Typography color={palette.error.main} variant="caption2">
                            Tu nombre es obligatorio
                        </Typography>
                    )}
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Teléfono</IonLabel>
                    <IonInput
                        name="phone"
                        type="number"
                        ref={register({required: true, pattern: /^\d{9}$/g}) as any}
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
            </IonList>
        </form>
    );
};

export default FormUser;
