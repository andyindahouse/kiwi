import React from 'react';
import {createUseStyles} from 'react-jss';
import {IonIcon, IonList, useIonViewDidEnter} from '@ionic/react';
import {warningOutline} from 'ionicons/icons';
import Typography from '../components/typography';
import palette from '../theme/palette';
import {PantryProduct} from '../models';
import ProductItem from '../components/product-item';
import {getExpiryObj} from '../utils';
import {getFormatDate} from '../utils/format-date';
import kiwiApi from '../api';

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
            marginRight: 8,
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

const FoodToExpire = () => {
    const classes = useStyles();

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
                pageSize: 5,
            })
            .then((res) => {
                setPantryProducts({
                    data: res.content,
                    isLoading: false,
                });
            });
    }, []);

    return (
        <div className={classes.container}>
            <div className={classes.title}>
                <Typography variant="h3">Alimentos próximos a caducar</Typography>
                <IonIcon color="warning" size="large" icon={warningOutline} />
            </div>

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
                                    console.log(product);
                                }}
                                labelRightAction="Consumido"
                                handleClickRightAction={() => {
                                    console.log('asdfg');
                                }}
                            >
                                <div className={classes.date}>
                                    <Typography style={{color: expiryObj.color}}>
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
            </div>
        </div>
    );
};

export default FoodToExpire;
