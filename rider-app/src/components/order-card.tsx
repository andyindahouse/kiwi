import React from 'react';
import {createUseStyles} from 'react-jss';
import {Order as OrderModel, Product} from '../models';
import Typography from '../components/typography';
import palette from '../theme/palette';
import {IonButton} from '@ionic/react';
import {statusOrderMap} from '../utils';
import {getFormatDate, getFormatTime} from '../utils/format-date';

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
        '& > div': {
            marginLeft: 16,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
        },
    },
    subtitles: {
        display: 'flex',
        flexDirection: 'column',
    },
    paymentSection: {
        background: palette.background.default,
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
    infoOrder: {
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gridGap: 8,
        padding: '8px 16px 16px 16px',
        backgroundColor: palette.background.default,
        alignItems: 'center',
    },
}));

const getTotalItems = (products: ReadonlyArray<Product>) => {
    return products.reduce((value, current) => value + (current.items?.length || 0), 0);
};

type Props = {
    order: OrderModel;
    handleOpen?: () => void;
    handleManageOrder?: () => void;
    labelCta?: string;
};

const OrderCard = ({order, handleOpen, handleManageOrder, labelCta = 'Seleccionar pedido'}: Props) => {
    const classes = useStyles();
    const {totalCost, products, deliveryAddress, deliveryDate, deliveryHour} = order;

    return (
        <div className={classes.container} onClick={handleOpen}>
            <div className={classes.header}>
                <div className={classes.headerText}>
                    <img className={classes.logo} src="./images/eci.jpg" alt="elcroteingles_imagen" />
                    <div>
                        <Typography>Precio total compra: {totalCost}€</Typography>

                        {/* <Typography variant="subtitle2" gutterBottom={4}>
                            Fecha de entrega: {deliveryDate && getFormatDate(new Date(deliveryDate))}
                        </Typography>
                        <Typography variant="subtitle2">
                           Hora de entrega: {deliveryHour && getFormatTime(new Date(deliveryHour))}
                        </Typography> */}
                    </div>
                </div>
            </div>

            <div className={classes.infoOrder}>
                <Typography variant="subtitle2">Estado</Typography>
                <Typography style={{color: statusOrderMap[order.status].color}} variant="body2">
                    {statusOrderMap[order.status].label}
                </Typography>
                <Typography variant="subtitle2">Supermercado</Typography>
                <Typography variant="body2">El Corte Inglés Supermercado</Typography>
                <Typography variant="subtitle2">Cliente</Typography>
                <Typography variant="body2">Daniel Caldera García</Typography>
                <Typography variant="subtitle2">Dirección de entrega</Typography>
                <Typography variant="body2">{deliveryAddress}</Typography>
                <Typography variant="subtitle2">Teléfono</Typography>
                <Typography variant="body2">666 666 666</Typography>
                <Typography variant="subtitle2">Nº de productos</Typography>
                <Typography variant="body2">{getTotalItems(products)}</Typography>
                {handleManageOrder && (
                    <IonButton
                        size="small"
                        color="secondary"
                        expand="block"
                        style={{gridColumn: '1 / 3'}}
                        onClick={(event) => {
                            event.stopPropagation();
                            event.preventDefault();
                            handleManageOrder && handleManageOrder();
                        }}
                    >
                        {labelCta}
                    </IonButton>
                )}
            </div>
        </div>
    );
};

export default OrderCard;
