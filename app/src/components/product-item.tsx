import * as React from 'react';
import {Typography, createUseStyles, useTheme} from '@kiwi/ui';
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
import {alertCircleOutline} from 'ionicons/icons';
import classNames from 'classnames';

const useStyles = createUseStyles(({palette}) => ({
    cardContainer: {
        width: '100%',
    },
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
    availableIcon: {
        width: 16,
        height: 16,
        color: palette.tertiary.main,
        marginRight: 8,
    },
    discountIcon: {
        width: 16,
        height: 16,
        color: palette.secondary.main,
        marginRight: 8,
    },
    notAvailable: {
        opacity: 0.3,
    },
    labelNotAvailable: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: 8,
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
    showDiscountIcon?: boolean;
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
    showDiscountIcon,
}: Props) => {
    const classes = useStyles();
    const {palette} = useTheme();
    return (
        <IonItemSliding disabled={disableSwipeOptions}>
            <IonItem onClick={handleClickDetail}>
                <div className={classes.cardContainer}>
                    <div
                        className={classNames(classes.card, {
                            [classes.notAvailable]: showAlertIcon,
                        })}
                    >
                        <img className={classes.img} alt="product" src={img} />
                        <div>
                            <Typography variant="body2" gutterBottom={4} ellipsis lineClamp={2}>
                                {title}
                            </Typography>
                            <Typography variant="subtitle2">{subtitle}</Typography>
                        </div>
                        {children}
                    </div>
                    {showAlertIcon && (
                        <div className={classes.labelNotAvailable}>
                            <IonIcon icon={alertCircleOutline} className={classes.availableIcon} />
                            <Typography variant="subtitle2" color={palette.tertiary.main}>
                                Este producto ya no está disponible
                            </Typography>
                        </div>
                    )}
                    {showDiscountIcon && (
                        <div className={classes.labelNotAvailable}>
                            <IonIcon icon={alertCircleOutline} className={classes.discountIcon} />
                            <Typography variant="subtitle2" color={palette.secondary.main}>
                                Añade unidades para aprovechar la oferta
                            </Typography>
                        </div>
                    )}
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
                {!showAlertIcon && handleClickLeftAction && labelLeftAction && (
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
