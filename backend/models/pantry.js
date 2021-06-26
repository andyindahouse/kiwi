'use strict';

const {Schema, model} = require('mongoose');

const PantrySchema = new Schema({
    email: String,
    inStorage: String,
    id: String,
    ean: String,
    img: String,
    name: String,
    buyedDate: Date,
    date: Date,
});

module.exports = model('Pantry', PantrySchema, 'pantries');
