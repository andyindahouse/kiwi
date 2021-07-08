import * as React from 'react';
import {Typography, createUseStyles, useTheme} from '@kiwi/ui';
import {cartOutline, chevronForwardOutline, documentTextOutline, trashOutline} from 'ionicons/icons';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonBackButton,
    IonTitle,
    IonToolbar,
    IonModal,
    IonButtons,
    IonButton,
    IonIcon,
    IonList,
    IonAlert,
    IonFooter,
    IonItem,
    IonLabel,
    IonInput,
    IonDatetime,
    IonItemDivider,
    IonSelect,
    IonSelectOption,
    useIonViewWillEnter,
    IonToggle,
} from '@ionic/react';
import {Product} from '@kiwi/models';
import ProductDetail from '../components/product-detail';
import {EMPTY_SHOPPING_CART, SYNC_SHOPPING_CART, useShoppingCart} from '../contexts/shopping-cart';
import ProductItem from '../components/product-item';
import kiwiApi from '../api';
import {useHistory} from 'react-router-dom';
import {format, startOfTomorrow, addDays} from 'date-fns';
import {es} from 'date-fns/locale';
import EmptyCase from '../components/empty-case';
import {Controller, useForm} from 'react-hook-form';
import {useAuth} from '../contexts/auth';
import PaymentFooter from '../components/payment-fields';
import {setPersistedShoppingCartProducts} from '../utils/unauthenticated-persistence';
import {updateProducts} from '../utils';
import {getCostSubtitle} from '@kiwi/utils';

const useStyles = createUseStyles(({palette}) => ({
    list: {
        display: 'grid',
        gridGap: 16,
    },
    itemWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    item: {
        display: 'grid',
        gridTemplateColumns: '64px 1fr 64px',
        gridGap: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    price: {
        fontWeight: 600,
        color: palette.primary.dark,
    },
    units: {
        maxWidth: 150,
        width: '100%',
        height: 32,
        borderRadius: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    icon: {
        width: 32,
        height: 32,
        color: palette.black,
    },
    feeZone: {
        padding: 8,
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gridGap: 8,
        '& > p': {
            justifySelf: 'flex-end',
        },
    },
    center: {
        marginTop: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 16px',
    },
}));

const getFormatDate = (date: Date) =>
    format(date, 'eeee, dd MMMM', {
        locale: es,
    });
const getAllowDays = () => {
    const tomorrow = startOfTomorrow();
    const dayAfterTomorrow = addDays(tomorrow, 1);
    const dayAfterAfterTomorrow = addDays(tomorrow, 2);
    const dayAfterAfterAfterTomorrow = addDays(tomorrow, 3);

    return [
        {value: tomorrow.toISOString(), label: getFormatDate(tomorrow)},
        {value: dayAfterTomorrow.toISOString(), label: getFormatDate(dayAfterTomorrow)},
        {value: dayAfterAfterTomorrow.toISOString(), label: getFormatDate(dayAfterAfterTomorrow)},
        {value: dayAfterAfterAfterTomorrow.toISOString(), label: getFormatDate(dayAfterAfterAfterTomorrow)},
    ];
};

const ShoppingCart = () => {
    const classes = useStyles();
    const {palette} = useTheme();
    const history = useHistory();
    const {
        products,
        totalCost,
        totalShoppingCart,
        deliverFee,
        shopperFee,
        finalShopperFee,
        finalDeliverFee,
        deliveryDiscount,
        dispatch,
    } = useShoppingCart();
    const [selected, setSelected] = React.useState<Product | null>(null);
    const [productWithNote, setProductWithNote] = React.useState<{product: Product; index: number} | null>(
        null
    );
    const [showModal, setShowModal] = React.useState(false);
    const [showAlert, setShowAlert] = React.useState(false);
    const [showRegisterAlert, setShowRegisterAlert] = React.useState(false);
    const listRef = React.useRef<HTMLIonListElement | null>(null);
    const [showChart, setShowChart] = React.useState(false);
    const [replaceProducts, setReplaceProducts] = React.useState(true);
    const {user} = useAuth();
    const {
        handleSubmit,
        formState: {errors},
        control,
    } = useForm({
        shouldFocusError: true,
        defaultValues: {
            deliveryAddress: user?.deliveryAddress,
            deliveryDate: getAllowDays()[1].value,
            deliveryHour: user?.deliveryHour,
            deliveryNote: '',
        },
    });
    const updateShoppingCart = React.useCallback(
        (updatedProducts: ReadonlyArray<Product>) => {
            const request = user ? kiwiApi.setShoppingCart : setPersistedShoppingCartProducts;

            request({products: updatedProducts})
                .then((res) => {
                    listRef.current?.closeSlidingItems();
                    dispatch({
                        type: SYNC_SHOPPING_CART,
                        shoppingCart: res,
                    });
                })
                .catch(() => {
                    throw new Error('Carrito desactualizado');
                });
        },
        [dispatch, user]
    );
    const handleCheckout = ({
        deliveryAddress,
        deliveryDate,
        deliveryHour,
        deliveryNote,
    }: {
        deliveryAddress: string;
        deliveryDate: string;
        deliveryHour: string;
        deliveryNote: string;
    }) => {
        kiwiApi
            .checkout({
                note: deliveryNote,
                deliveryAddress,
                deliveryDate,
                deliveryHour,
                replaceProducts,
            })
            .then(() => {
                setShowModal(false);
                dispatch({
                    type: EMPTY_SHOPPING_CART,
                });
                history.push('/others/orders');
            });
    };

    useIonViewWillEnter(() => {
        if (user) {
            kiwiApi.getShoppingCart().then((res) => {
                dispatch({
                    type: SYNC_SHOPPING_CART,
                    shoppingCart: res,
                });
            });
        }
    }, [user, dispatch]);

    return (
        <IonPage>
            <IonContent>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonBackButton text="Volver" defaultHref="/search" />
                        </IonButtons>
                        <IonTitle>Tu carrito</IonTitle>
                    </IonToolbar>
                </IonHeader>
                {products && (
                    <IonList ref={listRef}>
                        <div className={classes.list}>
                            {products.map((product, index) => {
                                const {name, img} = product;

                                return (
                                    <ProductItem
                                        key={product.id}
                                        img={img}
                                        title={name}
                                        subtitle={getCostSubtitle(product)}
                                        handleClickDetail={() => setSelected(product)}
                                        labelLeftAction={
                                            <IonIcon slot="icon-only" icon={documentTextOutline} />
                                        }
                                        labelRightAction={<IonIcon slot="icon-only" icon={trashOutline} />}
                                        handleClickLeftAction={() => setProductWithNote({product, index})}
                                        handleClickRightAction={() =>
                                            updateShoppingCart(
                                                updateProducts(
                                                    {
                                                        ...product,
                                                        units: 0,
                                                    },
                                                    products
                                                )
                                            )
                                        }
                                        showAlertIcon={!product.available}
                                        showDiscountIcon={
                                            product.available &&
                                            !!product.specialOffer &&
                                            !!product.specialOfferValue &&
                                            Number(product.specialOfferValue[0]) > product.units
                                        }
                                    >
                                        <div>
                                            <Typography color={palette.secondary.main} variant="caption1">
                                                {product.cost}€
                                            </Typography>
                                        </div>
                                    </ProductItem>
                                );
                            })}
                        </div>
                        {products.length === 0 && (
                            <EmptyCase
                                title1="Tu compra está vacía,"
                                title2="puedes añadir productos desde el buscador"
                                icon={cartOutline}
                                subtitle="Sabemos que hacer tu compra es un poco tedioso, es por eso
                                que iremos preparando tus siguientes compras automágicamente en base a tu
                                consumo"
                            />
                        )}
                    </IonList>
                )}

                <IonAlert
                    isOpen={!!productWithNote}
                    onDidDismiss={() => {
                        setProductWithNote(null);
                    }}
                    header="Nota de producto"
                    subHeader="Usa esta nota para añadir cualquier información adicional que quieras indicarle al Shopper"
                    inputs={[
                        {
                            name: 'note',
                            type: 'text',
                            label: 'Nota de producto',
                            value: productWithNote?.product.note,
                            placeholder: 'Ej: Coger el menos maduro posible',
                        },
                    ]}
                    buttons={[
                        {
                            text: 'Cancelar',
                            role: 'cancel',
                            cssClass: 'secondary',
                            handler: () => {
                                listRef.current?.closeSlidingItems();
                            },
                        },
                        {
                            text: productWithNote?.product.note ? 'Modificar' : 'Añadir',
                            handler: ({note}: {note: string}) => {
                                if (productWithNote && note) {
                                    const updatedProduct = {
                                        ...productWithNote.product,
                                        note,
                                    };
                                    updateShoppingCart(updateProducts(updatedProduct, products));
                                }
                            },
                        },
                    ]}
                />

                <IonAlert
                    isOpen={showRegisterAlert}
                    onDidDismiss={() => {
                        setShowRegisterAlert(false);
                        history.push('/others');
                    }}
                    header="¡Ay!"
                    subHeader="Regístrate y haz tu pedido"
                    message="Para realizar un pedido tienes que estar registrado o tener tu sesión activa"
                    buttons={['OK']}
                />
                <IonModal
                    isOpen={!!selected}
                    onDidPresent={() => setShowChart(true)}
                    backdropDismiss
                    onDidDismiss={() => {
                        setSelected(null);
                        setShowChart(false);
                    }}
                >
                    {selected && (
                        <ProductDetail
                            showChart={showChart}
                            updateProduct={(product) => {
                                updateShoppingCart(updateProducts(product, products));
                            }}
                            closeModal={() => setSelected(null)}
                            product={selected}
                        />
                    )}
                </IonModal>
                <IonModal
                    isOpen={!!showModal}
                    backdropDismiss
                    onDidDismiss={() => {
                        setShowModal(false);
                    }}
                >
                    <>
                        <IonHeader>
                            <IonToolbar>
                                <IonTitle>Pago y envío</IonTitle>
                                <IonButtons slot="end">
                                    <IonButton
                                        onClick={() => {
                                            setShowModal(false);
                                        }}
                                    >
                                        Volver
                                    </IonButton>
                                </IonButtons>
                            </IonToolbar>
                        </IonHeader>
                        <IonContent>
                            <IonList lines="full">
                                <IonItem>
                                    <IonLabel position="stacked">Dirección de entrega:</IonLabel>
                                    <Controller
                                        control={control}
                                        name="deliveryAddress"
                                        rules={{
                                            required: true,
                                        }}
                                        render={({field}) => (
                                            <IonInput
                                                {...field}
                                                onIonChange={field.onChange}
                                                autocomplete="street-address"
                                            />
                                        )}
                                    />
                                    {errors.deliveryAddress?.type === 'required' && (
                                        <Typography color={palette.error.main} variant="caption2">
                                            La dirección de entrega es obligatoria
                                        </Typography>
                                    )}
                                </IonItem>
                                <IonItem>
                                    <IonLabel>Fecha de entrega:</IonLabel>
                                    <Controller
                                        control={control}
                                        name="deliveryDate"
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
                                                {getAllowDays().map((e: {value: string; label: string}) => (
                                                    <IonSelectOption key={e.value} value={e.value}>
                                                        {e.label}
                                                    </IonSelectOption>
                                                ))}
                                            </IonSelect>
                                        )}
                                    />
                                </IonItem>
                                <IonItem>
                                    <IonLabel>Hora de entrega:</IonLabel>
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
                                </IonItem>
                                <IonItem>
                                    <IonLabel>Agrega una nota al envío:</IonLabel>
                                    <Controller
                                        control={control}
                                        name="deliveryNote"
                                        render={({field}) => (
                                            <IonInput {...field} onIonChange={field.onChange} />
                                        )}
                                    />
                                </IonItem>

                                <IonItem>
                                    <IonLabel>
                                        <div>
                                            <IonLabel>Reeemplazar con equivalentes:</IonLabel>
                                            <Typography variant="subtitle2">
                                                En caso de no disponer de existencias <br />
                                                de un productos tu shopper lo reemplazará <br />
                                                por un producto equivalente
                                            </Typography>
                                        </div>
                                    </IonLabel>

                                    <IonToggle
                                        checked={replaceProducts}
                                        onIonChange={(e) => setReplaceProducts(e.detail.checked)}
                                    />
                                </IonItem>

                                <IonItemDivider />

                                <PaymentFooter
                                    totalShoppingCart={totalShoppingCart}
                                    deliveryDiscount={deliveryDiscount}
                                    deliverFee={deliverFee}
                                    finalDeliverFee={finalDeliverFee}
                                    shopperFee={shopperFee}
                                    finalShopperFee={finalShopperFee}
                                    totalCost={totalCost}
                                />
                                <IonItemDivider />
                            </IonList>
                            <IonAlert
                                isOpen={showAlert}
                                onDidDismiss={() => setShowAlert(false)}
                                cssClass="my-custom-class"
                                header={'¿Estás seguro que quieres realizar el pedido?'}
                                message={'Una vez realizado no podrás cambiarlo'}
                                buttons={[
                                    {
                                        text: 'Cancelar',
                                        role: 'cancel',
                                        cssClass: 'secondary',
                                        handler: () => undefined,
                                    },
                                    {
                                        text: 'Aceptar',
                                        handler: handleSubmit(handleCheckout),
                                    },
                                ]}
                            />
                        </IonContent>
                        <IonFooter>
                            <IonToolbar>
                                <IonButton expand="full" size="large" onClick={() => setShowAlert(true)}>
                                    <Typography variant="h3">Realizar pedido</Typography>
                                    <IonIcon
                                        className={classes.icon}
                                        slot="end"
                                        icon={chevronForwardOutline}
                                    ></IonIcon>
                                </IonButton>
                            </IonToolbar>
                        </IonFooter>
                    </>
                </IonModal>
            </IonContent>
            {products && products.length > 0 && (
                <IonFooter>
                    <IonToolbar>
                        <PaymentFooter
                            totalShoppingCart={totalShoppingCart}
                            deliveryDiscount={deliveryDiscount}
                            deliverFee={deliverFee}
                            finalDeliverFee={finalDeliverFee}
                            shopperFee={shopperFee}
                            finalShopperFee={finalShopperFee}
                            totalCost={totalCost}
                        />
                        <IonButton
                            color="secondary"
                            expand="full"
                            size="large"
                            onClick={() => {
                                if (user) {
                                    setShowModal(true);
                                } else {
                                    setShowRegisterAlert(true);
                                }
                            }}
                        >
                            <Typography variant="h3" style={{color: palette.white}}>
                                Ir a pago y envío
                            </Typography>
                            <IonIcon
                                className={classes.icon}
                                style={{color: palette.white}}
                                slot="end"
                                icon={chevronForwardOutline}
                            ></IonIcon>
                        </IonButton>
                    </IonToolbar>
                </IonFooter>
            )}
        </IonPage>
    );
};

export default ShoppingCart;
