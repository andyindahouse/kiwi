import {FEES} from '../config.js';

export const getPrice = (product, units) => {
    if (!product.saleType) {
        return '0';
    }

    if (product.specialOffer === 'offerDiscount') {
        const quotient = Math.floor(units / product.specialOfferValue[0]);
        const discount = quotient * ((product.price.final * (100 - product.specialOfferValue[1])) / 100);
        const withoutDiscount = units - quotient;
        return parseFloat((withoutDiscount * product.price.final + discount).toFixed(2));
    } else if (product.specialOffer === 'quantityDiscount') {
        const value = product.price.final;
        const rest = units % product.specialOfferValue[0];
        const quotient = Math.floor(units / product.specialOfferValue[0]);
        const productsQuantity = quotient * product.specialOfferValue[1] + rest;
        return parseFloat((productsQuantity * value).toFixed(2));
    } else if (product.saleType === 'unit') {
        return parseFloat((units * product.price.final).toFixed(2));
    } else {
        const priceFor100gr = product.price.final / 10;
        const unitsOf100gr = units / 100;
        return parseFloat((unitsOf100gr * priceFor100gr).toFixed(2));
    }
};

export const getDeliveryPrice = () => ({
    deliverFee: FEES.deliverFee,
    shopperFee: FEES.shopperFee,
    deliveryDiscount: FEES.discount,
    finalDeliverFee: FEES.deliverFee * (1 - FEES.discount),
    finalShopperFee: FEES.shopperFee * (1 - FEES.discount),
});
