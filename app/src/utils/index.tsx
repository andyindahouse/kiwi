import {Product, SpecialOffers} from '@kiwi/models';
import {useTheme} from '@kiwi/ui';
import {checkmarkDoneOutline, cartOutline, bicycleOutline, homeOutline} from 'ionicons/icons';
import {differenceInDays, isSameDay, isTomorrow, differenceInMonths, differenceInYears} from 'date-fns';

export const extendRawProducts = (products: ReadonlyArray<Product>, shoppingCart: ReadonlyArray<Product>) =>
    products.map((product: Product) => {
        const shoppingCartProduct = shoppingCart.find((e) => e.id === product.id);

        return {
            ...product,
            units: shoppingCartProduct?.units || 0,
        };
    });

export const useStatusOrderMap = () => {
    const {palette} = useTheme();
    return {
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
            color: palette.primary.dark,
            label: 'Completado',
            icon: homeOutline,
        },
    };
};

export const getUnitPriceWithOffer = (
    originalPrice: string,
    specialOffer: SpecialOffers,
    specialOfferValue: [string, string]
) => {
    if (specialOffer === 'offerDiscount') {
        const unitWithDiscount = Number(specialOfferValue[0]);
        const standardPrice = Number(originalPrice);
        const prices = Array(unitWithDiscount).fill(standardPrice);
        const total = prices.reduce((acum, current, index) => {
            if (index === prices.length - 1) {
                return acum + current * Math.abs((Number(specialOfferValue[1]) - 100) / 100);
            }
            return acum + current;
        }, 0);

        return (total / prices.length).toFixed(2);
    }

    if (specialOffer === 'quantityDiscount') {
        const totalCost = Number(specialOfferValue[1]) * Number(originalPrice);

        return (totalCost / Number(specialOfferValue[0])).toFixed(2);
    }

    console.error('Error: unknown specialOffer case');
    return '';
};

export const getLabelDiscount = (specialOffer: SpecialOffers, specialOfferValue: [string, string]) => {
    if (specialOffer === 'offerDiscount') {
        return `${specialOfferValue[0]}ª - ${specialOfferValue[1]}%`;
    }

    if (specialOffer === 'quantityDiscount') {
        return `${specialOfferValue[0]} x ${specialOfferValue[1]}`;
    }

    console.error('Error: unknown specialOffer case');
    return '';
};

export const useGetExpiryObj = () => {
    const {palette} = useTheme();
    return (date: string) => {
        const expiryDate = new Date(date);
        const currentDate = new Date();
        const daysDiff = differenceInDays(
            new Date(expiryDate.getFullYear(), expiryDate.getMonth(), expiryDate.getDate()),
            new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
        );

        if (daysDiff < 0) {
            return {
                color: palette.error.main,
                label: 'Caducado',
            };
        }

        if (isSameDay(expiryDate, currentDate)) {
            return {
                color: palette.error.main,
                label: 'Hoy',
            };
        }

        if (isTomorrow(expiryDate)) {
            return {
                color: palette.warning.main,
                label: 'Mañana',
            };
        }

        if (daysDiff <= 3) {
            return {
                color: palette.warning.dark,
                label: `${daysDiff} días`,
            };
        }
        if (daysDiff >= 31 && daysDiff < 365) {
            const monthsDiff = differenceInMonths(expiryDate, currentDate);
            return {
                color: palette.primary.dark,
                label: monthsDiff == 1 ? `${monthsDiff} mes` : `${monthsDiff} meses`,
            };
        }
        if (daysDiff >= 365) {
            const yearsDiff = differenceInYears(expiryDate, currentDate);
            return {
                color: palette.primary.dark,
                label: yearsDiff == 1 ? `${yearsDiff} año` : `${yearsDiff} años`,
            };
        }

        return {
            color: palette.primary.dark,
            label: `${daysDiff} días`,
        };
    };
};

export const updateProducts = (product: Product, products: ReadonlyArray<Product>) => {
    const productIndex = products.findIndex((e) => e.id === product.id);

    if (productIndex === -1) {
        return [...products, product];
    }

    if (product.units === 0) {
        return products.slice(0, productIndex).concat(products.slice(productIndex + 1));
    }

    return products.slice(0, productIndex).concat([product], products.slice(productIndex + 1));
};
