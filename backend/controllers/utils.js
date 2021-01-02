'use strict';

const {FEES} = require('../config');

const utils = {
    getPrice: (product, units) => {
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
        } else {
            return parseFloat((units * product.price.final).toFixed(2));
        }
    },
    getDeliveryPrice: () => {
        return {
            deliverFee: FEES.deliverFee,
            shopperFee: FEES.shopperFee,
            deliveryDiscount: FEES.discount,
            finalDeliverFee: FEES.discount ? FEES.deliverFee * FEES.discount : FEES.deliverFee,
            finalShopperFee: FEES.discount ? FEES.shopperFee * FEES.discount : FEES.shopperFee,
        };
    },
};

module.exports = utils;
