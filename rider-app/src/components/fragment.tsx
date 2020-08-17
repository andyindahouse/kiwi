import * as React from 'react';
import {IonIcon, IonRouterLink} from '@ionic/react';
import Typography from './typography';
import {createUseStyles} from 'react-jss';
import {chevronForwardSharp} from 'ionicons/icons';

const useStyles = createUseStyles(() => ({
    fragment: {
        display: 'flex',
        alignItems: 'center',
        borderRadius: 4,
        boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.25)',
        padding: 16,
        '& > h3': {
            flex: 1,
        },
    },
    icon: {
        marginRight: 8,
    },
}));

type Props = {
    color?: string;
    icon: string;
    text: string;
    link: string;
    margin?: boolean;
};

const Fragment = ({icon, text, link, color = 'primary', margin = false}: Props) => {
    const classes = useStyles();

    return (
        <IonRouterLink routerLink={link}>
            <div className={classes.fragment} style={{margin: !margin ? 16 : 0}}>
                <IonIcon size="large" color={color} icon={icon} className={classes.icon} />
                <Typography variant="h3">{text}</Typography>
                <IonIcon size="small" color="medium" icon={chevronForwardSharp} />
            </div>
        </IonRouterLink>
    );
};

export default Fragment;
