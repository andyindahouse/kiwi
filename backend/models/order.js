'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = Schema({
    _id: mongoose.ObjectId,
    email: String,
    createdDate: Date,
    totalCost: Number,
    status: String,
    note: String,
    products: [],
});

module.exports = mongoose.model('Order', OrderSchema, 'orders');
