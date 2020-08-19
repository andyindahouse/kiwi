import {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonFooter,
    IonIcon,
} from '@ionic/react';
import {addCircleSharp, removeCircleSharp} from 'ionicons/icons';
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
        height: 325,
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
    nutriments: {
        display: 'grid',
        gridTemplateColumns: '1fr 100px',
        gridGap: 8,
        alignItems: 'center',
        '& > p': {
            margin: 0,
        },
    },
    ml: {
        marginLeft: 16,
    },
    icon: {},
    footer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    nameProduct: {
        '&::first-letter': {
            textTransform: 'uppercase',
        },
    },
}));

interface Props {
    product: Product;
    updateProduct?: (product: Product) => void;
    closeModal: () => void;
    disabled?: boolean;
}

const ProductDetail = ({product, closeModal, updateProduct, disabled = false}: Props) => {
    const classes = useStyles();
    const {name, price, img, brand, units: initialUnits, nutriments} = product;
    console.log('initial units', initialUnits);
    const [units, setUnits] = React.useState(initialUnits ? initialUnits : 1);

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
                    <Typography className={classes.nameProduct} variant="h3" gutterBottom={16}>
                        {name.replace(brand, '').trim()}
                    </Typography>

                    <Typography gutterBottom={16}>
                        Información nutricional: (por {nutriments.nutritionDataPer})
                    </Typography>
                    <div className={classes.nutriments}>
                        <Typography variant="subtitle1">Valor energético</Typography>
                        <Typography>{nutriments.energyKcal100g}</Typography>
                        <Typography variant="subtitle1">Grasas</Typography>
                        <Typography>{nutriments.fat100g}</Typography>
                        <Typography variant="subtitle1" className={classes.ml}>
                            de las cuales saturadas
                        </Typography>
                        <Typography>{nutriments.saturedFat100g}</Typography>
                        <Typography variant="subtitle1">Hidratos de carbono</Typography>
                        <Typography>{nutriments.carbohydrates100g}</Typography>
                        <Typography variant="subtitle1" className={classes.ml}>
                            de los cuales azúcares
                        </Typography>
                        <Typography>{nutriments.sugar100g}</Typography>
                        <Typography variant="subtitle1">Proteínas</Typography>
                        <Typography>{nutriments.proteins100g}</Typography>
                        <Typography variant="subtitle1">Sal</Typography>
                        <Typography>{nutriments.salt100g}</Typography>
                    </div>
                </div>
            </IonContent>
            {updateProduct && !disabled && (
                <IonFooter>
                    <IonToolbar>
                        <div className={classes.footer}>
                            <IonIcon
                                size="large"
                                role="button"
                                className={classes.icon}
                                icon={removeCircleSharp}
                                onClick={() => {
                                    if (units > 0) {
                                        setUnits(units - 1);
                                    }
                                }}
                            />
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
                                {initialUnits === 0
                                    ? units === 0
                                        ? 'Añadir unidad'
                                        : `Añadir ${units} unidades`
                                    : units === 0
                                    ? 'Borrar producto'
                                    : `Actualizar unidades (${units})`}
                            </IonButton>
                            <IonIcon
                                size="large"
                                role="button"
                                className={classes.icon}
                                icon={addCircleSharp}
                                onClick={() => {
                                    setUnits(units + 1);
                                }}
                            />
                        </div>
                    </IonToolbar>
                </IonFooter>
            )}
        </>
    );
};

export default ProductDetail;
