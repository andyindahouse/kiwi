import {IonSpinner} from '@ionic/react';
import * as React from 'react';
import {createUseStyles} from 'react-jss';
import kiwApi from '../api';
import {Product} from '../models';
import palette from '../theme/palette';
import Typography from './typography';

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
        padding: 8,
        borderRadius: 24,
        backgroundColor: palette.primary.dark,
        display: 'inline-block',
        position: 'absolute',
        right: '5px',
        bottom: '5px',
        color: '#FFFFFF',
    },
    nutriments: {
        display: 'grid',
        gridTemplateColumns: '1fr 100px',
        gridGap: 8,
        alignItems: 'center',
        '& > p': {
            margin: 0,
        },
    },
    ml: {
        marginLeft: 16,
    },
}));

interface Props {
    units: number;
    handleUpdateUnits: (units: number) => void;
}

const ProductDetail = ({name, price, img, id, ean, discount, brand, units = 0}: Props & Product) => {
    const classes = useStyles();
    const [product, setProduct] = React.useState<Product | null>(null);
    const [isLoading, setLoading] = React.useState(false);

    React.useEffect(() => {
        setLoading(true);
        kiwApi.getProductDetail(ean).then((res) => {
            setLoading(false);
            setProduct(res);
        });
    }, [ean]);

    return (
        <div className={classes.container}>
            <div className={classes.image} style={{backgroundImage: `url(${img})`}}>
                <Typography variant="h2" className={classes.price}>
                    {price.final}€
                </Typography>
            </div>
            <Typography variant="subtitle1" gutterBottom={8}>
                {brand}
            </Typography>
            <Typography variant="h2" gutterBottom={16}>
                {name}
            </Typography>
            {isLoading ? (
                <div>
                    <IonSpinner name="crescent"></IonSpinner>
                </div>
            ) : (
                <>
                    <Typography gutterBottom={16}>
                        Información nutricional: (por {product?.nutriments.nutritionDataPer})
                    </Typography>
                    <div className={classes.nutriments}>
                        <Typography variant="subtitle1">Valor energético</Typography>
                        <Typography>{product?.nutriments.energyKcal100g}</Typography>
                        <Typography variant="subtitle1">Grasas</Typography>
                        <Typography>{product?.nutriments.fat100g}</Typography>
                        <Typography variant="subtitle1" className={classes.ml}>
                            de las cuales saturadas
                        </Typography>
                        <Typography>{product?.nutriments.saturedFat100g}</Typography>
                        <Typography variant="subtitle1">Hidratos de carbono</Typography>
                        <Typography>{product?.nutriments.carbohydrates100g}</Typography>
                        <Typography variant="subtitle1" className={classes.ml}>
                            de los cuales azúcares
                        </Typography>
                        <Typography>{product?.nutriments.sugar100g}</Typography>
                        <Typography variant="subtitle1">Proteínas</Typography>
                        <Typography>{product?.nutriments.proteins100g}</Typography>
                        <Typography variant="subtitle1">Sal</Typography>
                        <Typography>{product?.nutriments.salt100g}</Typography>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProductDetail;
