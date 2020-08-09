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
                let totalCost = 0;
                const shoppingCartWithProducts = products.map((product, index) => {
                    const costProduct = parseFloat(
                        (shopppingCart.products[index].units * product._doc.price.final).toFixed(2)
                    );
                    totalCost += costProduct;
                    return {
                        ...product._doc,
                        units: shopppingCart.products[index].units,
                        cost: costProduct,
                    };
                });
                res.json({
                    data: {
                        products: shoppingCartWithProducts,
                        totalCost,
                    },
                });
            } else {
                res.json({
                    data: {
                        products: [],
                        totalCost: 0,
                    },
                });
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
                        units: shopppingCart.products[index].units,
                        note: shopppingCart.products[index].note,
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
