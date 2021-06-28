import mongoose from 'mongoose';
import {PRODUCTS_COLLECTION} from '../config.js';

const ProductSchema = new mongoose.Schema({
    id: {type: String, required: true},
    name: {type: String, text: true, required: true},
    ean: {type: String},
});

export default {
    eci: mongoose.model('Product', ProductSchema, PRODUCTS_COLLECTION.eci),
};
