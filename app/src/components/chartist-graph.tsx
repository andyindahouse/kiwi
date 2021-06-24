import * as React from 'react';
import Chartist from 'chartist';
import 'chartist/dist/chartist.css';
import classnames from 'classnames';
import {createUseStyles} from 'react-jss';
import {palette} from '@kiwi/ui';
import {isNumber} from 'lodash';

const useStyles = createUseStyles(() => ({
    proteins: {
        fill: palette.primary.main,
    },
    carboHydrates: {
        fill: palette.secondary.main,
    },
    fat: {
        fill: palette.warning.main,
    },
    salt: {
        fill: palette.error.main,
    },
    custom: {
        '& .ct-label': {
            fill: palette.white,
            fontSize: 14,
            fontWeight: 500,
        },
    },
    square: {
        width: 15,
        height: 15,
        borderRadius: 15,
        marginRight: 8,
        '&.proteins': {
            backgroundColor: palette.primary.main,
        },
        '&.carboHydrates': {
            backgroundColor: palette.secondary.main,
        },
        '&.salt': {
            backgroundColor: palette.error.main,
        },
        '&.fat': {
            backgroundColor: palette.warning.main,
        },
    },
    graphInfo: {
        display: 'flex',
        justifyContent: 'space-around',
        position: 'absolute',
        left: '0',
        padding: '0 16px',
        bottom: 60,
        width: '100%',
    },
    squareLabel: {
        fontSize: 12,
        fontWeight: 500,
    },
    itemContainer: {
        display: 'flex',
    },
}));

const formatSeries = ({
    proteins,
    fat,
    carboHydrates,
}: {
    proteins: number;
    fat: number;
    carboHydrates: number;
}) => {
    const proteinsRounded = isNumber(proteins) ? Math.round(proteins) : 0;
    const fatRounded = isNumber(proteins) ? Math.round(fat) : 0;
    const carboHydratesRounded = isNumber(proteins) ? Math.round(carboHydrates) : 0;
    const sumTotal = proteinsRounded + fatRounded + carboHydratesRounded;

    return {
        proteins: Math.round((proteinsRounded / sumTotal) * 100),
        fat: Math.round((fatRounded / sumTotal) * 100),
        carboHydrates: Math.round((carboHydratesRounded / sumTotal) * 100),
    };
};

type Props = {
    series: {
        proteins: number;
        fat: number;
        carboHydrates: number;
    };
};

const ChartistGraph = ({series}: Props) => {
    const classes = useStyles();
    const chartRef = React.useRef<HTMLDivElement | null>(null);
    const chartist = React.useRef<Chartist.IChartistPieChart | null>(null);

    React.useEffect(() => {
        if (chartRef.current) {
            const {proteins, fat, carboHydrates} = formatSeries(series);

            chartist.current = new Chartist.Pie(
                chartRef.current,
                {
                    series: [
                        {
                            value: proteins,
                            name: 'Proteins',
                            className: classes.proteins,
                            meta: 'proteins',
                        },
                        {
                            value: fat,
                            name: 'Fat',
                            className: classes.fat,
                            meta: 'fat',
                        },
                        {
                            value: carboHydrates,
                            name: 'Carbohydrates',
                            className: classes.carboHydrates,
                            meta: 'carbo-hydrate',
                        },
                    ].filter((e) => e.value),
                },
                {
                    donut: true,
                    donutWidth: 40,
                    donutSolid: true,
                    startAngle: 270,
                    total: 200,
                    showLabel: true,
                }
            );
        }
    }, []);

    return (
        <div ref={chartRef} className={classnames(['ct-golden-section', classes.custom])}>
            <div className={classes.graphInfo}>
                <div className={classes.itemContainer}>
                    <div className={classnames(classes.square, 'proteins')}></div>
                    <span className={classes.squareLabel}>% Proteinas</span>
                </div>
                <div className={classes.itemContainer}>
                    <div className={classnames(classes.square, 'carboHydrates')}></div>
                    <span className={classes.squareLabel}>% Carbohidratos</span>
                </div>
                <div className={classes.itemContainer}>
                    <div className={classnames(classes.square, 'fat')}></div>
                    <span className={classes.squareLabel}>% Grasas</span>
                </div>
            </div>
        </div>
    );
};

export default ChartistGraph;
