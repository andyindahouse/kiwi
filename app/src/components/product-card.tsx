import {addCircleSharp, removeCircleSharp, pricetag} from 'ionicons/icons';
import * as React from 'react';
import {createUseStyles, useTheme} from 'react-jss';
import {IonIcon} from '@ionic/react';
import {Product} from '@kiwi/models';
import {IonSpinner} from '@ionic/react';
import {Typography, palette} from '@kiwi/ui';
import {getLabelDiscount} from '../utils';

const useStyles = createUseStyles(() => ({
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
        backgroundColor: ({theme}) => theme.palette.primary.main,
        borderRadius: 32,
        display: 'flex',
        alignItems: 'center',
        marginTop: 4,
    },
    unitsText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 500,
        padding: '0px 4px',
        textAlign: 'center',
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

type UnitsButtonProps = {
    isUnitSaleType: boolean;
    initialUnits: number;
    updateUnits: (units: number) => void;
}

const UnitsButton = ({
    isUnitSaleType,
    initialUnits,
    updateUnits,
}: UnitsButtonProps) => {
    const theme = useTheme();
    const classes = useStyles({theme});
    const [units, setUnits] = React.useState(initialUnits);
    const [openUnits, setOpenUnits] = React.useState(false);
    const [showSpinner, setShowSpinner] = React.useState(false);
    const timerTimeOutRef = React.useRef<number | null>(null);
    const spinnerTimeOutRef = React.useRef<number | null>(null);
    const unit = isUnitSaleType ? 1 : 100;

    React.useEffect(() => {
        setUnits(initialUnits);
    }, [initialUnits]);

    React.useEffect(() => {
        if (openUnits) {
            setShowSpinner(false);
            spinnerTimeOutRef.current && clearTimeout(spinnerTimeOutRef.current);
            timerTimeOutRef.current && clearTimeout(timerTimeOutRef.current);

            spinnerTimeOutRef.current = window.setTimeout(() => {
                setShowSpinner(true);
            }, 3000);

            timerTimeOutRef.current = window.setTimeout(() => {
                updateUnits(units);
                setShowSpinner(false);
                setOpenUnits(false);
            }, 5000);
        }

        return () => {
            spinnerTimeOutRef.current && clearTimeout(spinnerTimeOutRef.current);
            timerTimeOutRef.current && clearTimeout(timerTimeOutRef.current);
        };
    }, [units, openUnits, updateUnits]);

    return (
        <div
            className={classes.units}
            style={{
                left: openUnits ? '0' : 'unset',
                width: !openUnits && units === 0 ? 32 : 'unset',
                padding: openUnits || units === 0 ? 0 : 'unset',
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
                            setUnits(units - unit);
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
                    >{`${units} ${isUnitSaleType ? 'ud' : 'gr'}`}</p>
                ))}
            {(units === 0 || openUnits) && (
                <IonIcon
                    className={classes.icon}
                    icon={addCircleSharp}
                    onClick={() => {
                        setOpenUnits(true);
                        setUnits(units + unit);
                    }}
                />
            )}
        </div>
    );
};

const GrButton = ({initialGr, updateGr}: {initialGr: number; updateGr: (units: number) => void}) => {
    const theme = useTheme();
    const classes = useStyles({theme});
    const [gr, setGr] = React.useState(initialGr);
    const [openUnits, setOpenUnits] = React.useState(false);
    const [showSpinner, setShowSpinner] = React.useState(false);
    const timerTimeOutRef = React.useRef<number | null>(null);
    const spinnerTimeOutRef = React.useRef<number | null>(null);
    const increment = React.useEffect(() => {
        setGr(initialGr);
    }, [initialGr]);

    React.useEffect(() => {
        if (openUnits) {
            setShowSpinner(false);
            spinnerTimeOutRef.current && clearTimeout(spinnerTimeOutRef.current);
            timerTimeOutRef.current && clearTimeout(timerTimeOutRef.current);

            spinnerTimeOutRef.current = window.setTimeout(() => {
                setShowSpinner(true);
            }, 3000);

            timerTimeOutRef.current = window.setTimeout(() => {
                updateGr(gr);
                setShowSpinner(false);
                setOpenUnits(false);
            }, 5000);
        }

        return () => {
            spinnerTimeOutRef.current && clearTimeout(spinnerTimeOutRef.current);
            timerTimeOutRef.current && clearTimeout(timerTimeOutRef.current);
        };
    }, [gr, openUnits, updateGr]);

    return (
        <div
            className={classes.units}
            style={{
                left: openUnits ? '0' : 'unset',
                padding: openUnits || gr === 0 ? 0 : 'unset',
                justifyContent: !openUnits ? 'center' : 'space-between',
            }}
        >
            {openUnits && (
                <IonIcon
                    role="button"
                    className={classes.icon}
                    icon={removeCircleSharp}
                    onClick={() => {
                        if (gr > 0) {
                            setGr(gr - 100);
                        }
                    }}
                />
            )}
            {(gr > 0 || openUnits) &&
                (showSpinner ? (
                    <IonSpinner className={classes.spinner} name="crescent" />
                ) : (
                    <p
                        className={classes.unitsText}
                        onClick={() => {
                            setOpenUnits(true);
                        }}
                    >{`${gr} gr`}</p>
                ))}
            {(gr === 0 || openUnits) && (
                <IonIcon
                    className={classes.icon}
                    icon={addCircleSharp}
                    onClick={() => {
                        setOpenUnits(true);
                        setGr(gr + 100);
                    }}
                />
            )}
        </div>
    );
};

interface Props {
    product: Product;
    handleClickDetail: () => void;
    updateUnits: (units: number) => void;
}

const ProductCard = ({product, handleClickDetail, updateUnits}: Props) => {
    const {name, brand, price, img, units, specialOffer, specialOfferValue, discount, saleType} = product;
    const theme = useTheme();
    const classes = useStyles({theme});
    const isUnitSaleType = saleType === 'unit';

    return (
        <div className={classes.container}>
            <UnitsButton
                isUnitSaleType={isUnitSaleType}
                initialUnits={units}
                updateUnits={(newUnits) => {
                    if (units === 0 && newUnits === 0) {
                        return;
                    }

                    updateUnits(newUnits);
                }}
            />

            <div role="button" onClick={handleClickDetail}>
                <div className={classes.image} style={{backgroundImage: `url(${img})`}}></div>
                <div className={classes.content}>
                    <Typography
                        variant="caption1"
                        gutterBottom={4}
                        {...(discount ? {color: palette.secondary.main} : {})}
                    >
                        {price.final}€{' '}
                        <Typography variant="subtitle2">{isUnitSaleType ? '/ ud' : '/ kg'}</Typography>
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
