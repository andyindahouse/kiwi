'use strict';

const ShoppingCart = require('../models/shoppingCart');
const Product = require('../models/product');
const errorTypes = require('./errorTypes');
const {FEES} = require('../config');
const utils = require('./utils');

const calculateShoppingCart = async (shopppingCart) => {
    if (shopppingCart && shopppingCart.products) {
        const productsId = shopppingCart.products.map((product) => product.id);
        const products = await Product.eci.find({id: {$in: productsId}});
        let totalShoppingCart = 0;
        const shoppingCartWithProducts = products.map((product) => {
            const productInCart = shopppingCart.products.find((prodInCart) => prodInCart.id === product.id);
            const costProduct = utils.getPrice(product._doc, productInCart.units);
            if (product._doc.available === true) {
                totalShoppingCart = parseFloat((totalShoppingCart + costProduct).toFixed(2));
            }
            return {
                ...product._doc,
                units: productInCart.units,
                note: productInCart.note,
                cost: costProduct,
            };
        });
        const deliveryPrice = utils.getDeliveryPrice();
        const totalCost = parseFloat(
            (totalShoppingCart + deliveryPrice.finalDeliverFee + deliveryPrice.finalShopperFee).toFixed(2)
        );
        return {
            data: {
                products: shoppingCartWithProducts,
                totalShoppingCart,
                ...deliveryPrice,
                totalCost,
            },
        };
    } else {
        return {
            data: {
                products: [],
                totalCost: 0,
            },
        };
    }
};
const controller = {
    get: async (req, res, next) => {
        try {
            const shopppingCart = await ShoppingCart.findOne({email: req.user.email});
            const data = await calculateShoppingCart(shopppingCart);
            res.json(data);
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
            const data = await calculateShoppingCart(shopppingCart);
            res.json(data);
        } catch (err) {
            next(err);
        }
    },
};

module.exports = controller;
