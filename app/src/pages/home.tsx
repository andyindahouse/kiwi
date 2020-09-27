import React from 'react';
import {createUseStyles} from 'react-jss';
import {
    IonContent,
    IonHeader,
    IonIcon,
    IonList,
    IonPage,
    IonTitle,
    IonToolbar,
    useIonViewDidEnter,
} from '@ionic/react';
import Fragment from '../components/fragment';
import {rocketOutline, warningOutline} from 'ionicons/icons';
import Container from '../components/container';
import Typography from '../components/typography';
import FoodToExpire from '../components/food-to-expire';
import kiwiApi from '../api';
import {PantryProduct} from '../models';
import ProductItem from '../components/product-item';
import {getExpiryObj} from '../utils';
import {getFormatDate} from '../utils/format-date';
import palette from '../theme/palette';

const useStyles = createUseStyles(() => ({
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

const Home: React.FC = () => {
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
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Inicio</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Inicio</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <Container>
                    <Fragment
                        icon={rocketOutline}
                        color="secondary"
                        text="Ver pedido en curso"
                        link="/others/orders"
                    ></Fragment>
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
                </Container>
            </IonContent>
        </IonPage>
    );
};

export default Home;
