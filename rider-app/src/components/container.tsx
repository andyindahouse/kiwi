import * as React from 'react';
import {createUseStyles} from '@kiwi/ui';

const useStyles = createUseStyles(() => ({
    container: {
        padding: 16,
    },
}));

const Container = ({children}: {children: React.ReactNode}) => {
    const classes = useStyles();

    return <div className={classes.container}>{children}</div>;
};

export default Container;
