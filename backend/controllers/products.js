'use strict';

const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const {PASSPORT_CONFIG} = require('../config');
const Product = require('../models/product');
const error_types = require('./error_types');

const controller = {
    products: async ({params}, res, next) => {
        const pageNumber = parseInt(params.pageNumber || 0);
        const pageSize = parseInt(params.pageSize || 20);
        const searchText = params.searchText;

        const limit = pageSize;
        const skip = pageNumber * pageSize;
        const textQuery = searchText ? {name: new RegExp(searchText, 'gi')} : {};

        try {
            const totalSize = await Product.find(textQuery).countDocuments();
            const result = await Product.find(textQuery).sort({__id: -1}).skip(skip).limit(limit);
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
            next(new error_types.Error400('Falta parametro ean.'));
        }
        try {
            const result = await Product.findOne({ean: params.ean});
            if (!result) {
                next(new error_types.Error404('Product not found.'));
            } else {
                res.json(result);
            }
        } catch (err) {
            next(err);
        }
    },
};

module.exports = controller;
