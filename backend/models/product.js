'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {PRODUCTS_COLLECTION} = require('../config');

const ProductSchema = Schema({
    // email: {type: String, required: true},
    // password: {type: String, required: true},
    // first_name: String,
    // last_name: String,
    // {
    //     _id: ObjectId('5f206d78c7784b0ad88c9f8a'),
    //     id: '0110120903900734___',
    //     brand: 'COOSUR',
    //     category: [
    //         'Alimentación General',
    //         'Alimentación general',
    //         'Aceites',
    //         'Aceite de oliva virgen extra'
    //     ],
    //     name: 'COOSUR aceite de oliva virgen extra botella 675 ml con tapón antigoteo',
    //     price: {
    //         'final': '3.99'
    //     },
    //     discount: false,
    //     status: 'AVAILABLE',
    //     quantity: 1,
    //     currency: 'EUR',
    //     img: 'https://cdn.grupoelcorteingles.es/SGFM/dctm/MEDIA03/201705/09/00120903900734____1__40x40.jpg',
    //     url: '/supermercado/0110120903900734-coosur-aceite-de-oliva-virgen-extra-botella-675-ml-con-tapon-antigoteo/',
    //     updateDate: '$$NOW',
    //     createDate: '$$NOW'
    // }
});

module.exports = mongoose.model('Product', ProductSchema, PRODUCTS_COLLECTION);
