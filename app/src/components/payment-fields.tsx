import * as React from 'react';
import {createUseStyles} from 'react-jss';
import {palette, Typography} from '@kiwi/ui';

const useStyles = createUseStyles(() => ({
    feeZone: {
        padding: 16,
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gridGap: 8,
        '& > p': {
            justifySelf: 'flex-end',
        },
        alignItems: 'center',
    },
    feeDiscount: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignSelf: 'flex-end',
    },
}));

type Props = {
    deliverFee: number;
    finalDeliverFee: number;
    shopperFee: number;
    finalShopperFee: number;
    totalShoppingCart: number;
    totalCost: number;
    deliveryDiscount: number;
};

const PaymentFooter = ({
    deliverFee,
    finalDeliverFee,
    shopperFee,
    finalShopperFee,
    totalShoppingCart,
    totalCost,
    deliveryDiscount,
}: Props) => {
    const classes = useStyles();

    return (
        <div className={classes.feeZone}>
            <Typography variant="subtitle2">Carrito</Typography>
            <Typography variant="body1">{totalShoppingCart}€</Typography>
            <div>
                <Typography variant="subtitle2">Personal shopper</Typography>
                {!!deliveryDiscount && (
                    <>
                        &nbsp;
                        <Typography variant="subtitle2" color={palette.primary.dark}>
                            {`(${deliveryDiscount * 100}% descuento early adopter)`}
                        </Typography>
                    </>
                )}
            </div>
            <div className={classes.feeDiscount}>
                <Typography variant="body1">{finalShopperFee}€</Typography>
                {!!deliveryDiscount && (
                    <>
                        &nbsp;
                        <Typography variant="body1" style={{textDecoration: 'line-through'}}>
                            {shopperFee} €
                        </Typography>
                    </>
                )}
            </div>
            <div>
                <Typography variant="subtitle2">Envío a domicilio</Typography>
                {!!deliveryDiscount && (
                    <>
                        &nbsp;
                        <Typography variant="subtitle2" color={palette.primary.dark}>
                            {`(${deliveryDiscount * 100}% descuento early adopter)`}
                        </Typography>
                    </>
                )}
            </div>
            <div className={classes.feeDiscount}>
                <Typography variant="body1">{finalDeliverFee}€</Typography>
                {!!deliveryDiscount && (
                    <>
                        &nbsp;
                        <Typography variant="body1" style={{textDecoration: 'line-through'}}>
                            {deliverFee} €
                        </Typography>
                    </>
                )}
            </div>
            <Typography variant="subtitle2">Total</Typography>
            <Typography variant="caption1">{totalCost}€</Typography>
        </div>
    );
};

export default PaymentFooter;
