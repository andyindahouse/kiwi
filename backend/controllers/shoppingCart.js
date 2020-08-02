'use strict';

const ShoppingCart = require('../models/shoppingCart');
const Product = require('../models/product');
const errorTypes = require('./errorTypes');

const controller = {
    get: async (req, res, next) => {
        try {
            const shopppingCart = await ShoppingCart.findOne({email: req.user.email});
            if (shopppingCart && shopppingCart.products) {
                const productsId = shopppingCart.products.map((product) => product.ean);
                const products = await Product.find({ean: {$in: productsId}});
                const shoppingCartWithProducts = products.map((product, index) => {
                    return {
                        ...product._doc,
                        quantity: shopppingCart.products[index].quantity,
                    };
                });
                res.json({data: shoppingCartWithProducts});
            } else {
                res.json({data: []});
            }
        } catch (err) {
            next(err);
        }
    },
    update: async (req, res, next) => {
        try {
            const shopppingCart = await ShoppingCart.findOneAndUpdate(
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
            if (shopppingCart && shopppingCart.products) {
                const productsId = shopppingCart.products.map((product) => product.ean);
                const products = await Product.find({ean: {$in: productsId}});
                const shoppingCartWithProducts = products.map((product, index) => {
                    return {
                        ...product._doc,
                        quantity: shopppingCart.products[index].quantity,
                    };
                });
                res.json({data: shoppingCartWithProducts});
            } else {
                res.json({data: []});
            }
        } catch (err) {
            next(err);
        }
    },
};

module.exports = controller;
