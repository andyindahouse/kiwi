import * as React from 'react';
import {createUseStyles, useTheme} from './styles';
import {typos} from './typos';
import classnames from 'classnames';

const useStyles = createUseStyles(() => ({
    h1: typos.h1,
    h2: typos.h2,
    h3: typos.h3,
    h4: typos.h4,
    h5: typos.h5,
    h6: typos.h6,
    subtitle1: typos.subtitle1,
    subtitle2: typos.subtitle2,
    body1: typos.body1,
    body2: typos.body2,
    button: typos.button,
    caption: typos.caption,
    caption2: typos.caption2,
    overline: typos.overline,
    ellipsis: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: 'box',
        boxOrient: 'vertical',
    },
    center: {
        display: 'block',
        textAlign: 'center',
    },
}));

type TextProps = {
    children: React.ReactNode;
    className?: string;
    style?: any;
    color?: string;
    as?: keyof JSX.IntrinsicElements;
};

const Text = ({color, as = 'span', className, style, children}: TextProps) => {
    const {palette} = useTheme();
    return React.createElement(as, {className, style, color: color || palette.textPrimary}, children);
};

interface Props {
    gutterBottom?: 0 | 4 | 8 | 16 | 32;
    ellipsis?: boolean;
    lineClamp?: number;
    center?: boolean;
    variant?:
        | 'h1'
        | 'h2'
        | 'h3'
        | 'h4'
        | 'h5'
        | 'body1'
        | 'body2'
        | 'subtitle1'
        | 'subtitle2'
        | 'caption1'
        | 'caption2';
    color?: string;
    style?: React.CSSProperties;
}

export const Typography = ({
    variant = 'body1',
    gutterBottom = 0,
    ellipsis = false,
    center = false,
    lineClamp = 1,
    className,
    children,
    color,
    style,
    ...props
}: Props & React.HTMLAttributes<any>) => {
    const classes = useStyles();
    switch (variant) {
        case 'h1':
            return (
                <Text
                    as="h1"
                    className={classnames(
                        classes.h1,
                        {[classes.ellipsis]: ellipsis, [classes.center]: center},
                        className
                    )}
                    style={{
                        ...(gutterBottom !== 0 && !ellipsis ? {display: 'block'} : {}),
                        marginBottom: gutterBottom,
                        ...(ellipsis ? {WebkitLineClamp: lineClamp} : {}),
                        ...(color ? {color} : {}),
                        ...style,
                    }}
                    {...props}
                >
                    {children}
                </Text>
            );
        case 'h2':
            return (
                <Text
                    as="h2"
                    className={classnames(
                        classes.h2,
                        {[classes.ellipsis]: ellipsis, [classes.center]: center},
                        className
                    )}
                    style={{
                        marginBottom: gutterBottom,
                        ...(gutterBottom !== 0 && !ellipsis ? {display: 'block'} : {}),
                        ...(ellipsis ? {WebkitLineClamp: lineClamp} : {}),
                        ...(color ? {color} : {}),
                        ...style,
                    }}
                    {...props}
                >
                    {children}
                </Text>
            );
        case 'h3':
            return (
                <h3
                    className={classnames(
                        classes.h3,
                        {[classes.ellipsis]: ellipsis, [classes.center]: center},
                        className
                    )}
                    style={{
                        ...(gutterBottom !== 0 && !ellipsis ? {display: 'block'} : {}),
                        marginBottom: gutterBottom,
                        ...(ellipsis ? {WebkitLineClamp: lineClamp} : {}),
                        ...(color ? {color} : {}),
                        ...style,
                    }}
                    {...props}
                >
                    {children}
                </h3>
            );
        case 'h4':
            return (
                <Text
                    as="h4"
                    className={classnames(
                        classes.h4,
                        {[classes.ellipsis]: ellipsis, [classes.center]: center},
                        className
                    )}
                    style={{
                        ...(gutterBottom !== 0 && !ellipsis ? {display: 'block'} : {}),
                        marginBottom: gutterBottom,
                        ...(ellipsis ? {WebkitLineClamp: lineClamp} : {}),
                        ...(color ? {color} : {}),
                        ...style,
                    }}
                    {...props}
                >
                    {children}
                </Text>
            );
        case 'h5':
            return (
                <Text
                    as="h5"
                    className={classnames(
                        classes.h5,
                        {[classes.ellipsis]: ellipsis, [classes.center]: center},
                        className
                    )}
                    style={{
                        ...(gutterBottom !== 0 && !ellipsis ? {display: 'block'} : {}),
                        marginBottom: gutterBottom,
                        ...(ellipsis ? {WebkitLineClamp: lineClamp} : {}),
                        ...(color ? {color} : {}),
                        ...style,
                    }}
                    {...props}
                >
                    {children}
                </Text>
            );
        case 'body1':
            return (
                <Text
                    as="p"
                    className={classnames(
                        classes.body1,
                        {[classes.ellipsis]: ellipsis, [classes.center]: center},
                        className
                    )}
                    style={{
                        marginBottom: gutterBottom,
                        ...(ellipsis ? {WebkitLineClamp: lineClamp} : {}),
                        ...(color ? {color} : {}),
                        ...style,
                    }}
                    {...props}
                >
                    {children}
                </Text>
            );
        case 'body2':
            return (
                <Text
                    as="p"
                    className={classnames(
                        classes.body2,
                        {[classes.ellipsis]: ellipsis, [classes.center]: center},
                        className
                    )}
                    style={{
                        marginBottom: gutterBottom,
                        ...(gutterBottom !== 0 && !ellipsis ? {display: 'block'} : {}),
                        ...(ellipsis ? {WebkitLineClamp: lineClamp} : {}),
                        ...(color ? {color} : {}),
                        ...style,
                    }}
                    {...props}
                >
                    {children}
                </Text>
            );
        case 'subtitle1':
            return (
                <Text
                    as="span"
                    className={classnames(
                        classes.subtitle1,
                        {[classes.ellipsis]: ellipsis, [classes.center]: center},
                        className
                    )}
                    style={{
                        marginBottom: gutterBottom,
                        ...(gutterBottom !== 0 && !ellipsis ? {display: 'block'} : {}),
                        ...(ellipsis ? {WebkitLineClamp: lineClamp} : {}),
                        ...(color ? {color} : {}),
                        ...style,
                    }}
                    {...props}
                >
                    {children}
                </Text>
            );
        case 'subtitle2':
            return (
                <Text
                    as="span"
                    className={classnames(
                        classes.subtitle2,
                        {[classes.ellipsis]: ellipsis, [classes.center]: center},
                        className
                    )}
                    style={{
                        marginBottom: gutterBottom,
                        ...(gutterBottom !== 0 && !ellipsis ? {display: 'block'} : {}),
                        ...(ellipsis ? {WebkitLineClamp: lineClamp} : {}),
                        ...(color ? {color} : {}),
                        ...style,
                    }}
                    {...props}
                >
                    {children}
                </Text>
            );
        case 'caption1':
            return (
                <Text
                    as="p"
                    className={classnames(
                        classes.caption,
                        {[classes.ellipsis]: ellipsis, [classes.center]: center},
                        className
                    )}
                    style={{
                        marginBottom: gutterBottom,
                        ...(gutterBottom !== 0 && !ellipsis ? {display: 'block'} : {}),
                        ...(ellipsis ? {WebkitLineClamp: lineClamp} : {}),
                        ...(color ? {color} : {}),
                        ...style,
                    }}
                    {...props}
                >
                    {children}
                </Text>
            );
        case 'caption2':
            return (
                <Text
                    as="p"
                    className={classnames(
                        classes.caption2,
                        {[classes.ellipsis]: ellipsis, [classes.center]: center},
                        className
                    )}
                    style={{
                        marginBottom: gutterBottom,
                        ...(gutterBottom !== 0 && !ellipsis ? {display: 'block'} : {}),
                        ...(ellipsis ? {WebkitLineClamp: lineClamp} : {}),
                        ...(color ? {color} : {}),
                        ...style,
                    }}
                    {...props}
                >
                    {children}
                </Text>
            );
        default:
            return (
                <Text
                    className={classnames(
                        classes.body1,
                        {[classes.ellipsis]: ellipsis, [classes.center]: center},
                        className
                    )}
                    style={{
                        marginBottom: gutterBottom,
                        ...(gutterBottom !== 0 && !ellipsis ? {display: 'block'} : {}),
                        ...(ellipsis ? {WebkitLineClamp: lineClamp} : {}),
                        ...(color ? {color} : {}),
                        ...style,
                    }}
                    {...props}
                >
                    {children}
                </Text>
            );
    }
};
