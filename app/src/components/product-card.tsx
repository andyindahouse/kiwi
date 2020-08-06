import {addCircleSharp, removeCircleSharp} from 'ionicons/icons';
import * as React from 'react';
import {createUseStyles, useTheme} from 'react-jss';
import {IonIcon} from '@ionic/react';
import {Product} from '../models';
import {IonSpinner} from '@ionic/react';
import Typography from './typography';

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
    handleClickDetail: () => void;
    updateShopping: (type: 'addProduct' | 'removeProduct') => void;
    units: number;
}

const ProductCard = ({
    name,
    price,
    img,
    id,
    ean,
    discount,
    handleClickDetail,
    updateShopping,
}: Props & Product) => {
    const theme = useTheme();
    const classes = useStyles({theme});
    const [units, setUnits] = React.useState(0);
    const [openUnits, setOpenUnits] = React.useState(false);
    const [showSpinner, setShowSpinner] = React.useState(false);

    React.useEffect(() => {
        let timer: any;
        let spinner: any;
        if (openUnits) {
            spinner = window.setTimeout(() => {
                setShowSpinner(true);
            }, 3000);
            timer = window.setTimeout(() => {
                setShowSpinner(false);
                setOpenUnits(false);
            }, 5000);
        }

        return () => {
            clearTimeout(timer);
            clearTimeout(spinner);
        };
    }, [openUnits]);

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
                                updateShopping('removeProduct');
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
                            updateShopping('addProduct');
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
                        Ud 100 gramos
                    </Typography>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
