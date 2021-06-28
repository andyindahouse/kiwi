import {FEES} from '../config.js';

export const getPrice = (product, units) => {
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
    } else if (product.saleType === 'unit') {
        return parseFloat((units * finalPrice).toFixed(2));
    } else {
        const priceFor100gr = finalPrice / 10;
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
