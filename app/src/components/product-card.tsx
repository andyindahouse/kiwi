import {addCircleSharp, removeCircleSharp, pricetag} from 'ionicons/icons';
import * as React from 'react';
import {Typography, createUseStyles, useTheme} from '@kiwi/ui';
import {IonIcon, IonSpinner} from '@ionic/react';
import {Product} from '@kiwi/models';
import {getLabelDiscount} from '../utils';

const useStyles = createUseStyles(({palette}) => ({
    container: {
        background: '#FFFFFF',
        height: 210,
        boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.25)',
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative',
    },
    containerUnits: {
        position: 'absolute',
    },
    units: {
        height: 32,
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        backgroundColor: palette.primary.main,
        borderRadius: 32,
        display: 'flex',
        alignItems: 'center',
        marginTop: 4,
    },
    unitsText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 500,
    },
    icon: {
        width: 32,
        height: 32,
        color: 'white',
    },
    discountIcon: {
        width: 16,
        height: 16,
        color: palette.secondary.contrastText,
        marginRight: 4,
    },
    content: {
        padding: 8,
    },
    image: {
        height: 100,
        backgroundSize: 'cover',
    },
    spinner: {
        width: 24,
        height: 24,
        color: 'white',
    },
    footer: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: palette.secondary.main,
        position: 'absolute',
        width: '100%',
        left: '0',
        bottom: '0',
        justifyContent: 'center',
    },
}));

interface Props {
    product: Product;
    handleClickDetail: () => void;
    updateUnits: (units: number) => void;
}

const ProductCard = ({product, handleClickDetail, updateUnits}: Props) => {
    const {name, brand, price, img, units: initialUnits, specialOffer, specialOfferValue, discount} = product;
    const classes = useStyles();
    const {palette} = useTheme();
    const [units, setUnits] = React.useState(initialUnits);
    const [openUnits, setOpenUnits] = React.useState(false);
    const [showSpinner, setShowSpinner] = React.useState(false);
    const timerTimeOutRef = React.useRef<number | null>(null);
    const spinnerTimeOutRef = React.useRef<number | null>(null);

    React.useEffect(() => {
        setUnits(product.units);
    }, [product.units]);

    React.useEffect(() => {
        if (openUnits) {
            setShowSpinner(false);
            spinnerTimeOutRef.current && clearTimeout(spinnerTimeOutRef.current);
            timerTimeOutRef.current && clearTimeout(timerTimeOutRef.current);

            spinnerTimeOutRef.current = window.setTimeout(() => {
                console.log('units', units);
                setShowSpinner(true);
            }, 3000);

            timerTimeOutRef.current = window.setTimeout(() => {
                if (units !== 0) {
                    updateUnits(units);
                }
                setShowSpinner(false);
                setOpenUnits(false);
            }, 5000);
        }

        return () => {
            spinnerTimeOutRef.current && clearTimeout(spinnerTimeOutRef.current);
            timerTimeOutRef.current && clearTimeout(timerTimeOutRef.current);
        };
    }, [openUnits, units, updateUnits]);

    return (
        <div className={classes.container}>
            <div
                className={classes.units}
                style={{
                    left: openUnits ? '0' : 'unset',
                    width: !openUnits ? 32 : 'unset',
                    justifyContent: !openUnits ? 'center' : 'space-between',
                }}
            >
                {openUnits && (
                    <IonIcon
                        role="button"
                        className={classes.icon}
                        icon={removeCircleSharp}
                        onClick={() => {
                            if (units > 0) {
                                setUnits(units - 1);
                            }
                        }}
                    />
                )}
                {(units > 0 || openUnits) &&
                    (showSpinner ? (
                        <IonSpinner className={classes.spinner} name="crescent" />
                    ) : (
                        <p
                            className={classes.unitsText}
                            onClick={() => {
                                setOpenUnits(true);
                            }}
                        >{`${units}ud`}</p>
                    ))}
                {(units === 0 || openUnits) && (
                    <IonIcon
                        className={classes.icon}
                        icon={addCircleSharp}
                        onClick={() => {
                            setOpenUnits(true);
                            setUnits(units + 1);
                        }}
                    />
                )}
            </div>
            <div role="button" onClick={handleClickDetail}>
                <div className={classes.image} style={{backgroundImage: `url(${img})`}}></div>
                <div className={classes.content}>
                    <Typography
                        variant="caption1"
                        gutterBottom={4}
                        {...(discount ? {color: palette.secondary.main} : {})}
                    >
                        {price.final}€ <Typography variant="subtitle2"> / ud</Typography>
                    </Typography>
                    <Typography variant="body2" ellipsis lineClamp={3}>
                        {name.replace(brand, '').trim()}
                    </Typography>
                </div>
                {discount && (
                    <div className={classes.footer}>
                        <IonIcon icon={pricetag} className={classes.discountIcon} />
                        <Typography
                            variant="caption1"
                            color={palette.secondary.contrastText}
                            style={{textDecoration: 'line-through'}}
                        >
                            {price.original} €
                        </Typography>
                    </div>
                )}
                {specialOffer && specialOfferValue && (
                    <div className={classes.footer}>
                        <IonIcon icon={pricetag} className={classes.discountIcon} />
                        <Typography variant="caption1" color={palette.secondary.contrastText}>
                            {getLabelDiscount(specialOffer, specialOfferValue)}
                        </Typography>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
