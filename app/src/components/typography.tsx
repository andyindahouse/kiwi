import * as React from 'react';
import {createUseStyles} from 'react-jss';
import typos from '../theme/typography';
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
    overline: typos.overline,
    ellipsis: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: 'box',
        boxOrient: 'vertical',
    },
}));

interface Props {
    gutterBottom?: 0 | 4 | 8 | 16;
    ellipsis?: boolean;
    lineClamp?: number;
    variant?:
        | 'h1'
        | 'h2'
        | 'h3'
        | 'h4'
        | 'h5'
        | 'h6'
        | 'body1'
        | 'body2'
        | 'subtitle1'
        | 'subtitle2'
        | 'button'
        | 'caption'
        | 'overline';
}

const Typography = ({
    variant = 'body1',
    gutterBottom = 0,
    ellipsis = false,
    lineClamp = 1,
    className,
    children,
    ...props
}: Props & React.HTMLAttributes<any>) => {
    const classes = useStyles();
    switch (variant) {
        case 'h1':
            return (
                <h1
                    className={classnames(classes.h1, {[classes.ellipsis]: ellipsis}, className)}
                    style={{marginBottom: gutterBottom, ...(ellipsis ? {WebkitLineClamp: lineClamp} : {})}}
                    {...props}
                >
                    {children}
                </h1>
            );
        case 'h2':
            return (
                <h2
                    className={classnames(classes.h2, {[classes.ellipsis]: ellipsis}, className)}
                    style={{marginBottom: gutterBottom, ...(ellipsis ? {WebkitLineClamp: lineClamp} : {})}}
                    {...props}
                >
                    {children}
                </h2>
            );
        case 'h3':
            return (
                <h3
                    className={classnames(classes.h3, {[classes.ellipsis]: ellipsis}, className)}
                    style={{marginBottom: gutterBottom, ...(ellipsis ? {WebkitLineClamp: lineClamp} : {})}}
                    {...props}
                >
                    {children}
                </h3>
            );
        case 'h4':
            return (
                <h4
                    className={classnames(classes.h4, {[classes.ellipsis]: ellipsis}, className)}
                    style={{marginBottom: gutterBottom, ...(ellipsis ? {WebkitLineClamp: lineClamp} : {})}}
                    {...props}
                >
                    {children}
                </h4>
            );
        case 'h5':
            return (
                <h5
                    className={classnames(classes.h5, {[classes.ellipsis]: ellipsis}, className)}
                    style={{marginBottom: gutterBottom, ...(ellipsis ? {WebkitLineClamp: lineClamp} : {})}}
                    {...props}
                >
                    {children}
                </h5>
            );
        case 'h6':
            return (
                <h6
                    className={classnames(classes.h6, {[classes.ellipsis]: ellipsis}, className)}
                    style={{marginBottom: gutterBottom, ...(ellipsis ? {WebkitLineClamp: lineClamp} : {})}}
                    {...props}
                >
                    {children}
                </h6>
            );
        case 'body1':
            return (
                <p
                    className={classnames(classes.body1, {[classes.ellipsis]: ellipsis}, className)}
                    style={{marginBottom: gutterBottom, ...(ellipsis ? {WebkitLineClamp: lineClamp} : {})}}
                    {...props}
                >
                    {children}
                </p>
            );
        case 'body2':
            return (
                <p
                    className={classnames(classes.body2, {[classes.ellipsis]: ellipsis}, className)}
                    style={{marginBottom: gutterBottom, ...(ellipsis ? {WebkitLineClamp: lineClamp} : {})}}
                    {...props}
                >
                    {children}
                </p>
            );
        case 'subtitle1':
            return (
                <span
                    className={classnames(classes.subtitle1, {[classes.ellipsis]: ellipsis}, className)}
                    style={{marginBottom: gutterBottom, ...(ellipsis ? {WebkitLineClamp: lineClamp} : {})}}
                    {...props}
                >
                    {children}
                </span>
            );
        case 'subtitle2':
            return (
                <span
                    className={classnames(classes.subtitle2, {[classes.ellipsis]: ellipsis}, className)}
                    style={{marginBottom: gutterBottom, ...(ellipsis ? {WebkitLineClamp: lineClamp} : {})}}
                    {...props}
                >
                    {children}
                </span>
            );
        case 'button':
            return (
                <p
                    className={classnames(classes.button, {[classes.ellipsis]: ellipsis}, className)}
                    style={{marginBottom: gutterBottom, ...(ellipsis ? {WebkitLineClamp: lineClamp} : {})}}
                    {...props}
                >
                    {children}
                </p>
            );
        case 'caption':
            return (
                <p
                    className={classnames(classes.caption, {[classes.ellipsis]: ellipsis}, className)}
                    style={{marginBottom: gutterBottom, ...(ellipsis ? {WebkitLineClamp: lineClamp} : {})}}
                    {...props}
                >
                    {children}
                </p>
            );
        case 'overline':
            return (
                <p
                    className={classnames(classes.overline, {[classes.ellipsis]: ellipsis}, className)}
                    style={{marginBottom: gutterBottom, ...(ellipsis ? {WebkitLineClamp: lineClamp} : {})}}
                    {...props}
                >
                    {children}
                </p>
            );
        default:
            return (
                <p
                    className={classnames(classes.body1, {[classes.ellipsis]: ellipsis}, className)}
                    style={{marginBottom: gutterBottom, ...(ellipsis ? {WebkitLineClamp: lineClamp} : {})}}
                    {...props}
                >
                    {children}
                </p>
            );
    }
};

export default Typography;
