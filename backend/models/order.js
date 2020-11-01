'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = Schema({
    _id: mongoose.ObjectId,
    email: String,
    firstName: String,
    lastName: String,
    phone: String,
    rider: String,
    createdDate: Date,
    status: String,
    note: String,
    products: [],
    deliverFee: Number,
    shopperFee: Number,
    totalShoppingCart: Number,
    totalCost: Number,
    deliveryAddress: String,
    deliveryDate: Date,
    deliveryHour: String,
});

module.exports = mongoose.model('Order', OrderSchema, 'orders');
