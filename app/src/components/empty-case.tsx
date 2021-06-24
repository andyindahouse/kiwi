import {IonIcon} from '@ionic/react';
import * as React from 'react';
import {Box, Typography} from '@kiwi/ui';
import {createUseStyles} from 'react-jss';

const useStyles = createUseStyles(() => ({
    container: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 50,
    },
    icon: {
        fontSize: 64,
        marginBottom: 16,
    },
}));

type Props = {title1: string; title2?: string; subtitle?: string; icon?: string};

const EmptyCase = ({title1, title2, subtitle, icon}: Props) => {
    const classes = useStyles();

    return (
        <Box cssClass={classes.container}>
            {icon && <IonIcon className={classes.icon} icon={icon} color="secondary" />}
            <Typography variant="h3" center gutterBottom={subtitle ? 32 : 0}>
                {title1}
                <br />
                {title2}
            </Typography>
            {subtitle && <Typography center>{subtitle}</Typography>}
        </Box>
    );
};

export default EmptyCase;
