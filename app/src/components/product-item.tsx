import * as React from 'react';
import {createUseStyles} from 'react-jss';
import {documentTextOutline, trashOutline} from 'ionicons/icons';
import {
    IonIcon,
    IonItemSliding,
    IonItem,
    IonItemOptions,
    IonItemOption,
    IonThumbnail,
    IonSkeletonText,
    IonLabel,
    IonList,
} from '@ionic/react';
import {Product} from '../models';
import Typography from '../components/typography';
import palette from '../theme/palette';

const useStyles = createUseStyles(() => ({
    card: {
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '64px 1fr auto',
        gridGap: 8,
        alignItems: 'center',
    },
    img: {
        width: 64,
        padding: '8px 0',
    },
    nameProduct: {
        display: 'block',
        '&::first-letter': {
            textTransform: 'uppercase',
        },
    },
}));

export const ProductListItemSkeleton = ({rows}: {rows: number}) => {
    return (
        <IonList>
            {Array.from(Array(rows).keys()).map((e) => (
                <IonItem key={e}>
                    <IonThumbnail slot="start">
                        <IonSkeletonText animated />
                    </IonThumbnail>
                    <IonLabel>
                        <h3>
                            <IonSkeletonText animated style={{width: '50%'}} />
                        </h3>
                        <p>
                            <IonSkeletonText animated style={{width: '80%'}} />
                        </p>
                        <p>
                            <IonSkeletonText animated style={{width: '60%'}} />
                        </p>
                    </IonLabel>
                </IonItem>
            ))}
        </IonList>
    );
};

type Props = {
    img: string;
    title: string;
    subtitle: string;
    handleClickDetail: () => void;
    disableSwipeOptions?: boolean;
    labelLeftAction?: string | React.ReactNode;
    labelRightAction?: string | React.ReactNode;
    handleClickLeftAction?: () => void;
    handleClickRightAction?: () => void;
    children: React.ReactNode;
};

const ProductItem = ({
    img,
    title,
    subtitle,
    handleClickDetail,
    disableSwipeOptions = false,
    labelLeftAction,
    labelRightAction,
    handleClickLeftAction,
    handleClickRightAction,
    children,
}: Props) => {
    const classes = useStyles();
    return (
        <IonItemSliding disabled={disableSwipeOptions}>
            <IonItem onClick={handleClickDetail}>
                <div className={classes.card}>
                    <img className={classes.img} alt="product" src={img} />
                    <div>
                        <Typography
                            variant="body2"
                            gutterBottom={4}
                            className={classes.nameProduct}
                            ellipsis
                            lineClamp={2}
                        >
                            {title}
                        </Typography>
                        <Typography variant="subtitle2">{subtitle}</Typography>
                    </div>
                    {children}
                </div>
            </IonItem>

            <IonItemOptions side="end">
                {handleClickLeftAction && labelLeftAction && (
                    <IonItemOption onClick={handleClickLeftAction}>{labelLeftAction}</IonItemOption>
                )}
                {handleClickRightAction && labelRightAction && (
                    <IonItemOption color="danger" onClick={handleClickRightAction}>
                        {labelRightAction}
                    </IonItemOption>
                )}
            </IonItemOptions>
        </IonItemSliding>
    );
};

export default ProductItem;
