'use strict';

const Order = require('../models/order');
const ShoppingCart = require('../models/shoppingCart');
const Product = require('../models/product');
const Pantry = require('../models/pantry');
const errorTypes = require('./errorTypes');
const ObjectID = require('mongodb').ObjectID;

const controller = {
    getAll: async ({query, user}, res, next) => {
        try {
            const pageNumber = parseInt(query.pageNumber || 0);
            const pageSize = parseInt(query.pageSize || 20);

            const limit = pageSize;
            const skip = pageNumber * pageSize;
            try {
                const totalSize = await Order.find().countDocuments();
                const result = await Order.find().sort({__id: 1}).skip(skip).limit(limit);
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
                const totalSize = await Order.find({email: user.email}).countDocuments();
                const result = await Order.find({email: user.email}).sort({__id: 1}).skip(skip).limit(limit);
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
                const orderWithProducts = products.map((product, index) => {
                    const costProduct = parseFloat(
                        (shopppingCart.products[index].quantity * product._doc.price.final).toFixed(2)
                    );
                    totalCost += costProduct;
                    const prod = body.products
                        ? body.products.find((prod) => prod.ean === product.ean)
                        : null;
                    return {
                        ...product._doc,
                        items: new Array(shopppingCart.products[index].quantity).fill({date: null}),
                        note: shopppingCart.products[index].note,
                        cost: costProduct,
                    };
                });
                const order = {
                    _id: new ObjectID(body.id),
                    email: user.email,
                    createdDate: new Date(),
                    products: orderWithProducts,
                    totalCost,
                    status: 'pending',
                    note: body.note,
                };
                const saveOrder = await Order.create(order);
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
                res.json({data: saveOrder});
            }
        } catch (err) {
            next(err);
        }
    },
    updateStatus: async ({params, body}, res, next) => {
        try {
            const id = new ObjectID(params.id);
            const updatedOrder = await Order.findOneAndUpdate(
                {_id: id},
                {
                    status: body.status,
                    updatedDate: new Date(),
                },
                {
                    new: true,
                    upsert: false,
                    useFindAndModify: false,
                }
            );
            if (updatedOrder) {
                res.json({data: updatedOrder});
            } else {
                next(new errorTypes.Error404('Order not found.'));
            }
        } catch (err) {
            next(err);
        }
    },
    updateProduct: async ({params, body}, res, next) => {
        try {
            const id = new ObjectID(params.id);
            const order = await Order.findById(id);
            if (order) {
                const productIndex = order.products.findIndex((product) => params.ean === product.ean);
                const products = [...order.products];
                products[productIndex] = {
                    ...products[productIndex],
                    items: body.items,
                };
                if (productIndex > -1) {
                    const updatedOrder = await Order.findOneAndUpdate(
                        {_id: id},
                        {
                            products,
                            updatedDate: new Date(),
                        },
                        {
                            new: true,
                            upsert: false,
                            useFindAndModify: false,
                        }
                    );
                    if (updatedOrder) {
                        res.json({data: updatedOrder});
                    } else {
                        next(new errorTypes.Error404('Order not found.'));
                    }
                } else {
                    next(new errorTypes.Error404('Product not found.'));
                }
            } else {
                next(new errorTypes.Error404('Order not found.'));
            }
        } catch (err) {
            next(err);
        }
    },
    finalizeOrder: async ({params, body, user}, res, next) => {
        try {
            const id = new ObjectID(params.id);
            const order = await Order.findById(id);
            if (order) {
                const updatedOrder = await Order.findOneAndUpdate(
                    {_id: id},
                    {
                        status: 'finalized',
                        updatedDate: new Date(),
                    },
                    {
                        new: true,
                        upsert: false,
                        useFindAndModify: false,
                    }
                );
                const pantry = await Pantry.findOne({email: user.email});
                const products = pantry ? pantry.products : [];
                console.log(order);
                console.log(products);
                const productsAdded = order.products;

                const pantrySaved = await Pantry.findOneAndUpdate(
                    {email: user.email},
                    {email: user.email, products: [products, ...productsAdded]},
                    {
                        new: true,
                        upsert: true,
                        useFindAndModify: false,
                    }
                );
                if (pantrySaved) {
                    res.json({data: updatedOrder});
                } else {
                    next(new errorTypes.Error404('Order not found.'));
                }
            } else {
                next(new errorTypes.Error404('Order not found.'));
            }
        } catch (err) {
            next(err);
        }
    },
};

module.exports = controller;
