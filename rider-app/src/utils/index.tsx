import {Product} from '../models';
import {palette} from '@kiwi/ui';
import {checkmarkDoneOutline, cartOutline, bicycleOutline, homeOutline} from 'ionicons/icons';

export const extendRawProducts = (products: ReadonlyArray<Product>, shoppingCart: ReadonlyArray<Product>) => {
    return products.map((product: Product) => {
        const shoppingCartProduct = shoppingCart.find((e) => e.id === product.id);

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
    selected: {
        color: palette.secondary.main,
        label: 'Por empezar',
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
        label: 'Entregado',
        icon: homeOutline,
    },
    cancelled: {
        color: palette.error.main,
        label: 'Cancelado',
        icon: checkmarkDoneOutline,
    },
};
