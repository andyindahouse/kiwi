import {format} from 'date-fns';
import {es} from 'date-fns/locale';

export const getFormatDate = (date: Date | string) =>
    format(typeof date === 'string' ? new Date(date) : date, 'eeee, dd MMMM', {
        locale: es,
    });

export const getFormatTime = (date: Date) =>
    format(typeof date === 'string' ? new Date(date) : date, 'HH:mm', {
        locale: es,
    });
