import React from 'react';
import {Typography, Box, createUseStyles, useTheme} from '@kiwi/ui';
import {IonIcon, IonList} from '@ionic/react';
import {cartOutline} from 'ionicons/icons';
import ProductItem from '../components/product-item';
import {useShoppingCart} from '../contexts/shopping-cart';
import {Product} from '../models';
import {Link} from 'react-router-dom';

const useStyles = createUseStyles(({palette}) => ({
    container: {
        margin: '32px 0px',
    },
    title: {
        padding: '16px 16px 0 16px',
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
    const {palette} = useTheme();
    const {products} = useShoppingCart();

    return (
        <div className={classes.container}>
            <div className={classes.title}>
                <IonIcon color="primary" size="large" icon={cartOutline} />
                <Typography variant="h3">Tu próxima compra</Typography>
            </div>

            {products.length === 0 ? (
                <Box>
                    <Typography>Ahora mismo no tienes productos en tu carrito</Typography>
                </Box>
            ) : (
                <div className={classes.list}>
                    <IonList>
                        {products.slice(0, 5).map((product) => {
                            const {name, price, img} = product;
                            const getUnits = (product: Product) => product.units ?? product.items?.length;
                            return (
                                <ProductItem
                                    key={product.id}
                                    img={img}
                                    title={name}
                                    subtitle={`${getUnits(product)} ud x ${price.final}€ / ud`}
                                    handleClickDetail={() => console.log()}
                                    showAlertIcon={!product.available}
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
                    <Box>
                        <Link to="/search/cart">Ver más</Link>
                    </Box>
                </div>
            )}
        </div>
    );
};

export default NextShopping;
