import {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonFooter,
    IonIcon,
    IonDatetime,
    IonItem,
    IonLabel,
    IonInput,
    IonList,
    IonItemDivider,
    IonAlert,
} from '@ionic/react';
import {addCircleOutline, removeCircleOutline, syncOutline, addOutline, removeOutline} from 'ionicons/icons';
import * as React from 'react';
import {Typography, createUseStyles, useTheme} from '@kiwi/ui';
import {Product, ProductOrderStatus} from '@kiwi/models';

const useStyles = createUseStyles(({palette}) => ({
    container: {
        padding: 16,
    },
    image: {
        margin: 16,
        height: 240,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        position: 'relative',
    },
    price: {
        padding: 8,
        borderRadius: 24,
        backgroundColor: palette.primary.dark,
        display: 'inline-block',
        position: 'absolute',
        right: '5px',
        bottom: '5px',
        color: '#FFFFFF',
    },
    footer: {},
    unitsContainer: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: 8,
        '& > p': {
            margin: '0 16px',
        },
    },
    nameProduct: {
        '&::first-letter': {
            textTransform: 'uppercase',
        },
    },
    replaceSection: {
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gridGap: 8,
        alignItems: 'center',
    },
    icon: {
        width: 24,
        height: 24,
        color: palette.secondary.main,
    },
}));

const getUnitsLabel = (itemsLength: number) =>
    itemsLength === 1 ? `${itemsLength} unidad` : `${itemsLength} unidades`;

const Units = ({
    units,
    maxUnits,
    handleOnChange,
    label,
}: {
    units: number;
    maxUnits?: number;
    label: ReadonlyArray<string>;
    handleOnChange: (units: number) => void;
}) => {
    const classes = useStyles();
    const {palette} = useTheme();

    return (
        <div className={classes.unitsContainer}>
            <IonIcon
                style={{color: palette.primary.main}}
                size="large"
                icon={removeCircleOutline}
                role="button"
                onClick={() => {
                    if (units > 1) {
                        handleOnChange(units - 1);
                    }
                }}
            />
            <Typography>
                {units}
                {units === 1 ? ` ${label[0]}` : ` ${label[1]}`}
            </Typography>
            <IonIcon
                style={{color: palette.primary.main}}
                size="large"
                icon={addCircleOutline}
                role="button"
                onClick={() => {
                    if (!maxUnits) {
                        handleOnChange(units + 1);
                    } else {
                        if (units < maxUnits) {
                            handleOnChange(units + 1);
                        }
                    }
                }}
            />
        </div>
    );
};

const mapNextState: Record<
    ProductOrderStatus,
    {labelCta: string; color: string; nextStatus: ProductOrderStatus}
> = {
    pending: {
        labelCta: 'Marcar como cogido',
        color: 'primary',
        nextStatus: 'saved',
    },
    saved: {
        labelCta: 'Actualizar producto',
        color: 'primary',
        nextStatus: 'saved',
    },
    'not-available': {
        labelCta: 'Devolver al carrito',
        color: 'primary',
        nextStatus: 'saved',
    },
};

type Props = {
    product: Product;
    updateProduct: (product: Product) => void;
    closeModal: () => void;
    replaceProduct?: boolean;
};

const ProductDetail = ({product, closeModal, updateProduct, replaceProduct}: Props) => {
    const classes = useStyles();
    const {palette} = useTheme();
    const {name, price, img, brand, note, items = []} = product;
    const [currentPrice, setCurrentPrice] = React.useState<number | null>();
    const [units, setUnits] =
        React.useState<ReadonlyArray<{date: string | null; price: string | null}>>(items);
    const [showAlert, setShowAlert] = React.useState(false);
    const isUnitSaleType = product.saleType === 'unit';
    const [addDifferentPrices, setAddDifferentPrices] = React.useState(product.items?.every((e) => e.price));

    return (
        <>
            <IonHeader translucent>
                <IonToolbar>
                    <IonTitle>Detalle</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={() => closeModal()}>Cerrar</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <div className={classes.container}>
                    <div className={classes.image} style={{backgroundImage: `url(${img})`}}>
                        <Typography variant="h2" className={classes.price}>
                            {price.final}€ / ud.
                        </Typography>
                    </div>
                    <Typography variant="subtitle1" gutterBottom={8}>
                        {brand}
                    </Typography>
                    <Typography className={classes.nameProduct} variant="h3" gutterBottom={16}>
                        {name.replace(brand, '').trim()}
                    </Typography>
                    {note && <Typography>Nota del cliente: {note}</Typography>}
                    {replaceProduct && (
                        <div className={classes.replaceSection}>
                            <IonIcon className={classes.icon} size="large" icon={syncOutline} />
                            <Typography variant="body2">
                                Puedes reemplazar este producto por uno equivalente, solo si te has asegurado
                                que no está disponible
                            </Typography>
                        </div>
                    )}
                </div>
                <IonList>
                    <IonItemDivider />

                    <IonItem lines="none">
                        <IonLabel>Precio marcado:</IonLabel>
                        <IonInput
                            type="number"
                            value={currentPrice}
                            placeholder={`${price.final}€ (actualizar)`}
                            onIonChange={(e) => {
                                e && setCurrentPrice(Number(e.detail.value));
                            }}
                            disabled={addDifferentPrices}
                        />
                    </IonItem>
                    {isUnitSaleType && (
                        <IonItem
                            lines="none"
                            onClick={() => {
                                setAddDifferentPrices(!addDifferentPrices);
                            }}
                        >
                            {addDifferentPrices ? (
                                <IonIcon
                                    style={{color: palette.secondary.main}}
                                    size="large"
                                    icon={removeOutline}
                                    role="button"
                                />
                            ) : (
                                <IonIcon
                                    style={{color: palette.secondary.main}}
                                    size="large"
                                    icon={addOutline}
                                    role="button"
                                />
                            )}
                            {addDifferentPrices ? (
                                <IonLabel>Usar el mismo precio</IonLabel>
                            ) : (
                                <IonLabel>Añadir diferentes precios por ud.</IonLabel>
                            )}
                        </IonItem>
                    )}
                    {isUnitSaleType &&
                        addDifferentPrices &&
                        units.map((e, index) => (
                            <IonItem key={index} lines={index === units.length - 1 ? 'none' : 'inset'}>
                                <IonLabel>Precio unidad {index + 1}: </IonLabel>
                                <IonInput
                                    type="number"
                                    value={e.price}
                                    onIonChange={(e) => {
                                        if (e.detail.value) {
                                            setUnits(
                                                units.map((unit, idx) => {
                                                    if (index === idx) {
                                                        return {
                                                            date: unit.date,
                                                            price: e.detail.value || price.final,
                                                        };
                                                    } else {
                                                        return {date: unit.date, price: unit.price};
                                                    }
                                                })
                                            );
                                        }
                                    }}
                                />
                            </IonItem>
                        ))}
                    <IonItemDivider />

                    <IonItem>
                        <div>
                            <Typography>
                                {isUnitSaleType ? 'Unidades a coger:' : 'Cantidad a coger:'}
                            </Typography>
                            <Typography variant="h5" gutterBottom={8} color={palette.secondary.main}>
                                {isUnitSaleType ? getUnitsLabel(items.length) : `${product.units} gr`}
                            </Typography>
                            {isUnitSaleType && (
                                <>
                                    <Typography gutterBottom={8} variant="subtitle2">
                                        Si no están disponibles las unidades requeridas marcar la cantidad
                                        cogida
                                    </Typography>
                                    <Units
                                        label={['ud. cogida', 'ud. cogidas']}
                                        units={units.length}
                                        maxUnits={items.length}
                                        handleOnChange={(ud) => {
                                            if (ud > units.length) {
                                                setUnits([...units, {date: null, price: price.final}]);
                                            } else {
                                                setUnits(units.slice(0, ud));
                                            }
                                        }}
                                    />
                                </>
                            )}
                        </div>
                    </IonItem>
                    {units.map((e, index) => (
                        <IonItem key={index} lines={index === units.length - 1 ? 'none' : 'inset'}>
                            <IonLabel>Fecha de caducidad:</IonLabel>
                            <IonDatetime
                                min={new Date().toISOString()}
                                max="2030-12-31"
                                value={e.date}
                                placeholder="Añadir"
                                displayFormat="DD/MM/YYYY"
                                onIonChange={(e) => {
                                    if (e.detail.value) {
                                        const newValue = e.detail.value?.split('T')[0];
                                        const auxUnits = units.map((unit, idx) => {
                                            if (index === idx || !unit.date) {
                                                return {date: newValue, price: unit.price};
                                            } else {
                                                return {date: unit.date, price: unit.price};
                                            }
                                        });
                                        setUnits(auxUnits);
                                    }
                                }}
                            />
                        </IonItem>
                    ))}
                    <IonItemDivider />

                    {product.statusOrder !== 'not-available' && (
                        <div>
                            <IonButton
                                expand="block"
                                color="danger"
                                onClick={() => {
                                    setShowAlert(true);
                                }}
                            >
                                No disponible en tienda
                            </IonButton>
                        </div>
                    )}
                    <IonItemDivider />
                </IonList>

                <IonAlert
                    isOpen={showAlert}
                    onDidDismiss={() => setShowAlert(false)}
                    cssClass="my-custom-class"
                    header={'Confirmar que el pedido no está disponible'}
                    message={'¿Estás seguro que el pedido no está disponible?'}
                    buttons={[
                        {
                            text: 'Cancelar',
                            role: 'cancel',
                            cssClass: 'secondary',
                            handler: () => undefined,
                        },
                        {
                            text: 'Aceptar',
                            handler: () => {
                                updateProduct({
                                    ...product,
                                    statusOrder: 'not-available',
                                });
                                closeModal();
                            },
                        },
                    ]}
                />
            </IonContent>

            {product.statusOrder && (
                <IonFooter>
                    <IonToolbar>
                        <div className={classes.footer}>
                            <IonButton
                                expand="block"
                                color={mapNextState[product.statusOrder].color}
                                onClick={() => {
                                    if (product.statusOrder) {
                                        updateProduct({
                                            ...product,
                                            items: units.map((e) => ({
                                                ...e,
                                                price: addDifferentPrices ? e.price : null,
                                            })),
                                            units: product.saleType === 'unit' ? units.length : product.units,
                                            price: {final: currentPrice ? String(currentPrice) : price.final},
                                            statusOrder: mapNextState[product.statusOrder].nextStatus,
                                        });
                                        closeModal();
                                    }
                                }}
                            >
                                {mapNextState[product.statusOrder].labelCta}
                            </IonButton>
                        </div>
                    </IonToolbar>
                </IonFooter>
            )}
        </>
    );
};

export default ProductDetail;
