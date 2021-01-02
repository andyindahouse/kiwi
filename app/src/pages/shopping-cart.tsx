import * as React from 'react';
import {createUseStyles} from 'react-jss';
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
} from '@ionic/react';
import {Product} from '../models';
import ProductDetail from '../components/product-detail';
import {EMPTY_SHOPPING_CART, SYNC_SHOPPING_CART, useShoppingCart} from '../contexts/shopping-cart';
import Typography from '../components/typography';
import ProductItem from '../components/product-item';
import palette from '../theme/palette';
import kiwiApi from '../api';
import {useHistory} from 'react-router-dom';
import {format, startOfTomorrow, addDays} from 'date-fns';
import {es} from 'date-fns/locale';
import EmptyCase from '../components/empty-case';
import {Controller, useForm} from 'react-hook-form';
import {useAuth} from '../contexts/auth';

const useStyles = createUseStyles(() => ({
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
    feeDiscount: {
        display: 'flex',
        justifyContent: 'flex-end',
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
    const history = useHistory();
    const {
        products,
        totalCost,
        totalShoppingCart,
        deliverFee,
        shopperFee,
        finalShopperFee,
        finalDeliverFee,
        dispatch,
    } = useShoppingCart();
    const [selected, setSelected] = React.useState<Product | null>(null);
    const [productWithNote, setProductWithNote] = React.useState<{product: Product; index: number} | null>(
        null
    );
    const [showModal, setShowModal] = React.useState(false);
    const [showAlert, setShowAlert] = React.useState(false);
    const listRef = React.useRef<HTMLIonListElement | null>(null);
    const [showChart, setShowChart] = React.useState(false);
    const {user} = useAuth();
    const {handleSubmit, errors, control} = useForm({
        shouldFocusError: true,
        defaultValues: {
            deliveryAddress: user?.deliveryAddress,
            deliveryDate: getAllowDays()[1].value,
            deliveryHour: user?.deliveryHour,
            deliveryNote: '',
        },
    });
    const updateShoppingCart = (updatedProducts: ReadonlyArray<Product>) => {
        kiwiApi
            .setShoppingCart({
                products: updatedProducts,
            })
            .catch((error) => {
                throw new Error('Carrito desactualizado');
            })
            .then((res) => {
                listRef.current?.closeSlidingItems();
                dispatch({
                    type: SYNC_SHOPPING_CART,
                    shoppingCart: res,
                });
            });
    };
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
            })
            .then((res) => {
                setShowModal(false);
                dispatch({
                    type: EMPTY_SHOPPING_CART,
                });
                history.push('/others/orders');
            });
    };

    React.useEffect(() => {
        kiwiApi.getShoppingCart().then((res) => {
            dispatch({
                type: SYNC_SHOPPING_CART,
                shoppingCart: res,
            });
        });
    }, [dispatch]);

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
                                const {name, price, img} = product;
                                const getUnits = (product: Product) => product.units ?? product.items?.length;
                                return (
                                    <ProductItem
                                        key={product.id}
                                        img={img}
                                        title={name}
                                        subtitle={`${getUnits(product)} ud x ${price.final}€ / ud`}
                                        handleClickDetail={() => setSelected(product)}
                                        labelLeftAction={
                                            <IonIcon slot="icon-only" icon={documentTextOutline} />
                                        }
                                        labelRightAction={<IonIcon slot="icon-only" icon={trashOutline} />}
                                        handleClickLeftAction={() => setProductWithNote({product, index})}
                                        handleClickRightAction={() =>
                                            updateShoppingCart(
                                                products.slice(0, index).concat(products.slice(index + 1))
                                            )
                                        }
                                    >
                                        <div>
                                            <Typography color={palette.secondary.main} variant="caption1">
                                                {(getUnits(product) * Number(price.final)).toFixed(2)}€
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
                                    console.log(note, productWithNote);
                                    const updatedProduct = {
                                        ...productWithNote.product,
                                        note,
                                    };
                                    updateShoppingCart(
                                        products
                                            .slice(0, productWithNote.index)
                                            .concat(
                                                [updatedProduct],
                                                products.slice(productWithNote.index + 1)
                                            )
                                    );
                                }
                            },
                        },
                    ]}
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
                                const productIndex = products.findIndex((e) => e.id === product.id);
                                if (product.units === 0) {
                                    updateShoppingCart(
                                        products
                                            .slice(0, productIndex)
                                            .concat(products.slice(productIndex + 1))
                                    );
                                } else {
                                    updateShoppingCart(
                                        products
                                            .slice(0, productIndex)
                                            .concat([product], products.slice(productIndex + 1))
                                    );
                                }
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
                                        render={({onChange, onBlur, value, name, ref}) => (
                                            <IonInput
                                                autocomplete="street-address"
                                                onIonChange={onChange}
                                                name={name}
                                                ref={ref}
                                                onBlur={onBlur}
                                                value={value}
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
                                        render={({onChange, onBlur, value, name, ref}) => (
                                            <IonDatetime
                                                name={name}
                                                onBlur={onBlur}
                                                onIonChange={onChange}
                                                displayFormat="HH:mm"
                                                minuteValues="0,15,30,45"
                                                hourValues="11,12,13,14,15,16,17,18,19,20"
                                                pickerFormat="HH:mm"
                                                value={value}
                                                ref={ref}
                                            />
                                        )}
                                    />
                                </IonItem>
                                <IonItem>
                                    <IonLabel>Agrega una nota al envío:</IonLabel>
                                    <Controller
                                        control={control}
                                        name="deliveryNote"
                                        render={({onChange, onBlur, value, name, ref}) => (
                                            <IonInput
                                                onIonChange={onChange}
                                                name={name}
                                                ref={ref}
                                                onBlur={onBlur}
                                                value={value}
                                            />
                                        )}
                                    />
                                </IonItem>

                                <IonItemDivider />

                                <div className={classes.feeZone}>
                                    <Typography variant="subtitle1">Carrito</Typography>
                                    <Typography>{totalShoppingCart}€</Typography>
                                    <Typography variant="subtitle1">Personal shopper</Typography>
                                    <Typography>{shopperFee}€</Typography>
                                    <Typography variant="subtitle1">Envío a domicilio</Typography>
                                    <Typography>{deliverFee}€</Typography>
                                    <Typography variant="subtitle1">Total</Typography>
                                    <Typography variant="caption1">{totalCost}€</Typography>
                                </div>
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
                                        handler: (blah) => {},
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
                        <div className={classes.feeZone}>
                            <Typography variant="subtitle2">Carrito</Typography>
                            <Typography variant="body1">{totalShoppingCart}€</Typography>
                            <div>
                                <Typography variant="subtitle2">Personal shopper</Typography>
                                &nbsp;
                                <Typography variant="subtitle2" color={palette.primary.dark}>
                                    (50% descuento early adopter)
                                </Typography>
                            </div>
                            <div className={classes.feeDiscount}>
                                <Typography variant="body1">{finalShopperFee}€</Typography>
                                &nbsp;
                                <Typography variant="body1" style={{textDecoration: 'line-through'}}>
                                    {shopperFee} €
                                </Typography>
                            </div>
                            <div>
                                <Typography variant="subtitle2">Envío a domicilio</Typography>
                                &nbsp;
                                <Typography variant="subtitle2" color={palette.primary.dark}>
                                    (50% descuento early adopter)
                                </Typography>
                            </div>
                            <div className={classes.feeDiscount}>
                                <Typography variant="body1">{finalDeliverFee}€</Typography>
                                &nbsp;
                                <Typography variant="body1" style={{textDecoration: 'line-through'}}>
                                    {deliverFee} €
                                </Typography>
                            </div>
                            <Typography variant="subtitle2">Total</Typography>
                            <Typography variant="caption1">{totalCost}€</Typography>
                        </div>
                        <IonButton
                            color="secondary"
                            expand="full"
                            size="large"
                            onClick={() => setShowModal(true)}
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
