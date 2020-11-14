import {IonInput, IonItem, IonLabel, IonList} from '@ionic/react';
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

type Props = {controlRef: (handleSubmit: any) => void; showHeader?: boolean; showOldPasswordField?: boolean};

const FormPassword = ({controlRef, showHeader, showOldPasswordField}: Props) => {
    const classes = useStyles();
    const {handleSubmit, register, errors, watch} = useForm({
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
                    <div className={classes.image}>image</div>
                </>
            )}
            <IonList lines="full">
                {showOldPasswordField && (
                    <IonItem>
                        <IonLabel position="floating">Tu contraseña actual</IonLabel>
                        <IonInput name="oldPassword" type="password" ref={register({required: true})} />
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
                    <IonInput name="password" type="password" ref={register({required: true})} />
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
