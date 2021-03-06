import {format} from 'date-fns';
import {es} from 'date-fns/locale';

export const getFormatDate = (date: Date | string) => {
    const auxDate = typeof date === 'string' ? new Date(date) : date;

    return format(auxDate, 'dd MMMM', {
        locale: es,
    });
};

export const getFormatTime = (date: Date | string) => {
    const auxDate = typeof date === 'string' ? new Date(date) : date;

    return format(auxDate, 'p', {
        locale: es,
    });
};
