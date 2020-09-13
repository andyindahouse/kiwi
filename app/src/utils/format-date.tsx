import {format} from 'date-fns';
import {es} from 'date-fns/locale';

export const getFormatDate = (date: Date | string) =>
    format(typeof date === 'string' ? new Date(date) : date, 'dd MMMM', {
        locale: es,
    });
