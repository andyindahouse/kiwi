'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {PRODUCTS_COLLECTION} = require('../config');

const ProductSchema = Schema({
    id: {type: String, required: true},
    name: {type: String, required: true},
    ean: {type: String},
});

module.exports = {eci: mongoose.model('Product', ProductSchema, PRODUCTS_COLLECTION.eci)};
