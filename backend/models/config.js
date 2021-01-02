'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = Schema(
    {
        _id: mongoose.ObjectId,
        deliveryDays: [],
    },
    {capped: {size: 1}}
);

module.exports = mongoose.model('Config', OrderSchema, 'config');
