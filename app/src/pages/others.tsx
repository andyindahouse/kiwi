import * as React from 'react';
import {
    IonButton,
    IonButtons,
    IonContent,
    IonFooter,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonModal,
    IonPage,
    IonTitle,
    IonToast,
    IonToolbar,
} from '@ionic/react';
import {
    homeOutline,
    keyOutline,
    logOutOutline,
    notificationsOutline,
    personOutline,
    rocketOutline,
} from 'ionicons/icons';
import Typography from '../components/typography';
import {useAuth} from '../contexts/auth';
import FormUser from '../components/form-user';
import {User} from '../models';
import FormDelivery from '../components/form-delivery';
import FormPassword from '../components/form-password';
import kiwiApi from '../api';

const Others: React.FC = () => {
    const {user, setUser, logout} = useAuth();
    const [formUserRef, setFormUserRef] = React.useState<null | {submit: () => void}>();
    const [formDeliveryRef, setFormDeliveryRef] = React.useState<null | {submit: () => void}>();
    const [formPasswordRef, setFormPasswordRef] = React.useState<null | {submit: () => void}>();
    const [modalData, setModalData] = React.useState<{
        open: boolean;
        selectedData: 'user' | 'delivery' | 'password';
    }>({
        open: false,
        selectedData: 'user',
    });
    const [showToast, setShowToast] = React.useState(false);
    const selectData = (selectedData: 'user' | 'delivery' | 'password') => {
        setModalData({
            open: true,
            selectedData,
        });
    };
    const updateData = (stepData: Partial<User>) => {
        kiwiApi.setUser(stepData).then((user) => {
            setUser(user);
            setModalData({
                ...modalData,
                open: false,
            });
            setShowToast(true);
        });
    };
    const updatePassword = ({oldPassword, password}: {oldPassword: string; password: string}) => {
        kiwiApi.changeUserPassword({oldPassword, newPassword: password}).then(() => {
            setModalData({
                ...modalData,
                open: false,
            });
        });
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Más</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList lines="full">
                    <IonListHeader>
                        <Typography variant="h2">Cuenta</Typography>
                    </IonListHeader>
                    <IonItem href="/others/orders">
                        <IonIcon slot="end" color="secondary" icon={rocketOutline}></IonIcon>
                        <IonLabel>Mis pedidos</IonLabel>
                    </IonItem>
                    <IonItem button onClick={() => selectData('user')}>
                        <IonIcon slot="end" icon={personOutline}></IonIcon>
                        <IonLabel>Mis datos</IonLabel>
                    </IonItem>
                    <IonItem button onClick={() => selectData('delivery')}>
                        <IonIcon slot="end" icon={homeOutline}></IonIcon>
                        <IonLabel>Mis datos de entrega</IonLabel>
                    </IonItem>
                    <IonItem button onClick={() => selectData('password')}>
                        <IonIcon slot="end" icon={keyOutline}></IonIcon>
                        <IonLabel>Mi contraseña</IonLabel>
                    </IonItem>
                    <IonListHeader>
                        <Typography variant="h2">Otros</Typography>
                    </IonListHeader>
                    <IonItem button onClick={() => {}}>
                        <IonIcon slot="end" color="primary" icon={notificationsOutline}></IonIcon>
                        <IonLabel>Notificaciones</IonLabel>
                    </IonItem>
                    <IonItem button onClick={logout}>
                        <IonIcon slot="end" icon={logOutOutline}></IonIcon>
                        <IonLabel>Cerrar sesión</IonLabel>
                    </IonItem>
                </IonList>
                <IonModal
                    isOpen={modalData.open}
                    backdropDismiss
                    onDidDismiss={() => {
                        setModalData({
                            ...modalData,
                            open: false,
                        });
                    }}
                >
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Modificar datos</IonTitle>
                            <IonButtons slot="end">
                                <IonButton
                                    onClick={() =>
                                        setModalData({
                                            ...modalData,
                                            open: false,
                                        })
                                    }
                                >
                                    Cerrar
                                </IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        {modalData.selectedData === 'user' && user && (
                            <FormUser
                                disableEmail
                                controlRef={(handleSubmit: any) => {
                                    setFormUserRef({
                                        submit: handleSubmit(updateData),
                                    });
                                }}
                                defaultValues={{
                                    email: user.email,
                                    firstName: user.firstName,
                                    phone: user.phone,
                                }}
                            />
                        )}
                        {modalData.selectedData === 'delivery' && user && (
                            <FormDelivery
                                controlRef={(handleSubmit: any) => {
                                    setFormDeliveryRef({
                                        submit: handleSubmit(updateData),
                                    });
                                }}
                                defaultValues={{
                                    deliveryAddress: user.deliveryAddress,
                                    deliveryPostalCode: user.deliveryPostalCode,
                                    deliveryHour: user.deliveryHour,
                                    deliveryWeekDay: user.deliveryWeekDay,
                                }}
                            />
                        )}
                        {modalData.selectedData === 'password' && user && (
                            <FormPassword
                                showOldPasswordField
                                controlRef={(handleSubmit: any) => {
                                    setFormPasswordRef({
                                        submit: handleSubmit(updatePassword),
                                    });
                                }}
                            />
                        )}
                        <IonToast
                            isOpen={showToast}
                            onDidDismiss={() => setShowToast(false)}
                            message={'Datos actualizados con éxito'}
                            position="bottom"
                            duration={4000}
                            translucent
                        />
                    </IonContent>
                    <IonFooter>
                        <IonToolbar>
                            <IonButton
                                color="secondary"
                                expand="full"
                                size="large"
                                onClick={() => {
                                    if (modalData.selectedData === 'user') {
                                        formUserRef && formUserRef.submit();
                                    } else if (modalData.selectedData === 'delivery') {
                                        formDeliveryRef && formDeliveryRef.submit();
                                    } else {
                                        formPasswordRef && formPasswordRef.submit();
                                    }
                                }}
                            >
                                Modificar
                            </IonButton>
                        </IonToolbar>
                    </IonFooter>
                </IonModal>
            </IonContent>
        </IonPage>
    );
};

export default Others;
