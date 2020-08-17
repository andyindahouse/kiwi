import * as React from 'react';
import {createUseStyles} from 'react-jss';
import {documentTextOutline, trashOutline} from 'ionicons/icons';
import {IonIcon, IonItemSliding, IonItem, IonItemOptions, IonItemOption} from '@ionic/react';
import {Product} from '../models';
import Typography from '../components/typography';

const useStyles = createUseStyles(() => ({
    card: {
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '40px 1fr auto',
        gridGap: 8,
        alignItems: 'center',
    },
    img: {
        width: 40,
    },
}));

type Props = {
    product: Product;
    handleClickDetail: () => void;
    handleAddNote: () => void;
    handleRemoveProduct: (product: Product) => void;
    disabled?: boolean;
};

const getUnits = (product: Product) => product.units ?? product.items?.length;

const ProductItem = ({
    product,
    handleClickDetail,
    handleAddNote,
    handleRemoveProduct,
    disabled = false,
}: Props) => {
    const {name, units, price, img} = product;
    const classes = useStyles();
    return (
        <IonItemSliding id="item100" disabled={disabled}>
            <IonItem onClick={handleClickDetail}>
                <div className={classes.card}>
                    <img className={classes.img} alt="product" src={img} />
                    <div>
                        <Typography ellipsis lineClamp={2}>
                            {name}
                        </Typography>
                        <Typography variant="subtitle2">
                            {getUnits(product)}ud x {price.final}€
                        </Typography>
                    </div>
                    <Typography variant="h5">{price.final}€</Typography>
                </div>
            </IonItem>

            <IonItemOptions side="end">
                <IonItemOption onClick={handleAddNote}>
                    <IonIcon slot="icon-only" icon={documentTextOutline} />
                </IonItemOption>
                <IonItemOption color="danger" onClick={() => handleRemoveProduct(product)}>
                    <IonIcon slot="icon-only" icon={trashOutline} />
                </IonItemOption>
            </IonItemOptions>
        </IonItemSliding>
    );
};

export default ProductItem;
