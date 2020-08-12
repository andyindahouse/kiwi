'use strict';

const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const {PASSPORT_CONFIG} = require('../config');
const Product = require('../models/product');
const errorTypes = require('./errorTypes');

const controller = {
    products: async ({query}, res, next) => {
        const pageNumber = parseInt(query.pageNumber || 0);
        const pageSize = parseInt(query.pageSize || 20);
        const searchText = query.searchText;

        const limit = pageSize;
        const skip = pageNumber * pageSize;
        const textQuery = searchText ? {name: new RegExp(searchText, 'gi')} : {};

        try {
            const totalSize = await Product.find(textQuery).countDocuments();
            const result = await Product.find(textQuery).sort({_id: -1}).skip(skip).limit(limit);
            res.json({
                pageNumber,
                pageSize,
                content: result,
                totalSize,
            });
        } catch (err) {
            next(err);
        }
    },
    productByEan: async ({params}, res, next) => {
        if (!params.ean) {
            next(new errorTypes.Error400('Falta parametro ean.'));
        }
        try {
            const result = await Product.findOne({ean: params.ean});
            if (!result) {
                next(new errorTypes.Error404('Product not found.'));
            } else {
                res.json(result);
            }
        } catch (err) {
            next(err);
        }
    },
};

module.exports = controller;
