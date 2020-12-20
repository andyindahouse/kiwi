import React from 'react';
import {createUseStyles} from 'react-jss';
import {IonIcon, IonList, useIonViewDidEnter} from '@ionic/react';
import {alarmOutline} from 'ionicons/icons';
import Typography from '../components/typography';
import palette from '../theme/palette';
import {PantryProduct} from '../models';
import ProductItem, {ProductListItemSkeleton} from '../components/product-item';
import {getExpiryObj} from '../utils';
import {getFormatDate} from '../utils/format-date';
import kiwiApi from '../api';
import Box from './box';
import {Link, useHistory} from 'react-router-dom';
import {Plugins, Capacitor} from '@capacitor/core';
import {isFuture, isPast, subDays} from 'date-fns';

const useStyles = createUseStyles(() => ({
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

const DAYS_BEFORE_TO_NOTIFY = 2;
const HOUR_TO_NOTIFY = 20;

const refreshLocalNotifications = async (pantryProducts: ReadonlyArray<PantryProduct>) => {
    if (Capacitor.isNative && (await Plugins.LocalNotifications.areEnabled())) {
        const {granted} = await Plugins.LocalNotifications.requestPermission();

        if (granted) {
            const {notifications} = await Plugins.LocalNotifications.getPending();

            if (notifications.length > 0) {
                await Plugins.LocalNotifications.cancel({notifications});
            }

            const newNotifications = pantryProducts
                .filter((product) => {
                    const expiredDate = new Date(product.date);
                    const dateToNotify = subDays(
                        new Date(
                            expiredDate.getFullYear(),
                            expiredDate.getMonth(),
                            expiredDate.getDate(),
                            HOUR_TO_NOTIFY
                        ),
                        DAYS_BEFORE_TO_NOTIFY
                    );

                    return isFuture(dateToNotify);
                })
                .map((product, index) => {
                    const expiredDate = new Date(product.date);
                    const dateToNotify = subDays(
                        new Date(
                            expiredDate.getFullYear(),
                            expiredDate.getMonth(),
                            expiredDate.getDate(),
                            HOUR_TO_NOTIFY
                        ),
                        DAYS_BEFORE_TO_NOTIFY
                    );
                    return {
                        id: index,
                        title: 'Alerta de caducidad',
                        body: `${product.name} caduca pasado mañana`,
                        schedule: {
                            at: dateToNotify,
                        },
                    };
                });

            Plugins.LocalNotifications.schedule({
                notifications: newNotifications,
            });
        } else {
            console.log(`INFO: local notifications don't have permissions`);
        }
    } else {
        console.log(`INFO: local notifications can't setted`);
    }
};

const FoodToExpire = () => {
    const classes = useStyles();
    const history = useHistory();
    const [pantryProducts, setPantryProducts] = React.useState<{
        data: ReadonlyArray<PantryProduct>;
        isLoading: boolean;
    }>({data: [], isLoading: true});

    useIonViewDidEnter(() => {
        setPantryProducts({
            ...pantryProducts,
            isLoading: true,
        });
        kiwiApi
            .getPantry({
                pageNumber: 0,
                pageSize: 6,
                perishable: true,
            })
            .then((res) => {
                refreshLocalNotifications(
                    res.content.filter((e) => {
                        return !isPast(new Date(e.date));
                    })
                );
                setPantryProducts({
                    data: res.content,
                    isLoading: false,
                });
            });
    }, []);

    return (
        <div className={classes.container}>
            <div className={classes.title}>
                <IonIcon color="warning" size="large" icon={alarmOutline} />
                <Typography variant="h3">Alimentos próximos a caducar</Typography>
            </div>

            {pantryProducts.isLoading ? (
                <ProductListItemSkeleton rows={3} />
            ) : pantryProducts.data.length === 0 ? (
                <Box>
                    <Typography>Ahora mismo no tienes productos en tu despensa</Typography>
                </Box>
            ) : (
                <div className={classes.list}>
                    <IonList>
                        {pantryProducts.data.map((product) => {
                            const expiryObj = getExpiryObj(product.date);
                            return (
                                <ProductItem
                                    key={product._id}
                                    img={product.img}
                                    title={product.name}
                                    subtitle={`Comprado el ${getFormatDate(product.buyedDate)}`}
                                    handleClickDetail={() => {
                                        history.push('/nutrition');
                                    }}
                                >
                                    <div className={classes.date}>
                                        <Typography variant="caption1" style={{color: expiryObj.color}}>
                                            {expiryObj.label}
                                        </Typography>
                                        <Typography variant="subtitle2">
                                            caducidad
                                            <br />
                                            {new Date(product.date).toLocaleDateString()}
                                        </Typography>
                                    </div>
                                </ProductItem>
                            );
                        })}
                    </IonList>
                    <Box>
                        <Link to="/nutrition">Ver más</Link>
                    </Box>
                </div>
            )}
        </div>
    );
};

export default FoodToExpire;
