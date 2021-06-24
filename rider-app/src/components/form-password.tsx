import {IonInput, IonItem, IonLabel, IonList} from '@ionic/react';
import {createUseStyles} from 'react-jss';
import * as React from 'react';
import {Typography, palette} from '@kiwi/ui';
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
    const {handleSubmit, errors, watch, control} = useForm({
        shouldFocusError: true,
    });

    React.useEffect(() => {
        controlRef(handleSubmit);
    }, []);

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
                            render={({onChange, onBlur, value, name, ref}) => (
                                <IonInput
                                    type="password"
                                    onIonChange={onChange}
                                    name={name}
                                    ref={ref}
                                    onBlur={onBlur}
                                    value={value}
                                />
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
                        render={({onChange, onBlur, value, name, ref}) => (
                            <IonInput
                                type="password"
                                onIonChange={onChange}
                                name={name}
                                ref={ref}
                                onBlur={onBlur}
                                value={value}
                            />
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
                        render={({onChange, onBlur, value, name, ref}) => (
                            <IonInput
                                type="password"
                                onIonChange={onChange}
                                name={name}
                                ref={ref}
                                onBlur={onBlur}
                                value={value}
                            />
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
