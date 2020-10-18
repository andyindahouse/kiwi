'use strict';

const ShoppingCart = require('../models/shoppingCart');
const Product = require('../models/product');
const errorTypes = require('./errorTypes');
const {FEES} = require('../config');
const utils = require('./utils');

const controller = {
    get: async (req, res, next) => {
        try {
            const shopppingCart = await ShoppingCart.findOne({email: req.user.email});
            if (shopppingCart && shopppingCart.products) {
                const productsId = shopppingCart.products.map((product) => product.id);
                const products = await Product.find({id: {$in: productsId}});
                let totalShoppingCart = 0;
                const shoppingCartWithProducts = products.map((product) => {
                    const productInCart = shopppingCart.products.find(
                        (prodInCart) => prodInCart.id === product.id
                    );
                    const costProduct = utils.getPrice(product._doc, productInCart.units);
                    totalShoppingCart = parseFloat((totalShoppingCart + costProduct).toFixed(2));
                    return {
                        ...product._doc,
                        units: productInCart.units,
                        note: productInCart.note,
                        cost: costProduct,
                    };
                });
                const totalCost = parseFloat(
                    (totalShoppingCart + FEES.deliverFee + FEES.shopperFee).toFixed(2)
                );
                res.json({
                    data: {
                        products: shoppingCartWithProducts,
                        totalShoppingCart,
                        deliverFee: FEES.deliverFee,
                        shopperFee: FEES.shopperFee,
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
                const productsId = shopppingCart.products.map((product) => product.id).filter(Boolean);
                const products = await Product.find({id: {$in: productsId}});
                let totalShoppingCart = 0;
                const shoppingCartWithProducts = products.map((product) => {
                    const productInCart = shopppingCart.products.find(
                        (prodInCart) => prodInCart.id === product.id
                    );
                    const costProduct = utils.getPrice(product._doc, productInCart.units);
                    totalShoppingCart = parseFloat((totalShoppingCart + costProduct).toFixed(2));
                    return {
                        ...product._doc,
                        units: productInCart.units,
                        note: productInCart.note,
                        cost: costProduct,
                    };
                });
                const totalCost = parseFloat(
                    (totalShoppingCart + FEES.deliverFee + FEES.shopperFee).toFixed(2)
                );
                res.json({
                    data: {
                        products: shoppingCartWithProducts,
                        totalShoppingCart,
                        deliverFee: FEES.deliverFee,
                        shopperFee: FEES.shopperFee,
                        totalCost,
                    },
                });
            } else {
                res.json({data: []});
            }
        } catch (err) {
            next(err);
        }
    },
};

module.exports = controller;
