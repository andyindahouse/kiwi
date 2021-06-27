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
import {addCircleSharp, alertCircleOutline, pricetag, removeCircleSharp} from 'ionicons/icons';
import * as React from 'react';
import {createUseStyles} from 'react-jss';
import {Product} from '@kiwi/models';
import {palette, Typography} from '@kiwi/ui';
import {getLabelDiscount, getUnitPriceWithOffer} from '../utils';
import ChartistGraph from './chartist-graph';
import classnames from 'classnames';

const novaMap = {
    '1': {
        label: 'No procesado o mínimamente procesado',
        color: '#01AA00',
    },
    '2': {
        label: 'Ingrediente culinario procesado',
        color: '#FFCC01',
    },
    '3': {
        label: 'Alimento procesado',
        color: '#FF6601',
    },
    '4': {
        label: 'Alimento ultraprocesado',
        color: '#FF0000',
    },
};

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
        padding: (paddingSides) => (!paddingSides ? '16px 0' : 16),
    },
    sectionTitle: {
        padding: (paddingSides) => (!paddingSides ? '0 16px' : 0),
    },
    jsfe: {
        justifySelf: 'flex-end',
    },
    discountSection: {
        marginTop: 16,
        display: 'flex',
        alignItems: 'center',
    },
    novaContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    nova: {
        borderRadius: 8,
        backgroundColor: (value: '1' | '2' | '3' | '4') => novaMap[value]?.color,
        color: 'white',
        width: 48,
        height: 48,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 32,
        fontWeight: 600,
    },
    nutriScoreContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    nutriScoreBar: {
        display: 'flex',
        alignItems: 'center',
    },
    letter: {
        width: 32,
        height: 32,
        fontSize: 16,
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    nutriA: {
        backgroundColor: '#048141',
        color: '#84BC9D',
        borderRadius: '8px 0 0 8px',
    },
    nutriB: {
        backgroundColor: '#85BB2F',
        color: '#BEDA98',
    },
    nutriC: {
        backgroundColor: '#FECB02',
        color: '#FEE291',
    },
    nutriD: {
        backgroundColor: '#EE8101',
        color: '#F5BB8B',
    },
    nutriE: {
        backgroundColor: '#E63E11',
        color: '#F19B8B',
        borderRadius: ' 0 8px 8px 0',
    },
    selected: {
        width: 64,
        height: 64,
        fontSize: 32,
        borderRadius: 16,
        color: 'white',
    },
    availableIcon: {
        width: 16,
        height: 16,
        color: palette.secondary.main,
        marginRight: 8,
    },
}));

type SectionProps = {
    title: string;
    children: React.ReactNode;
    paddingSides?: boolean;
};

const Section = ({title, paddingSides, children}: SectionProps) => {
    const classes = useStyles(paddingSides);

    return (
        <div className={classes.section}>
            <Typography className={classes.sectionTitle} variant="h3" gutterBottom={8}>
                {title}
            </Typography>
            {children}
        </div>
    );
};

const NovaGroup = ({value}: {value: '1' | '2' | '3' | '4'}) => {
    const classes = useStyles(value);
    return (
        <div className={classes.novaContainer}>
            <Typography>{novaMap[value].label}</Typography>
            <div>
                <Typography variant="caption2">NOVA</Typography>
                <div className={classes.nova}>{value}</div>
            </div>
        </div>
    );
};

const NutriScoreBar = ({value}: {value: 'a' | 'b' | 'c' | 'd' | 'e'}) => {
    const classes = useStyles();
    return (
        <div className={classes.nutriScoreContainer}>
            <Typography variant="caption2">NUTRI-SCORE</Typography>
            <Typography variant="subtitle2" center gutterBottom={8}>
                Grado determinado por la cantidad de nutrientes saludables y no saludables
            </Typography>
            <div className={classes.nutriScoreBar}>
                <div
                    className={classnames(classes.letter, classes.nutriA, {
                        [classes.selected]: value === 'a',
                    })}
                >
                    A
                </div>
                <div
                    className={classnames(classes.letter, classes.nutriB, {
                        [classes.selected]: value === 'b',
                    })}
                >
                    B
                </div>
                <div
                    className={classnames(classes.letter, classes.nutriC, {
                        [classes.selected]: value === 'c',
                    })}
                >
                    C
                </div>
                <div
                    className={classnames(classes.letter, classes.nutriD, {
                        [classes.selected]: value === 'd',
                    })}
                >
                    D
                </div>
                <div
                    className={classnames(classes.letter, classes.nutriE, {
                        [classes.selected]: value === 'e',
                    })}
                >
                    E
                </div>
            </div>
        </div>
    );
};

const getDiscountPercentage = (original: string, final: string) => {
    return Math.abs((Number(final) / Number(original)) * 100 - 100).toFixed(2);
};

interface Props {
    product: Product;
    updateProduct?: (product: Product) => void;
    closeModal: () => void;
    showChart: boolean;
    disabled?: boolean;
}

const ProductDetail = ({product, closeModal, updateProduct, disabled = false, showChart}: Props) => {
    const classes = useStyles();
    const {
        name,
        price,
        img,
        brand,
        units: initialUnits,
        discount,
        specialOffer,
        specialOfferValue,
        nutriments,
        nutriscoreGrade,
        novaGroups,
        available,
        updateDate,
    } = product;
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
                        {!!initialUnits && (
                            <div className={classes.units}>
                                <Typography variant="h3">{units}&nbsp;ud</Typography>
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
                    <Typography variant="h1" {...(discount ? {color: palette.secondary.main} : {})}>
                        {price.final} € <Typography variant="subtitle1">/ ud</Typography>
                    </Typography>

                    {discount && price.original && (
                        <div className={classes.discountSection}>
                            <IonIcon icon={pricetag} className={classes.discountIcon} />
                            <Typography variant="h3" style={{textDecoration: 'line-through', marginRight: 8}}>
                                {price.original} €
                            </Typography>
                            <Typography color={palette.secondary.main}>
                                (rebajado un {getDiscountPercentage(price.original, price.final)}%)
                            </Typography>
                        </div>
                    )}

                    {specialOffer && specialOfferValue && price.final && (
                        <div className={classes.discountSection}>
                            <IonIcon icon={pricetag} className={classes.discountIcon} />
                            <Typography variant="h3" color={palette.secondary.main} style={{marginRight: 8}}>
                                {getLabelDiscount(specialOffer, specialOfferValue)}
                            </Typography>
                            <Typography>
                                {`(La unidad te saldría a ${getUnitPriceWithOffer(
                                    price.final,
                                    specialOffer,
                                    specialOfferValue
                                )} €)`}
                            </Typography>
                        </div>
                    )}
                    <Typography className={classes.discountSection} variant="subtitle2">
                        Información actualizada el {new Date(updateDate).toLocaleDateString()}
                    </Typography>
                    {!available && (
                        <div className={classes.discountSection}>
                            <IonIcon icon={alertCircleOutline} className={classes.availableIcon} />
                            <Typography variant="subtitle2" color={palette.tertiary.main}>
                                Este producto ya no está disponible
                            </Typography>
                        </div>
                    )}
                </div>

                {(nutriscoreGrade || novaGroups) && (
                    <Section title="Observaciones" paddingSides>
                        {novaGroups && <NovaGroup value={novaGroups} />}
                        {nutriscoreGrade && <NutriScoreBar value={nutriscoreGrade} />}
                    </Section>
                )}

                {nutriments && (
                    <Section title="Información nutricional">
                        <>
                            <div className={classes.nutriments}>
                                <div></div>
                                <Typography variant="subtitle1" className={classes.jsfe}>
                                    por {nutriments.nutritionDataPer}g
                                </Typography>
                                <Typography variant="subtitle1">Valor energético</Typography>
                                <Typography variant="caption1" className={classes.jsfe}>
                                    {nutriments.energyKcal100g}kcal
                                </Typography>
                                <Typography variant="subtitle1">Grasas</Typography>
                                <Typography variant="caption1" className={classes.jsfe}>
                                    {nutriments.fat100g}g
                                </Typography>
                                <Typography variant="subtitle1" className={classes.ml}>
                                    de las cuales saturadas
                                </Typography>
                                <Typography variant="caption1" className={classes.jsfe}>
                                    {nutriments.saturedFat100g}g
                                </Typography>
                                <Typography variant="subtitle1">Hidratos de carbono</Typography>
                                <Typography variant="caption1" className={classes.jsfe}>
                                    {nutriments.carbohydrates100g}g
                                </Typography>
                                <Typography variant="subtitle1" className={classes.ml}>
                                    de los cuales azúcares
                                </Typography>
                                <Typography variant="caption1" className={classes.jsfe}>
                                    {nutriments.sugar100g}g
                                </Typography>
                                <Typography variant="subtitle1">Proteínas</Typography>
                                <Typography variant="caption1" className={classes.jsfe}>
                                    {nutriments.proteins100g}g
                                </Typography>
                                <Typography variant="subtitle1">Sal</Typography>
                                <Typography variant="caption1" className={classes.jsfe}>
                                    {nutriments.salt100g}g
                                </Typography>
                            </div>
                        </>
                    </Section>
                )}

                {nutriments && showChart && (
                    <Section title="Macronutrientes">
                        <ChartistGraph
                            series={{
                                proteins: nutriments.proteins100g,
                                fat: nutriments.fat100g,
                                carboHydrates: nutriments.carbohydrates100g,
                            }}
                        />
                    </Section>
                )}
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
        </>
    );
};

export default ProductDetail;
