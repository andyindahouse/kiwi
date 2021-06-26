'use strict';

const {Schema, model} = require('mongoose');

const OrderSchema = new Schema(
    {
        _id: Schema.Types.ObjectId,
        deliveryDays: [],
    },
    {capped: {size: 1}}
);

module.exports = model('Config', OrderSchema, 'config');
