'use strict';

const utils = {
    getPrice: (product, units) => {
        if (product.specialOffer === 'offerDisscount') {
            return parseFloat((units * product.price.final).toFixed(2));
        } else if (product.specialOffer === 'quantityDisscount') {
            const value = product.price.final;
            const rest = units % product.specialOfferValue[0];
            const quotient = Math.floor(units / product.specialOfferValue[0]);
            const productsQuantity = quotient * product.specialOfferValue[1] + rest;
            return parseFloat((productsQuantity * value).toFixed(2));
        } else {
            return parseFloat((units * product.price.final).toFixed(2));
        }
    },
};

module.exports = utils;
