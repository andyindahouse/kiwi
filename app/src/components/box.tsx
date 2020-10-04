import * as React from 'react';
import {createUseStyles} from 'react-jss';

const useStyles = createUseStyles(() => ({
    container: ({padding, paddingTop, paddingLeft, paddingBottom, paddingRight}) => ({
        padding,
        ...(paddingTop ? {paddingTop} : {}),
        ...(paddingLeft ? {paddingLeft} : {}),
        ...(paddingBottom ? {paddingBottom} : {}),
        ...(paddingRight ? {paddingRight} : {}),
    }),
}));

type Props = {
    children: React.ReactNode;
    padding?: number | string;
    paddingTop?: number | string;
    paddingLeft?: number | string;
    paddingBottom?: number | string;
    paddingRight?: number | string;
};

const Box = ({children, padding = 16, paddingTop, paddingLeft, paddingBottom, paddingRight}: Props) => {
    const classes = useStyles({
        padding,
        paddingTop,
        paddingLeft,
        paddingBottom,
        paddingRight,
    });

    return <div className={classes.container}>{children}</div>;
};

export default Box;
