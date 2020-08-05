'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CheckoutSchema = Schema({
    email: String,
    createdDate: Date,
    totalCost: Number,
    status: String,
    note: String,
    products: [],
});

module.exports = mongoose.model('Checkout', CheckoutSchema, 'checkouts');
