'use strict';

const {Schema, model} = require('mongoose');
const {PRODUCTS_COLLECTION} = require('../config');

const ProductSchema = new Schema({
    id: {type: String, required: true},
    name: {type: String, text: true, required: true},
    ean: {type: String},
});

module.exports = {eci: model('Product', ProductSchema, PRODUCTS_COLLECTION.eci)};
