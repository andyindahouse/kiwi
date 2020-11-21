import * as React from 'react';
import {createUseStyles} from 'react-jss';
import classnames from 'classnames';

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
    cssClass?: string;
};

const Box = ({
    children,
    padding = 16,
    paddingTop,
    paddingLeft,
    paddingBottom,
    paddingRight,
    cssClass,
}: Props) => {
    const classes = useStyles({
        padding,
        paddingTop,
        paddingLeft,
        paddingBottom,
        paddingRight,
    });

    return <div className={classnames(classes.container, cssClass)}>{children}</div>;
};

export default Box;
