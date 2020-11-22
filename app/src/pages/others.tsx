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
    useIonViewDidEnter,
} from '@ionic/react';
import {
    homeOutline,
    keyOutline,
    logOutOutline,
    notificationsOutline,
    notificationsOffOutline,
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
import {Capacitor, Plugins} from '@capacitor/core';
import palette from '../theme/palette';

const MSG_UPDATED_SUCESSFULLY = 'Datos actualizados con éxito';
const MSG_NOTIFICATIONS_ALREADY_ON = 'Tienes las notificaciones activadas';
const MSG_NOTIFICATIONS_ACTIVED = 'Notificaciones activadas';

const Others: React.FC = () => {
    const {user, setUser, logout} = useAuth();
    const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);
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
    const [showToast, setShowToast] = React.useState<{
        show: boolean;
        message?: string;
    }>({
        show: false,
        message: '',
    });
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
            setShowToast({
                show: true,
                message: MSG_UPDATED_SUCESSFULLY,
            });
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
    const requestNotificationsPermission = async () => {
        Plugins.LocalNotifications.requestPermission().then((res) => {
            setNotificationsEnabled(res.granted);

            if (res.granted) {
                setShowToast({
                    show: true,
                    message: MSG_NOTIFICATIONS_ACTIVED,
                });
            }
        });
    };

    useIonViewDidEnter(() => {
        if (Capacitor.isNative) {
            Plugins.LocalNotifications.areEnabled().then((res) => {
                setNotificationsEnabled(res.value);
            });
        }
    });

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
                    <IonItem
                        button
                        onClick={() => {
                            if (notificationsEnabled) {
                                setShowToast({
                                    show: false,
                                    message: MSG_NOTIFICATIONS_ALREADY_ON,
                                });
                            } else {
                                requestNotificationsPermission();
                            }
                        }}
                    >
                        {notificationsEnabled ? (
                            <IonIcon slot="end" color="primary" icon={notificationsOutline}></IonIcon>
                        ) : (
                            <IonIcon slot="end" color="danger" icon={notificationsOffOutline}></IonIcon>
                        )}
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
                <IonToast
                    isOpen={showToast.show}
                    onDidDismiss={() =>
                        setShowToast({
                            show: false,
                        })
                    }
                    message={showToast.message}
                    position="bottom"
                    duration={4000}
                    translucent
                />
            </IonContent>
        </IonPage>
    );
};

export default Others;
