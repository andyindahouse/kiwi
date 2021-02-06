import * as React from 'react';
import {createUseStyles} from 'react-jss';

import {
    IonItemSliding,
    IonItem,
    IonItemOptions,
    IonItemOption,
    IonThumbnail,
    IonSkeletonText,
    IonLabel,
    IonList,
    IonIcon,
} from '@ionic/react';
import Typography from '../components/typography';
import {alertCircleOutline} from 'ionicons/icons';
import palette from '../theme/palette';

const useStyles = createUseStyles(() => ({
    card: {
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '64px 1fr auto',
        gridGap: 8,
        alignItems: 'center',
        position: 'relative',
    },
    img: {
        width: 64,
        padding: '8px 0',
    },
    availableIcon: {
        position: 'absolute',
        top: 2,
        left: 2,
        width: 16,
        height: 16,
        color: palette.tertiary.main,
        marginRight: 8,
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
    expandableRightAction?: boolean;
    showAlertIcon?: boolean;
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
    expandableRightAction = false,
    children,
    showAlertIcon,
}: Props) => {
    const classes = useStyles();
    return (
        <IonItemSliding disabled={disableSwipeOptions}>
            <IonItem onClick={handleClickDetail}>
                <div className={classes.card}>
                    <img className={classes.img} alt="product" src={img} />
                    {showAlertIcon && <IonIcon icon={alertCircleOutline} className={classes.availableIcon} />}
                    <div>
                        <Typography variant="body2" gutterBottom={4} ellipsis lineClamp={2}>
                            {title}
                        </Typography>
                        <Typography variant="subtitle2">{subtitle}</Typography>
                    </div>
                    {children}
                </div>
            </IonItem>

            <IonItemOptions
                side="end"
                onIonSwipe={() => {
                    if (expandableRightAction && handleClickRightAction) {
                        handleClickRightAction();
                    }
                }}
            >
                {handleClickLeftAction && labelLeftAction && (
                    <IonItemOption onClick={handleClickLeftAction}>{labelLeftAction}</IonItemOption>
                )}
                {handleClickRightAction && labelRightAction && (
                    <IonItemOption
                        color="danger"
                        onClick={handleClickRightAction}
                        expandable={expandableRightAction}
                    >
                        {labelRightAction}
                    </IonItemOption>
                )}
            </IonItemOptions>
        </IonItemSliding>
    );
};

export default ProductItem;
