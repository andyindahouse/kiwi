import React from 'react';
import {Typography, createUseStyles, useTheme} from '@kiwi/ui';
import {Order as OrderModel, Product} from '@kiwi/models';
import {IonButton, IonIcon} from '@ionic/react';
import {checkmarkDoneOutline, cartOutline, bicycleOutline, homeOutline} from 'ionicons/icons';
import classnames from 'classnames';
import {useStatusOrderMap} from '../utils';
import PaymentFooter from './payment-fields';
import {getFormatDate, getFormatTime} from '../utils/format-date';

const useStyles = createUseStyles(({palette}) => ({
    container: {
        boxShadow: 'rgba(0, 0, 0, 0.25) 0px 0px 4px',
        borderRadius: 8,
        overflow: 'hidden',
    },
    header: {
        padding: 16,
    },
    body: {
        background: palette.background.default,
        padding: '8px 16px 16px 16px',
    },
    headerText: {
        display: 'flex',
        marginBottom: 8,
        '& > div': {
            marginLeft: 16,
        },
    },
    subtitles: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        marginBottom: 8,
    },
    paymentSection: {
        background: palette.background.brand,
        padding: '8px 16px 16px 16px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gridGap: 8,
    },
    statusSection: {
        '&:before': {
            content: '""',
            width: 'calc(100% - 40px)',
            height: 4,
            backgroundColor: palette.grey,
            position: 'absolute',
            bottom: 26,
            left: 20,
            zIndex: -1,
        },
        padding: '8px 16px',
        position: 'relative',
        display: 'flex',
        justifyContent: 'space-between',
    },
    iconStatus: {
        padding: 5,
        borderRadius: '50%',
        backgroundColor: palette.grey,
    },
    logo: {
        width: 64,
        height: 64,
    },
    feeSection: {
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gridGap: 16,
        padding: '8px 16px 16px 16px',
        backgroundColor: palette.background.brand,
    },
    feeDiscount: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    expandSection: {
        transition: 'max-height 0.15s ease-out',
        maxHeight: 0,
        overflow: 'hidden',
        '&.open': {
            maxHeight: 500,
            transition: 'max-height 0.25s ease-in',
        },
    },
}));

const IconStatus = ({icon, activated}: {icon: string; activated: boolean}) => {
    const classes = useStyles();
    const {palette} = useTheme();
    return (
        <div
            className={classes.iconStatus}
            style={{
                backgroundColor: activated ? palette.secondary.main : palette.grey,
            }}
        >
            <IonIcon
                size="large"
                icon={icon}
                style={{
                    width: 24,
                    height: 24,
                    color: activated ? palette.primary.main : palette.white,
                }}
            ></IonIcon>
        </div>
    );
};

const getTotalItems = (products: ReadonlyArray<Product>) => {
    return products.reduce((value, current) => value + (current.items?.length || 0), 0);
};

type Props = {
    order: OrderModel;
    selected: boolean;
    handleOpen: () => void;
    handleManageOrder: () => void;
};

const OrderCard = ({order, selected, handleOpen, handleManageOrder}: Props) => {
    const classes = useStyles();
    const statusOrderMap = useStatusOrderMap();
    const {
        totalCost,
        products,
        status,
        totalShoppingCart,
        shopperFee,
        deliveryDate,
        deliveryHour,
        deliveryDiscount,
        finalShopperFee,
        finalDeliverFee,
        deliverFee,
    } = order;

    return (
        <div className={classes.container} onClick={handleOpen}>
            <div className={classes.header}>
                <div className={classes.headerText}>
                    <img className={classes.logo} src="./images/eci.jpg" alt="elcroteingles_imagen" />
                    <div>
                        <Typography>El Corte inglés Supermercado</Typography>
                        <Typography variant="subtitle1">{getTotalItems(products)} productos</Typography>
                    </div>
                </div>
                <div className={classes.subtitles}>
                    <Typography variant="subtitle2">Día de entrega:</Typography>
                    <Typography variant="body1">{getFormatDate(deliveryDate)}</Typography>
                    <Typography variant="subtitle2">Hora de entrega:</Typography>
                    <Typography variant="body1">{getFormatTime(deliveryHour)}</Typography>
                </div>
            </div>
            <div className={classes.paymentSection}>
                <div>
                    <Typography variant="subtitle2">Total</Typography>
                    <Typography variant="body2" ellipsis>
                        {totalCost}€
                    </Typography>
                </div>
                <div>
                    <Typography variant="subtitle2">Modo de Pago</Typography>
                    <Typography variant="body2" ellipsis>
                        Efectivo
                    </Typography>
                </div>
                <div>
                    <Typography variant="subtitle2">Estado</Typography>
                    <Typography variant="caption2" ellipsis style={{color: statusOrderMap[status].color}}>
                        {statusOrderMap[status].label}
                    </Typography>
                </div>
            </div>
            <div className={classnames(classes.expandSection, {open: selected})}>
                <div className={classes.statusSection}>
                    <IconStatus icon={checkmarkDoneOutline} activated={status === 'pending'}></IconStatus>
                    <IconStatus icon={cartOutline} activated={status === 'in-progress'}></IconStatus>
                    <IconStatus icon={bicycleOutline} activated={status === 'comming'}></IconStatus>
                    <IconStatus icon={homeOutline} activated={status === 'finalized'}></IconStatus>
                </div>
                <div className={classes.feeSection}>
                    <PaymentFooter
                        totalShoppingCart={totalShoppingCart}
                        deliveryDiscount={deliveryDiscount}
                        deliverFee={deliverFee}
                        finalDeliverFee={finalDeliverFee}
                        shopperFee={shopperFee}
                        finalShopperFee={finalShopperFee}
                        totalCost={totalCost}
                    />
                    <IonButton
                        size="small"
                        expand="block"
                        style={{gridColumn: '1 / 3'}}
                        onClick={handleManageOrder}
                    >
                        Gestionar pedido
                    </IonButton>
                </div>
            </div>
        </div>
    );
};

export default OrderCard;
