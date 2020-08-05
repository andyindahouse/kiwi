'use strict';

const Checkout = require('../models/checkout');
const ShoppingCart = require('../models/shoppingCart');
const Product = require('../models/product');
const errorTypes = require('./errorTypes');

const controller = {
    getAll: async ({query, user}, res, next) => {
        try {
            const pageNumber = parseInt(query.pageNumber || 0);
            const pageSize = parseInt(query.pageSize || 20);

            const limit = pageSize;
            const skip = pageNumber * pageSize;
            try {
                const totalSize = await Checkout.find().countDocuments();
                const result = await Checkout.find().sort({__id: 1}).skip(skip).limit(limit);
                res.json({
                    pageNumber,
                    pageSize,
                    content: result,
                    totalSize,
                });
            } catch (err) {
                next(err);
            }
        } catch (err) {
            next(err);
        }
    },
    get: async ({query, user}, res, next) => {
        try {
            const pageNumber = parseInt(query.pageNumber || 0);
            const pageSize = parseInt(query.pageSize || 20);

            const limit = pageSize;
            const skip = pageNumber * pageSize;
            try {
                const totalSize = await Checkout.find({email: user.email}).countDocuments();
                const result = await Checkout.find({email: user.email})
                    .sort({__id: 1})
                    .skip(skip)
                    .limit(limit);
                res.json({
                    pageNumber,
                    pageSize,
                    content: result,
                    totalSize,
                });
            } catch (err) {
                next(err);
            }
        } catch (err) {
            next(err);
        }
    },
    create: async ({user, body}, res, next) => {
        try {
            const shopppingCart = await ShoppingCart.findOne({email: user.email});
            if (shopppingCart && shopppingCart.products) {
                const productsId = shopppingCart.products.map((product) => product.ean);
                const products = await Product.find({ean: {$in: productsId}});
                let totalCost = 0;
                const checkoutWithProducts = products.map((product, index) => {
                    const costProduct = (
                        shopppingCart.products[index].quantity * product._doc.price.final
                    ).toFixed(2);
                    totalCost += costProduct;
                    return {
                        ...product._doc,
                        quantity: shopppingCart.products[index].quantity,
                        cost: costProduct,
                    };
                });
                const checkout = {
                    email: user.email,
                    createdDate: new Date(),
                    products: checkoutWithProducts,
                    totalCost,
                    status: 'pending',
                    note: body.note,
                };
                const saveCheckout = await Checkout.create(checkout);
                await ShoppingCart.findOneAndUpdate(
                    {email: user.email},
                    {
                        email: user.email,
                        products: [],
                    },
                    {
                        new: true,
                        upsert: true,
                        useFindAndModify: true,
                    }
                );
                res.json({data: saveCheckout});
            }
        } catch (err) {
            next(err);
        }
    },
};

module.exports = controller;
