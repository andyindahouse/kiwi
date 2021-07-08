import {addCircleSharp, removeCircleSharp} from 'ionicons/icons';
import * as React from 'react';
import {Typography, createUseStyles} from '@kiwi/ui';
import {IonIcon, IonSpinner} from '@ionic/react';
import {Product} from '@kiwi/models/rider';

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
    content: {
        padding: 8,
    },
    image: {
        height: 100,
        backgroundSize: 'cover',
    },
    name: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        lineClamp: 3,
        display: 'box',
        boxOrient: 'vertical',
    },
    price: {
        fontWeight: 600,
    },
    subtitle: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        lineClamp: 1,
        display: 'box',
        boxOrient: 'vertical',
    },
    spinner: {
        width: 24,
        height: 24,
        color: 'white',
    },
}));

interface Props {
    product: Product;
    handleClickDetail: () => void;
    updateUnits: (units: number) => void;
}

const ProductCard = ({product, handleClickDetail, updateUnits}: Props) => {
    const {name, price, img, units: initialUnits} = product;
    const classes = useStyles();
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
                updateUnits(units);
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
                    <Typography className={classes.price}>
                        {price.final}€ <Typography variant="subtitle2"> / ud</Typography>
                    </Typography>
                    <Typography variant="body2" gutterBottom={4} className={classes.name}>
                        {name}
                    </Typography>
                    <Typography variant="subtitle2" className={classes.subtitle}>
                        PROMO
                    </Typography>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
