import React from 'react';
import {createUseStyles} from 'react-jss';
import {
    IonContent,
    IonHeader,
    IonIcon,
    IonPage,
    IonTitle,
    IonToolbar,
    IonList,
    IonItemSliding,
    IonItemOptions,
    IonItem,
    IonLabel,
    IonItemOption,
    IonNote,
} from '@ionic/react';
import Fragment from '../components/fragment';
import {
    rocketOutline,
    warningOutline,
    heart,
    trash,
    star,
    archive,
    ellipsisHorizontal,
    ellipsisVertical,
} from 'ionicons/icons';
import Container from '../components/container';
import Typography from '../components/typography';
import palette from '../theme/palette';

const useStyles = createUseStyles((theme) => ({
    container: {
        margin: '32px 0px',
    },
    title: {
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

    return (
        <div className={classes.container}>
            <div className={classes.title}>
                <Typography variant="h3">Alimentos próximos a caducar</Typography>
                <IonIcon color="warning" size="large" icon={warningOutline} />
            </div>

            <div className={classes.list}>
                <IonItemSliding>
                    <IonItemOptions side="start">
                        <IonItemOption color="danger" expandable>
                            Delete
                        </IonItemOption>
                    </IonItemOptions>

                    <IonItem>
                        <div className={classes.card}>
                            <img
                                alt="product"
                                src="https://cdn.grupoelcorteingles.es/SGFM/dctm/MEDIA03/201604/07/00118480200130____1__325x325.jpg"
                            />
                            <div>
                                <Typography className={classes.name}>
                                    LA FINCA Vacuno Joven Dos Primaveras carne picada peso aproximado bandeja
                                    600g
                                </Typography>
                                <Typography variant="subtitle2">2 unidades</Typography>
                            </div>
                            <div className={classes.date}>
                                <Typography variant="h3">1 día</Typography>
                                <Typography variant="subtitle2">29/07/2020</Typography>
                            </div>
                        </div>
                    </IonItem>

                    <IonItemOptions side="end">
                        <IonItemOption color="tertiary" expandable>
                            Archive
                        </IonItemOption>
                    </IonItemOptions>
                </IonItemSliding>
                <IonItemSliding>
                    <IonItemOptions side="start">
                        <IonItemOption color="danger" expandable>
                            Delete
                        </IonItemOption>
                    </IonItemOptions>

                    <IonItem>
                        <div className={classes.card}>
                            <img
                                alt="product"
                                src="https://cdn.grupoelcorteingles.es/SGFM/dctm/MEDIA03/201604/07/00118480200130____1__325x325.jpg"
                            />
                            <div>
                                <Typography className={classes.name}>
                                    LA FINCA Vacuno Joven Dos Primaveras carne picada peso aproximado bandeja
                                    600g
                                </Typography>
                                <Typography variant="subtitle2">2 unidades</Typography>
                            </div>
                            <div className={classes.date}>
                                <Typography variant="h3">1 día</Typography>
                                <Typography variant="subtitle2">29/07/2020</Typography>
                            </div>
                        </div>
                    </IonItem>

                    <IonItemOptions side="end">
                        <IonItemOption color="tertiary" expandable>
                            Consumido
                        </IonItemOption>
                    </IonItemOptions>
                </IonItemSliding>
                <IonItemSliding>
                    <IonItemOptions side="start">
                        <IonItemOption color="danger" expandable>
                            Delete
                        </IonItemOption>
                    </IonItemOptions>

                    <IonItem>
                        <div className={classes.card}>
                            <img
                                alt="product"
                                src="https://cdn.grupoelcorteingles.es/SGFM/dctm/MEDIA03/201604/07/00118480200130____1__325x325.jpg"
                            />
                            <div>
                                <Typography className={classes.name}>
                                    LA FINCA Vacuno Joven Dos Primaveras carne picada peso aproximado bandeja
                                    600g
                                </Typography>
                                <Typography variant="subtitle2">2 unidades</Typography>
                            </div>
                            <div className={classes.date}>
                                <Typography variant="h3">1 día</Typography>
                                <Typography variant="subtitle2">29/07/2020</Typography>
                            </div>
                        </div>
                    </IonItem>

                    <IonItemOptions side="end">
                        <IonItemOption color="tertiary" expandable>
                            Archive
                        </IonItemOption>
                    </IonItemOptions>
                </IonItemSliding>
            </div>
            <IonList>
                {/* Sliding item with text options on both sides */}
                <IonItemSliding>
                    <IonItemOptions side="start">
                        <IonItemOption onClick={() => console.log('favorite clicked')}>
                            Favorite
                        </IonItemOption>
                        <IonItemOption color="danger" onClick={() => console.log('share clicked')}>
                            Share
                        </IonItemOption>
                    </IonItemOptions>

                    <IonItem>
                        <IonLabel>Item Options</IonLabel>
                    </IonItem>

                    <IonItemOptions side="end">
                        <IonItemOption onClick={() => console.log('unread clicked')}>Unread</IonItemOption>
                    </IonItemOptions>
                </IonItemSliding>

                {/* Sliding item with expandable options on both sides */}
                <IonItemSliding>
                    <IonItemOptions side="start">
                        <IonItemOption color="danger" expandable>
                            Delete
                        </IonItemOption>
                    </IonItemOptions>

                    <IonItem>
                        <IonLabel>Expandable Options</IonLabel>
                    </IonItem>

                    <IonItemOptions side="end">
                        <IonItemOption color="tertiary" expandable>
                            Archive
                        </IonItemOption>
                    </IonItemOptions>
                </IonItemSliding>

                {/* Multi-line sliding item with icon options on both sides */}
                <IonItemSliding id="item100">
                    <IonItem href="#">
                        <IonLabel>
                            <h2>HubStruck Notifications</h2>
                            <p>A new message in your network</p>
                            <p>Oceanic Next has joined your network</p>
                        </IonLabel>
                        <IonNote slot="end">10:45 AM</IonNote>
                    </IonItem>

                    <IonItemOptions side="start">
                        <IonItemOption>
                            <IonIcon slot="icon-only" icon={heart} />
                        </IonItemOption>
                    </IonItemOptions>

                    <IonItemOptions side="end">
                        <IonItemOption color="danger">
                            <IonIcon slot="icon-only" icon={trash} />
                        </IonItemOption>
                        <IonItemOption>
                            <IonIcon slot="icon-only" icon={star} />
                        </IonItemOption>
                    </IonItemOptions>
                </IonItemSliding>

                {/* Sliding item with icon start options on end side */}
                <IonItemSliding>
                    <IonItem>
                        <IonLabel>Sliding Item, Icons Start</IonLabel>
                    </IonItem>
                    <IonItemOptions>
                        <IonItemOption color="primary">
                            <IonIcon slot="start" ios={ellipsisHorizontal} md={ellipsisVertical}></IonIcon>
                            More
                        </IonItemOption>
                        <IonItemOption color="secondary">
                            <IonIcon slot="start" icon={archive} />
                            Archive
                        </IonItemOption>
                    </IonItemOptions>
                </IonItemSliding>

                {/* Sliding item with icon end options on end side */}
                <IonItemSliding>
                    <IonItem>
                        <IonLabel>Sliding Item, Icons End</IonLabel>
                    </IonItem>
                    <IonItemOptions>
                        <IonItemOption color="primary">
                            <IonIcon slot="end" ios={ellipsisHorizontal} md={ellipsisVertical}></IonIcon>
                            More
                        </IonItemOption>
                        <IonItemOption color="secondary">
                            <IonIcon slot="end" icon={archive} />
                            Archive
                        </IonItemOption>
                    </IonItemOptions>
                </IonItemSliding>

                {/* Sliding item with icon top options on end side */}
                <IonItemSliding>
                    <IonItem>
                        <IonLabel>Sliding Item, Icons Top</IonLabel>
                    </IonItem>
                    <IonItemOptions>
                        <IonItemOption color="primary">
                            <IonIcon slot="top" ios={ellipsisHorizontal} md={ellipsisVertical}></IonIcon>
                            More
                        </IonItemOption>
                        <IonItemOption color="secondary">
                            <IonIcon slot="top" icon={archive} />
                            Archive
                        </IonItemOption>
                    </IonItemOptions>
                </IonItemSliding>

                {/* Sliding item with icon bottom options on end side */}
                <IonItemSliding>
                    <IonItem>
                        <IonLabel>Sliding Item, Icons Bottom</IonLabel>
                    </IonItem>
                    <IonItemOptions>
                        <IonItemOption color="primary">
                            <IonIcon slot="bottom" ios={ellipsisHorizontal} md={ellipsisVertical}></IonIcon>
                            More
                        </IonItemOption>
                        <IonItemOption color="secondary">
                            <IonIcon slot="bottom" icon={archive} />
                            Archive
                        </IonItemOption>
                    </IonItemOptions>
                </IonItemSliding>
            </IonList>
        </div>
    );
};

export default FoodToExpire;
