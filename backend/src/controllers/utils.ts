import {Product} from '@kiwi/models';
import {FEES} from '../config';

const getPriceSpecialOffer = (product, units) => {
    const finalPrice = Number(product.price.final);

    if (product.specialOffer === 'offerDiscount') {
        const quotient = Math.floor(units / product.specialOfferValue[0]);
        const discount = quotient * ((finalPrice * (100 - product.specialOfferValue[1])) / 100);
        const withoutDiscount = units - quotient;
        return parseFloat((withoutDiscount * finalPrice + discount).toFixed(2));
    } else if (product.specialOffer === 'quantityDiscount') {
        const value = finalPrice;
        const rest = units % product.specialOfferValue[0];
        const quotient = Math.floor(units / product.specialOfferValue[0]);
        const productsQuantity = quotient * product.specialOfferValue[1] + rest;
        return parseFloat((productsQuantity * value).toFixed(2));
    } else {
        return -1;
    }
};

export const getPrice = (product: Product, units: number) => {
    const finalPrice = Number(product.price.final);

    if (product.specialOffer) {
        return getPriceSpecialOffer(product, units);
    }

    if (product.saleType === 'unit') {
        const hasPriceItems = product.items && product.items.some((e) => !!e.price);
        if (hasPriceItems) {
            const totalCost =
                product.items?.reduce((acum, current) => acum + parseFloat(current.price ?? '0'), 0) ?? 0;

            return parseFloat(totalCost.toFixed(2));
        }

        return parseFloat((units * finalPrice).toFixed(2));
    }

    const priceFor100gr = finalPrice / 10;
    const unitsOf100gr = units / 100;
    return parseFloat((unitsOf100gr * priceFor100gr).toFixed(2));
};

export const getDeliveryPrice = () => ({
    deliverFee: FEES.deliverFee,
    shopperFee: FEES.shopperFee,
    deliveryDiscount: FEES.discount,
    finalDeliverFee: FEES.deliverFee * (1 - FEES.discount),
    finalShopperFee: FEES.shopperFee * (1 - FEES.discount),
});
