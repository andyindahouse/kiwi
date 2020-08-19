import React from 'react';
import {createUseStyles} from 'react-jss';
import {Order as OrderModel} from '../models';
import Typography from '../components/typography';
import palette from '../theme/palette';
import {IonButton, IonIcon} from '@ionic/react';
import {checkmarkDoneOutline, cartOutline, bicycleOutline, homeOutline} from 'ionicons/icons';
import classnames from 'classnames';
import {statusOrderMap} from '../utils';

const useStyles = createUseStyles(() => ({
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
        display: 'flex',
        flexDirection: 'column',
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
            height: 2,
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
    },
    feeSection: {
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gridGap: 16,
        padding: '8px 16px 16px 16px',
        backgroundColor: palette.background.brand,
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

const IconStatus = ({icon, activated}: {icon: string | undefined; activated: boolean}) => {
    const classes = useStyles();
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

type Props = {
    order: OrderModel;
    selected: boolean;
    handleOpen: () => void;
    handleManageOrder: () => void;
};

const OrderCard = ({order, selected, handleOpen, handleManageOrder}: Props) => {
    const classes = useStyles();
    const {totalCost, products, status, createdDate, totalShoppingCart, shopperFee, deliverFee} = order;

    return (
        <div className={classes.container} onClick={handleOpen}>
            <div className={classes.header}>
                <div className={classes.headerText}>
                    <img className={classes.logo} src="./images/eci.jpg" alt="elcroteingles_imagen" />
                    <div>
                        <Typography>El Corte inglés Supermercado</Typography>
                        <Typography variant="subtitle1">{products.length} productos</Typography>
                    </div>
                </div>
                <div className={classes.subtitles}>
                    <Typography variant="subtitle2">
                        Creado el: {new Date(createdDate).toLocaleString()}
                    </Typography>
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
                        Bizummmm
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
                    <IconStatus icon={homeOutline} activated={status === 'completed'}></IconStatus>
                </div>
                <div className={classes.feeSection}>
                    <Typography variant="subtitle2">Carrito</Typography>
                    <Typography variant="body2">{totalShoppingCart}€</Typography>
                    <Typography variant="subtitle2">Personal shopper</Typography>
                    <Typography variant="body2">{shopperFee}€</Typography>
                    <Typography variant="subtitle2">Envío a domicilio</Typography>
                    <Typography variant="body2">{deliverFee}€</Typography>
                    <Typography variant="subtitle2">Total</Typography>
                    <Typography variant="body2">{totalCost}€</Typography>
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
