import {Product} from '@kiwi/models';

export const getCost = (product: Product) =>
    product.saleType === 'unit'
        ? parseFloat((product.units * Number(product.price.final)).toFixed(2))
        : parseFloat(((Number(product.price.final) / 10) * (product.units / 100)).toFixed(2));

export const getCostSubtitle = (product: Product) =>
    product.saleType === 'unit'
        ? `${product.units} ud x ${product.price.final}€ / ud`
        : `
     ${product.units} gr (${product.price.final}€ / kg)
    `;
