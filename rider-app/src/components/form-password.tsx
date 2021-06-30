import {IonInput, IonItem, IonLabel, IonList} from '@ionic/react';
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

type Props = {controlRef: (handleSubmit: any) => void; showHeader?: boolean; showOldPasswordField?: boolean};

const FormPassword = ({controlRef, showHeader, showOldPasswordField}: Props) => {
    const classes = useStyles();
    const {palette} = useTheme();
    const {
        handleSubmit,
        formState: {errors},
        watch,
        control,
    } = useForm({
        shouldFocusError: true,
    });

    React.useEffect(() => {
        controlRef(handleSubmit);
    }, [controlRef, handleSubmit]);

    return (
        <form className={classes.slideContainer}>
            {showHeader && (
                <>
                    <Typography gutterBottom={32} variant="h3">
                        Ya casi está, último paso.
                    </Typography>
                </>
            )}
            <IonList lines="full">
                {showOldPasswordField && (
                    <IonItem>
                        <IonLabel position="floating">Tu contraseña actual</IonLabel>
                        <Controller
                            control={control}
                            name="oldPassword"
                            rules={{
                                required: true,
                            }}
                            render={({field}) => (
                                <IonInput {...field} onIonChange={field.onChange} type="password" />
                            )}
                        />
                        {errors.oldPassword?.type === 'required' && (
                            <Typography color={palette.error.main} variant="caption2">
                                Tu contraseña actual es obligatoria
                            </Typography>
                        )}
                    </IonItem>
                )}
                <IonItem>
                    <IonLabel position="floating">
                        {showOldPasswordField ? 'Tu nueva contraseña' : 'Tu contraseña'}
                    </IonLabel>
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
                            {showOldPasswordField
                                ? 'Tu nueva contraseña es obligatoria'
                                : 'Tu contraseña es obligatoria'}
                        </Typography>
                    )}
                </IonItem>

                <IonItem>
                    <IonLabel position="floating">
                        {showOldPasswordField ? 'Repite tu nueva contraseña' : 'Repite tu contraseña'}
                    </IonLabel>
                    <Controller
                        control={control}
                        name="rePassword"
                        rules={{
                            required: true,
                            validate: (value) => value === watch('password'),
                        }}
                        render={({field}) => (
                            <IonInput {...field} onIonChange={field.onChange} type="password" />
                        )}
                    />

                    {errors.rePassword?.type === 'required' && (
                        <Typography color={palette.error.main} variant="caption2">
                            Tienes que confirmar tu contraseña
                        </Typography>
                    )}
                    {errors.rePassword?.type === 'validate' && (
                        <Typography color={palette.error.main} variant="caption2">
                            Tu contraseña no coincide
                        </Typography>
                    )}
                </IonItem>
            </IonList>
        </form>
    );
};

export default FormPassword;
