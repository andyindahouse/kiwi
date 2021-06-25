'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PantrySchema = Schema({
    email: String,
    inStorage: String,
    id: String,
    ean: String,
    img: String,
    name: String,
    buyedDate: Date,
    date: Date,
});

module.exports = mongoose.model('Pantry', PantrySchema, 'pantries');
