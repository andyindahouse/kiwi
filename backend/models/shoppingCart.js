'use strict';

const {Schema, model} = require('mongoose');

const ShoppingCartSchema = new Schema({
    email: String,
    products: [
        {
            id: String,
            units: Number,
            note: String,
        },
    ],
});

module.exports = model('ShoppingCart', ShoppingCartSchema, 'shoppingCarts');
