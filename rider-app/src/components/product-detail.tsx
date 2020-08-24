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
} from '@ionic/react';
import {addCircleOutline, removeCircleOutline} from 'ionicons/icons';
import * as React from 'react';
import {createUseStyles} from 'react-jss';
import {OrderStatus, Product, ProductOrderStatus} from '../models';
import palette from '../theme/palette';
import Typography from './typography';

const useStyles = createUseStyles(() => ({
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
}));

const Units = ({
    units,
    handleOnChange,
    label,
}: {
    units: number;
    label: ReadonlyArray<string>;
    handleOnChange: (units: number) => void;
}) => {
    const classes = useStyles();
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
                    handleOnChange(units + 1);
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
    disabled?: boolean;
};

const ProductDetail = ({product, closeModal, updateProduct, disabled = false}: Props) => {
    const classes = useStyles();
    const {name, price, cost, img, brand, note, items = []} = product;
    const [currentPrice, setCurrentPrice] = React.useState(Number(price.final));
    const [units, setUnits] = React.useState<ReadonlyArray<{date: string | null}>>(items);
    const [daysAfterOpened, setDaysAfterOpened] = React.useState(0);
    const changeUnits = (index: number, value: string) => {
        setUnits([...units.slice(0, index), {date: value}, ...units.slice(index + 1)]);
    };

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
                            {price.final}€
                        </Typography>
                    </div>
                    <Typography variant="subtitle1" gutterBottom={8}>
                        {brand}
                    </Typography>
                    <Typography className={classes.nameProduct} variant="h3">
                        {name.replace(brand, '').trim()}
                    </Typography>
                    {note && <Typography>Nota del cliente: {note}</Typography>}
                </div>
                <IonList>
                    <IonItemDivider />
                    <IonItem lines="none">
                        <IonLabel>Precio marcado:</IonLabel>
                        <IonInput
                            type="number"
                            value={currentPrice}
                            onIonChange={(e) => {
                                e && setCurrentPrice(Number(e.detail.value));
                            }}
                        />
                    </IonItem>
                    <IonItemDivider />

                    <IonItem>
                        <div>
                            <Typography gutterBottom={8}>Unidades cogidas:</Typography>
                            <Typography style={{display: 'block'}} gutterBottom={8} variant="subtitle2">
                                Si no están disponibles las unidades requeridas marcar la cantidad cogida
                            </Typography>
                            <Units
                                label={['ud recogida', 'ud recogidas']}
                                units={units.length}
                                handleOnChange={(ud) => {
                                    if (ud > units.length) {
                                        setUnits([...units, {date: null}]);
                                    } else {
                                        setUnits(units.slice(0, ud));
                                    }
                                }}
                            />
                        </div>
                    </IonItem>
                    {units.map((e, index) => (
                        <IonItem key={index} lines={index === units.length - 1 ? 'none' : 'inset'}>
                            <IonLabel>Fecha de caducidad:</IonLabel>
                            <IonDatetime
                                min={new Date().toISOString()}
                                value={e.date}
                                placeholder="Añadir"
                                displayFormat="DD/MM/YYYY"
                                onIonChange={(e) => changeUnits(index, e.detail.value ?? '')}
                            />
                        </IonItem>
                    ))}
                    <IonItemDivider />

                    <IonItem lines="none">
                        <div>
                            <Typography>Una vez abierto consumir en:</Typography>
                            <Typography style={{display: 'block'}} gutterBottom={8} variant="subtitle2">
                                Mirar fecha en producto si corresponde
                            </Typography>
                            <Units
                                label={['día', 'días']}
                                units={daysAfterOpened}
                                handleOnChange={(days) => {
                                    setDaysAfterOpened(days);
                                }}
                            />
                        </div>
                    </IonItem>
                    <IonItemDivider />

                    {product.statusOrder !== 'not-available' && (
                        <div>
                            <IonButton
                                expand="block"
                                color="danger"
                                onClick={() => {
                                    updateProduct({
                                        ...product,
                                        statusOrder: 'not-available',
                                    });
                                    closeModal();
                                }}
                            >
                                No disponible en tienda
                            </IonButton>
                        </div>
                    )}
                    <IonItemDivider />
                </IonList>
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
                                            items: units,
                                            daysAfterOpened,
                                            price: {final: String(currentPrice)},
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
