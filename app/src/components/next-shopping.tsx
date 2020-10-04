import React from 'react';
import {createUseStyles} from 'react-jss';
import {IonIcon, IonList} from '@ionic/react';
import {cartOutline} from 'ionicons/icons';
import Typography from '../components/typography';
import palette from '../theme/palette';
import ProductItem from '../components/product-item';
import {useShoppingCart} from '../contexts/shopping-cart';
import {Product} from '../models';
import Box from './box';

const useStyles = createUseStyles((theme) => ({
    container: {
        margin: '32px 0px',
    },
    title: {
        padding: 16,
        display: 'flex',
        alignItems: 'center',
        marginBottom: 16,
        '& > h3': {
            marginLeft: 8,
        },
    },
    list: {
        '& > div': {
            marginBottom: 16,
        },
    },
    card: {
        display: 'grid',
        gridTemplateColumns: '80px 1fr 80px',
        gridGap: 8,
    },
    name: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        lineClamp: 2,
        display: 'box',
        boxOrient: 'vertical',
    },

    date: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        '& > h3': {
            color: palette.warning.dark,
        },
    },
}));

const NextShopping = () => {
    const classes = useStyles();
    const {products} = useShoppingCart();

    return (
        <div className={classes.container}>
            <div className={classes.title}>
                <IonIcon color="primary" size="large" icon={cartOutline} />
                <Typography variant="h3">Tu próxima compra</Typography>
            </div>

            {products.length === 0 ? (
                <Box>
                    <Typography>Ahora mismo no tienes productos en tu despensa</Typography>
                </Box>
            ) : (
                <div className={classes.list}>
                    <IonList>
                        {products.map((product) => {
                            const {name, price, img, brand} = product;
                            const getUnits = (product: Product) => product.units ?? product.items?.length;
                            return (
                                <ProductItem
                                    key={product.id}
                                    img={img}
                                    title={name.replace(brand, '').trim()}
                                    subtitle={`${getUnits(product)} ud x ${price.final}€ / ud`}
                                    handleClickDetail={() => console.log()}
                                >
                                    <div>
                                        <Typography color={palette.secondary.main} variant="caption1">
                                            {(getUnits(product) * Number(price.final)).toFixed(2)}€
                                        </Typography>
                                    </div>
                                </ProductItem>
                            );
                        })}
                    </IonList>
                </div>
            )}
        </div>
    );
};

export default NextShopping;
