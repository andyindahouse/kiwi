'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PantrySchema = Schema({
    email: String,
    products: [
        {
            ean: String,
            quantity: Number,
            date: Date,
        },
    ],
});

module.exports = mongoose.model('Pantry', PantrySchema, 'pantries');
