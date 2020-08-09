'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PantrySchema = Schema({
    email: String,
    products: [],
});

module.exports = mongoose.model('Pantry', PantrySchema, 'pantries');
