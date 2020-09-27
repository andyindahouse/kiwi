import {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonFooter,
    IonIcon,
    useIonViewDidEnter,
    IonPage,
} from '@ionic/react';
import {addCircleSharp, pricetag, removeCircleSharp} from 'ionicons/icons';
import * as React from 'react';
import {createUseStyles} from 'react-jss';
import {Product, SpecialOffers} from '../models';
import palette from '../theme/palette';
import {getLabelDiscount} from '../utils';
import ChartistGraph from './chartist-graph';
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
    units: {
        padding: 8,
        backgroundColor: palette.primary.main,
        position: 'absolute',
        right: 5,
        bottom: 5,
        height: 64,
        width: 64,
        borderRadius: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    nutriments: {
        padding: '0 32px',
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
    icon: {
        color: palette.secondary.contrastText,
    },
    discountIcon: {
        width: 32,
        height: 32,
        color: palette.secondary.main,
        marginRight: 8,
    },
    footer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: palette.secondary.main,
    },
    nameProduct: {
        '&::first-letter': {
            textTransform: 'uppercase',
        },
    },
    section: {
        padding: '16px 0',
    },
    sectionTitle: {
        padding: '0 16px',
    },
    jsfe: {
        justifySelf: 'flex-end',
    },
    discountSection: {
        display: 'flex',
        alignItems: 'center',
    },
}));

type SectionProps = {
    title: string;
    children: React.ReactNode;
};

const Section = ({title, children}: SectionProps) => {
    const classes = useStyles();

    return (
        <div className={classes.section}>
            <Typography className={classes.sectionTitle} variant="h3" gutterBottom={8}>
                {title}
            </Typography>
            {children}
        </div>
    );
};

const getDiscountPercentage = (original: string, final: string) => {
    return Math.abs((Number(final) / Number(original)) * 100 - 100);
};

interface Props {
    product: Product;
    updateProduct?: (product: Product) => void;
    closeModal: () => void;
    disabled?: boolean;
    viewDidEnter?: boolean;
}

const ProductDetail = ({product, closeModal, updateProduct, disabled = false, viewDidEnter}: Props) => {
    const classes = useStyles();
    const {
        name,
        price,
        img,
        brand,
        units: initialUnits,
        nutriments,
        discount,
        specialOffer,
        specialOfferValue,
    } = product;
    const [units, setUnits] = React.useState(initialUnits ? initialUnits : 1);
    const loadedModal = React.useRef(false);

    useIonViewDidEnter(() => {
        console.log('first effect', loadedModal.current);
        loadedModal.current = true;
    }, []);

    return (
        <IonPage>
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
                        {!!initialUnits && (
                            <div className={classes.units}>
                                <Typography variant="h3">{units} ud</Typography>
                            </div>
                        )}
                    </div>
                </div>
                <div className={classes.container}>
                    <Typography variant="subtitle1" gutterBottom={8}>
                        {brand}
                    </Typography>
                    <Typography className={classes.nameProduct} variant="h3" gutterBottom={8}>
                        {name.replace(brand, '').trim()}
                    </Typography>
                    <Typography
                        variant="h1"
                        gutterBottom={16}
                        {...(discount ? {color: palette.secondary.main} : {})}
                    >
                        {price.final} € <Typography variant="subtitle1">/ ud</Typography>
                    </Typography>

                    {discount && price.original && (
                        <div className={classes.discountSection}>
                            <IonIcon icon={pricetag} className={classes.discountIcon} />
                            <Typography variant="h3" style={{textDecoration: 'line-through', marginRight: 8}}>
                                {price.original}
                            </Typography>
                            <Typography color={palette.secondary.main}>
                                (rebajado un {getDiscountPercentage(price.original, price.final)}%)
                            </Typography>
                        </div>
                    )}

                    {specialOffer && specialOfferValue && (
                        <div className={classes.discountSection}>
                            <IonIcon icon={pricetag} className={classes.discountIcon} />
                            <Typography variant="h3" color={palette.secondary.main} style={{marginRight: 8}}>
                                {getLabelDiscount(specialOffer, specialOfferValue)}
                            </Typography>
                            <Typography>(La unidad te sale a 1,77 €)</Typography>
                        </div>
                    )}
                </div>

                <Section title="Información nutricional">
                    <>
                        <div className={classes.nutriments}>
                            <div></div>
                            <Typography variant="subtitle1" className={classes.jsfe}>
                                por {nutriments.nutritionDataPer}
                            </Typography>
                            <Typography variant="subtitle1">Valor energético</Typography>
                            <Typography variant="caption1" className={classes.jsfe}>
                                {nutriments.energyKcal100g}
                            </Typography>
                            <Typography variant="subtitle1">Grasas</Typography>
                            <Typography variant="caption1" className={classes.jsfe}>
                                {nutriments.fat100g}
                            </Typography>
                            <Typography variant="subtitle1" className={classes.ml}>
                                de las cuales saturadas
                            </Typography>
                            <Typography variant="caption1" className={classes.jsfe}>
                                {nutriments.saturedFat100g}
                            </Typography>
                            <Typography variant="subtitle1">Hidratos de carbono</Typography>
                            <Typography variant="caption1" className={classes.jsfe}>
                                {nutriments.carbohydrates100g}
                            </Typography>
                            <Typography variant="subtitle1" className={classes.ml}>
                                de los cuales azúcares
                            </Typography>
                            <Typography variant="caption1" className={classes.jsfe}>
                                {nutriments.sugar100g}
                            </Typography>
                            <Typography variant="subtitle1">Proteínas</Typography>
                            <Typography variant="caption1" className={classes.jsfe}>
                                {nutriments.proteins100g}
                            </Typography>
                            <Typography variant="subtitle1">Sal</Typography>
                            <Typography variant="caption1" className={classes.jsfe}>
                                {nutriments.salt100g}
                            </Typography>
                        </div>
                    </>
                </Section>

                <Section title="Macronutrientes">
                    <ChartistGraph
                        series={{
                            proteins: 30,
                            fat: 20,
                            carboHydrates: 50,
                        }}
                    />
                </Section>
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
                                color="secondary"
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
        </IonPage>
    );
};

export default ProductDetail;
