import {addCircleSharp} from 'ionicons/icons';
import * as React from 'react';
import {createUseStyles} from 'react-jss';
import {IonIcon} from '@ionic/react';
import {Product} from '../api';

const useStyles = createUseStyles((theme) => ({
    container: {
        background: '#FFFFFF',
        height: 210,
        boxShadow: '0px 2px 9px rgba(0, 0, 0, 0.25)',
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative',
    },
    units: {
        width: 32,
        height: 32,
        top: 0,
        right: 0,
        color: '#EC445A',
        position: 'absolute',
        borderRadius: 32,
        fontSize: 11,
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4,
        marginRight: 4,
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
        fontSize: 14,
        margin: 0,
        marginTop: 4,
        marginBottom: 4,
    },
    price: {
        margin: 0,
        fontWeight: 500,
        '& > small': {
            color: '#92949C',
        },
    },
    subtitle: {
        margin: 0,
        color: '#92949C',
        fontSize: 11,
        fontWeight: 500,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        lineClamp: 1,
        display: 'box',
        boxOrient: 'vertical',
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

    return (
        <div className={classes.container}>
            <IonIcon className={classes.units} icon={addCircleSharp} />
            {/* <div role="button" onClick={() => handleClickCart(units + 1)} className={classes.units}>
                23ud
            </div> */}
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
