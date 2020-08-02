'use strict';

const Pantry = require('../models/pantry');
const Product = require('../models/product');
const errorTypes = require('./errorTypes');

const controller = {
    get: async (req, res, next) => {
        try {
            const pantry = await Pantry.findOne({email: req.user.email});
            if (pantry && pantry.products) {
                const productsId = pantry.products.map((product) => product.ean);
                const products = await Product.find({ean: {$in: productsId}});
                const pantryWithProducts = products.map((product, index) => {
                    return {
                        ...product._doc,
                        quantity: pantry.products[index].quantity,
                        date: pantry.products[index].date,
                    };
                });
                res.json({data: pantryWithProducts});
            } else {
                res.json({data: []});
            }
        } catch (err) {
            next(err);
        }
    },
    update: async (req, res, next) => {
        try {
            const pantry = await Pantry.findOneAndUpdate(
                {email: req.user.email},
                {
                    email: req.user.email,
                    products: req.body.products,
                },
                {
                    new: true,
                    upsert: true,
                    useFindAndModify: true,
                }
            );
            if (pantry && pantry.products) {
                const productsId = pantry.products.map((product) => product.ean);
                const products = await Product.find({ean: {$in: productsId}});
                const pantryWithProducts = products.map((product, index) => {
                    return {
                        ...product._doc,
                        quantity: pantry.products[index].quantity,
                        date: pantry.products[index].date,
                    };
                });
                res.json({data: pantryWithProducts});
            } else {
                res.json({data: []});
            }
        } catch (err) {
            next(err);
        }
    },
};

module.exports = controller;
