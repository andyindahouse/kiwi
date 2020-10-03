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
            const result = await Product.find(textQuery).sort({discount: -1, _id: 1}).skip(skip).limit(limit);
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
    getNutrimentsFromProducts: async ({query}, res, next) => {
        const productsEan = query.ean && query.ean.length ? query.ean : [query.ean];
        console.log(productsEan);
        try {
            const result = await Product.find({ean: {$in: productsEan}});
            const nutriments = result.reduce(
                (acum, prod) => {
                    const product = prod._doc;
                    return {
                        carbohydrates100g:
                            acum.carbohydrates100g +
                            (product.nutriments.carbohydrates100g ? product.nutriments.carbohydrates100g : 0),
                        energyKcal100g:
                            acum.energyKcal100g +
                            (product.nutriments.energyKcal100g ? product.nutriments.energyKcal100g : 0),
                        fat100g: acum.fat100g + (product.nutriments.fat100g ? product.nutriments.fat100g : 0),
                        nutritionDataPer: product.nutriments.nutritionDataPer,
                        proteins100g:
                            acum.proteins100g +
                            (product.nutriments.proteins100g ? product.nutriments.proteins100g : 0),
                        salt100g:
                            acum.salt100g + (product.nutriments.salt100g ? product.nutriments.salt100g : 0),
                        saturedFat100g:
                            acum.saturedFat100g +
                            (product.nutriments.saturedFat100g ? product.nutriments.saturedFat100g : 0),
                        sugar100g:
                            acum.sugar100g +
                            (product.nutriments.sugar100g ? product.nutriments.sugar100g : 0),
                    };
                },
                {
                    carbohydrates100g: 0,
                    energyKcal100g: 0,
                    fat100g: 0,
                    salt100g: 0,
                    proteins100g: 0,
                    saturedFat100g: 0,
                    sugar100g: 0,
                }
            );
            res.json(nutriments);
        } catch (err) {
            next(err);
        }
    },
};

module.exports = controller;
