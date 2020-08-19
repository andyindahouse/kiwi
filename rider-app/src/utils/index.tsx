import {Product} from '../models';
import palette from '../theme/palette';
import {checkmarkDoneOutline, cartOutline, bicycleOutline, homeOutline} from 'ionicons/icons';

export const extendRawProducts = (products: ReadonlyArray<Product>, shoppingCart: ReadonlyArray<Product>) => {
    return products.map((product: Product) => {
        const shoppingCartProduct = shoppingCart.find((e) => e.ean === product.ean);

        return {
            ...product,
            units: shoppingCartProduct?.units || 0,
        };
    });
};

export const statusOrderMap = {
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
    completed: {
        color: palette.primary.main,
        label: 'Completado',
        icon: homeOutline,
    },
};
