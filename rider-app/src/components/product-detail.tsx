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
import {
    addCircleOutline,
    addCircleSharp,
    chevronForwardOutline,
    removeCircleOutline,
    removeCircleSharp,
} from 'ionicons/icons';
import {type} from 'os';
import * as React from 'react';
import {createUseStyles} from 'react-jss';
import {Product} from '../models';
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
                    handleOnChange(units - 1);
                }}
            />
        </div>
    );
};

type Props = {
    product: Product;
    updateProduct: (product: Product) => void;
    closeModal: () => void;
    disabled?: boolean;
};

const ProductDetail = ({product, closeModal, updateProduct, disabled = false}: Props) => {
    const classes = useStyles();
    const {name, price, cost, img, brand, units: initialUnits, nutriments} = product;
    console.log('initial units', initialUnits);
    const [units, setUnits] = React.useState(initialUnits ? initialUnits : 1);
    const [selectedDate, setSelectedDate] = React.useState<string>('2012-12-15T13:47:20.789');

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
                </div>
                <IonList>
                    <IonItemDivider />
                    <IonItem>
                        <IonLabel>Fecha de caducidad:</IonLabel>
                        <IonDatetime
                            min={new Date().toISOString()}
                            value={null}
                            placeholder="Añadir"
                            displayFormat="DD/MM/YYYY"
                            onIonChange={(e) => {}}
                        />
                    </IonItem>
                    <IonItem lines="none">
                        <div>
                            <Typography>Una vez abierto consumir en:</Typography>
                            <Typography style={{display: 'block'}} gutterBottom={8} variant="subtitle2">
                                Mirar fecha en producto si corresponde
                            </Typography>
                            <Units
                                label={['día', 'días']}
                                units={units}
                                handleOnChange={(units) => {
                                    console.log(units);
                                }}
                            />
                        </div>
                    </IonItem>
                    <IonItemDivider />
                    <IonItem>
                        <IonLabel>Precio:</IonLabel>
                        <IonInput type="number" value={cost} onIonChange={(e) => {}} />
                    </IonItem>
                    <IonItem lines="none">
                        <div>
                            <Typography gutterBottom={8}>Unidades recogidas:</Typography>
                            <Typography style={{display: 'block'}} gutterBottom={8} variant="subtitle2">
                                Si no están disponibles las unidades requeridas marcar la cantidad cogida
                            </Typography>
                            <Units
                                label={['ud recogida', 'ud recogidas']}
                                units={units}
                                handleOnChange={(units) => {
                                    console.log(units);
                                }}
                            />
                        </div>
                    </IonItem>
                    <IonItemDivider />
                </IonList>
            </IonContent>

            <IonFooter>
                <IonToolbar>
                    <div className={classes.footer}>
                        <IonButton
                            expand="full"
                            onClick={() => {
                                updateProduct({
                                    ...product,
                                    units,
                                });
                                closeModal();
                            }}
                        >
                            Marcar como cogido
                        </IonButton>
                    </div>
                </IonToolbar>
            </IonFooter>
        </>
    );
};

export default ProductDetail;
