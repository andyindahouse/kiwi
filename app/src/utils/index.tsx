import {OrderStatus, Product, SpecialOffers} from '../models';
import palette from '../theme/palette';
import {checkmarkDoneOutline, cartOutline, bicycleOutline, homeOutline} from 'ionicons/icons';
import {differenceInDays, isSameDay} from 'date-fns';

export const extendRawProducts = (products: ReadonlyArray<Product>, shoppingCart: ReadonlyArray<Product>) => {
    return products.map((product: Product) => {
        const shoppingCartProduct = shoppingCart.find((e) => e.ean === product.ean);

        return {
            ...product,
            units: shoppingCartProduct?.units || 0,
        };
    });
};

export const statusOrderMap: Record<OrderStatus, {color: string; label: string; icon: string}> = {
    pending: {
        color: palette.secondary.main,
        label: 'Pendiente',
        icon: checkmarkDoneOutline,
    },
    cancelled: {
        color: palette.error.main,
        label: 'Cancelado',
        icon: checkmarkDoneOutline,
    },
    'in-progress': {
        color: palette.secondary.main,
        label: 'En progreso',
        icon: cartOutline,
    },
    comming: {
        color: palette.primary.dark,
        label: 'En camino',
        icon: bicycleOutline,
    },
    issue: {
        color: palette.error.main,
        label: 'Error',
        icon: checkmarkDoneOutline,
    },
    finalized: {
        color: palette.primary.main,
        label: 'Completado',
        icon: homeOutline,
    },
};

export const getLabelDiscount = (specialOffer: SpecialOffers, specialOfferValue: [string, string]) => {
    if (specialOffer === 'offerDisscount') {
        return `${specialOfferValue[0]}ª - ${specialOfferValue[1]}%`;
    }

    if (specialOffer === 'quantityDisscount') {
        return `${specialOfferValue[0]} x ${specialOfferValue[1]}`;
    }

    console.error('Error: unknown specialOffer case');
    return '';
};

export const getExpiryObj = (date: string) => {
    const expiryDate = new Date(date);
    const currentDate = new Date();
    const daysDiff = differenceInDays(expiryDate, currentDate);

    if (isSameDay(expiryDate, currentDate)) {
        return {
            color: palette.error.main,
            label: 'Hoy',
        };
    }

    if (daysDiff < 0) {
        return {
            color: palette.error.main,
            label: 'Caducado',
        };
    }

    if (daysDiff <= 3) {
        return {
            color: palette.warning.dark,
            label: `${daysDiff} días`,
        };
    }

    return {
        color: palette.primary.dark,
        label: `${daysDiff} días`,
    };
};
