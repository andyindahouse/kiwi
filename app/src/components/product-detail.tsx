import {IonSpinner} from '@ionic/react';
import * as React from 'react';
import {createUseStyles} from 'react-jss';
import kiwApi, {Product, IProductDetail} from '../api';

const useStyles = createUseStyles(() => ({
    container: {
        padding: 16,
    },
    image: {
        margin: 16,
        height: 325,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        position: 'relative',
    },
    price: {
        padding: '4px',
        borderRadius: '16px',
        backgroundColor: '#EC445A',
        display: 'inline-block',
        position: 'absolute',
        right: '5px',
        bottom: '5px',
        color: '#FFFFFF',
        fontSize: '24px',
        fontWeight: '600',
    },
    nutriments: {
        display: 'grid',
        gridTemplateColumns: '1fr 100px',
        gridGap: 8,
        '& > p': {
            margin: 0,
        },
    },
}));

interface Props {
    units: number;
    handleUpdateUnits: (units: number) => void;
}

const ProductDetail = ({name, price, img, id, ean, discount, brand, units = 0}: Props & Product) => {
    const classes = useStyles();
    const [detail, setDetail] = React.useState<IProductDetail | null>(null);
    const [isLoading, setLoading] = React.useState(false);

    React.useEffect(() => {
        setLoading(true);
        kiwApi.getProductDetail(ean).then((res) => {
            setLoading(false);
            setDetail(res);
        });
    }, []);

    return (
        <div className={classes.container}>
            <div className={classes.image} style={{backgroundImage: `url(${img})`}}>
                <h3 className={classes.price}>{price.final}€</h3>
            </div>
            <h2>{name}</h2>
            <p>{brand}</p>
            {isLoading ? (
                <div>
                    <IonSpinner name="crescent"></IonSpinner>
                </div>
            ) : (
                <>
                    <h4>Información nutricional: (por {detail?.nutriments.nutritionDataPer})</h4>
                    <div className={classes.nutriments}>
                        <p>Valor energético</p>
                        <strong>{detail?.nutriments.energyKcal100g}</strong>
                        <p>Grasas</p>
                        <strong>{detail?.nutriments.fat100g}</strong>
                        <p>de las cuales saturadas</p>
                        <strong>{detail?.nutriments.saturedFat100g}</strong>
                        <p>Hidratos de carbono</p>
                        <strong>{detail?.nutriments.carbohydrates100g}</strong>
                        <p>de los cuales azúcares</p>
                        <strong>{detail?.nutriments.sugar100g}</strong>
                        <p>Proteínas</p>
                        <strong>{detail?.nutriments.proteins100g}</strong>
                        <p>Sal</p>
                        <strong>{detail?.nutriments.salt100g}</strong>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProductDetail;
