import {addCircleSharp, removeCircleSharp} from 'ionicons/icons';
import * as React from 'react';
import {createUseStyles} from 'react-jss';
import {IonIcon, IonButton} from '@ionic/react';
import {Product} from '../api';
import {IonSpinner} from '@ionic/react';

const useStyles = createUseStyles((theme) => ({
    container: {
        background: '#FFFFFF',
        height: 210,
        boxShadow: '0px 2px 9px rgba(0, 0, 0, 0.25)',
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
        backgroundColor: '#EC445A',
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
        fontSize: 11,
        marginTop: 4,
        marginBottom: 4,
    },
    price: {
        fontWeight: 500,
        '& > small': {
            color: '#92949C',
        },
    },
    subtitle: {
        color: '#92949C',
        fontSize: 11,
        fontWeight: 500,
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
    handleClickCart: (units: number) => void;
    units: number;
}

const ProductCard = ({
    name,
    price,
    img,
    id,
    ean,
    discount,
    units = 0,
    handleClickDetail,
    handleClickCart,
}: Props & Product) => {
    const classes = useStyles();
    const [unitx, setUnitx] = React.useState(0);
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
                            if (unitx > 0) {
                                setUnitx(unitx - 1);
                            }
                        }}
                    />
                )}
                {(unitx > 0 || openUnits) &&
                    (showSpinner ? (
                        <IonSpinner className={classes.spinner} name="crescent" />
                    ) : (
                        <p
                            className={classes.unitsText}
                            onClick={() => {
                                setOpenUnits(true);
                            }}
                        >{`${unitx}ud`}</p>
                    ))}
                {(unitx === 0 || openUnits) && (
                    <IonIcon
                        className={classes.icon}
                        icon={addCircleSharp}
                        onClick={() => {
                            setOpenUnits(true);
                            setUnitx(unitx + 1);
                        }}
                    />
                )}
            </div>
            <div role="button" onClick={handleClickDetail}>
                <div className={classes.image} style={{backgroundImage: `url(${img})`}}></div>
                <div className={classes.content}>
                    <p className={classes.price}>
                        {price.final}€<small> / ud</small>
                    </p>
                    <p className={classes.name}>{name}</p>
                    <p className={classes.subtitle}>Ud 100 gramos</p>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
