import * as React from 'react';
import {Typography, createUseStyles} from '@kiwi/ui';
import {IonItem} from '@ionic/react';
import {Product} from '@kiwi/models';
import {getCostSubtitle} from '@kiwi/utils';

const useStyles = createUseStyles(() => ({
    card: {
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '64px 1fr auto',
        gridGap: 8,
        alignItems: 'center',
    },
    img: {
        width: 64,
    },
}));

type Props = {
    product: Product;
    handleClickDetail: () => void;
};

const ProductItem = ({product, handleClickDetail}: Props) => {
    const {name, price, img} = product;
    const classes = useStyles();
    return (
        <IonItem onClick={handleClickDetail}>
            <div className={classes.card}>
                <img className={classes.img} alt="product" src={img} />
                <div>
                    <Typography ellipsis lineClamp={2}>
                        {name}
                    </Typography>
                    <Typography variant="subtitle2">{getCostSubtitle(product)}</Typography>
                </div>
                <Typography variant="h5">{price.final}€</Typography>
            </div>
        </IonItem>
    );
};

export default ProductItem;
