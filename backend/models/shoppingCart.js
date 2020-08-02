'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShoppingCartSchema = Schema({
    email: String,
    products: [
        {
            ean: String,
            quantity: Number,
        },
    ],
});

module.exports = mongoose.model('ShoppingCart', ShoppingCartSchema, 'shoppingCarts');
