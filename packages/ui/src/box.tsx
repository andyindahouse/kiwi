import * as React from 'react';
import {createUseStyles} from './styles';
import classnames from 'classnames';

interface StyleProps {
    padding?: number | string;
    paddingTop?: number | string;
    paddingLeft?: number | string;
    paddingBottom?: number | string;
    paddingRight?: number | string;
}

const useStyles = createUseStyles(() => ({
    container: ({padding, paddingTop, paddingLeft, paddingBottom, paddingRight}: StyleProps) => ({
        padding,
        ...(paddingTop ? {paddingTop} : {}),
        ...(paddingLeft ? {paddingLeft} : {}),
        ...(paddingBottom ? {paddingBottom} : {}),
        ...(paddingRight ? {paddingRight} : {}),
    }),
}));

interface Props extends StyleProps {
    children: React.ReactNode;
    cssClass?: string;
}

export const Box = ({
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
