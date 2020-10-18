'use strict';

const Order = require('../models/order');
const ShoppingCart = require('../models/shoppingCart');
const Product = require('../models/product');
const Pantry = require('../models/pantry');
const errorTypes = require('./errorTypes');
const ObjectID = require('mongodb').ObjectID;
const {FEES} = require('../config');
const utils = require('./utils');

const controller = {
    get: async ({query, user}, res, next) => {
        try {
            const pageNumber = parseInt(query.pageNumber || 0);
            const pageSize = parseInt(query.pageSize || 20);

            const limit = pageSize;
            const skip = pageNumber * pageSize;
            try {
                const totalSize = await Order.find({email: user.email}).countDocuments();
                const result = await Order.find({email: user.email}).sort({_id: -1}).skip(skip).limit(limit);
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
    getById: async ({params, user}, res, next) => {
        if (!params.id) {
            next(new errorTypes.Error400('Falta parametro id.'));
        }
        try {
            const id = new ObjectID(params.id);
            const result = await Order.findOne({_id: id, email: user.email});
            if (!result) {
                next(new errorTypes.Error404('Order not found.'));
            } else {
                res.json(result);
            }
        } catch (err) {
            next(err);
        }
    },
    create: async ({user, body}, res, next) => {
        try {
            const shopppingCart = await ShoppingCart.findOne({email: user.email});
            if (shopppingCart && shopppingCart.products) {
                const productsId = shopppingCart.products.map((product) => product.id);
                const products = await Product.find({id: {$in: productsId}});
                let totalShoppingCart = 0;
                const orderWithProducts = products.map((product) => {
                    const productInCart = shopppingCart.products.find(
                        (prodInCart) => prodInCart.id === product.id
                    );
                    const costProduct = utils.getPrice(product._doc, productInCart.units);
                    totalShoppingCart = parseFloat((totalShoppingCart + costProduct).toFixed(2));
                    return {
                        ...product._doc,
                        items: new Array(productInCart.units).fill({date: null}),
                        note: productInCart.note,
                        cost: costProduct,
                    };
                });
                const totalCost = parseFloat(
                    (totalShoppingCart + FEES.deliverFee + FEES.shopperFee).toFixed(2)
                );
                const order = {
                    _id: new ObjectID(),
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    phone: user.phone,
                    createdDate: new Date(),
                    products: orderWithProducts,
                    totalShoppingCart,
                    deliverFee: FEES.deliverFee,
                    shopperFee: FEES.shopperFee,
                    totalCost,
                    status: 'pending',
                    note: body.note,
                    deliveryAddress: body.deliveryAddress,
                    deliveryDate: body.deliveryDate,
                    deliveryHour: body.deliveryHour,
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
                {_id: id, email: email.user},
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
    addProduct: async ({params, body}, res, next) => {
        try {
            if (!body.id) {
                next(new errorTypes.Error400('Falta parametro id.'));
            } else if (!body.units) {
                next(new errorTypes.Error400('Falta parametro units.'));
            }
            const id = new ObjectID(params.id);
            const order = await Order.findById(id);
            const productsExist = order.products.find((product) => body.id === product.id);
            if (productsExist) {
                return next(new errorTypes.Error400('El producto ya existe en el pedido.'));
            }
            if (order) {
                const product = await Product.findOne({id: body.id});
                if (!product) {
                    next(new errorTypes.Error404('Product not found.'));
                }
                const products = [...order.products];
                const costProduct = utils.getPrice(product._doc, body.units);
                products.push({
                    ...product._doc,
                    items: new Array(body.units).fill({date: null}),
                    ...(body.note && {note: body.note}),
                    cost: costProduct,
                });
                const newTotalShoppingCart = parseFloat((order.totalShoppingCart + costProduct).toFixed(2));
                const newTotalCost = parseFloat((order.totalCost + costProduct).toFixed(2));
                const updatedOrder = await Order.findOneAndUpdate(
                    {_id: id, email: email.user},
                    {
                        products,
                        updatedDate: new Date(),
                        totalShoppingCart: newTotalShoppingCart,
                        totalCost: newTotalCost,
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
                next(new errorTypes.Error404('Order not found.'));
            }
        } catch (err) {
            next(err);
        }
    },
    updateProduct: async ({params, body}, res, next) => {
        try {
            const orderId = new ObjectID(params.orderId);
            const order = await Order.findById(orderId);
            if (order) {
                if (!body.items || !body.items.length) {
                    return next(new errorTypes.Error400('Items cannot have length 0'));
                }
                const productIndex = order.products.findIndex((product) => params.id === product.id);
                const products = [...order.products];
                const oldCostProduct = products[productIndex].cost;
                const newCostProduct = utils.getPrice(products[productIndex], body.items.length);
                products[productIndex] = {
                    ...products[productIndex],
                    items: body.items,
                    note: body.note,
                    cost: newCostProduct,
                };
                const newTotalShoppingCart = parseFloat(
                    (order.totalShoppingCart - oldCostProduct + newCostProduct).toFixed(2)
                );
                const newTotalCost = parseFloat(
                    (order.totalCost - order.totalShoppingCart + newTotalShoppingCart).toFixed(2)
                );
                if (productIndex > -1) {
                    const updatedOrder = await Order.findOneAndUpdate(
                        {_id: orderId, email: email.user},
                        {
                            products,
                            updatedDate: new Date(),
                            totalShoppingCart: newTotalShoppingCart,
                            totalCost: newTotalCost,
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
    deleteProduct: async ({params, body}, res, next) => {
        try {
            const orderId = new ObjectID(params.orderId);
            const order = await Order.findById(orderId);
            if (order) {
                const productToDelete = order.products.find((product) => params.id === product.id);
                if (!productToDelete) {
                    return next(new errorTypes.Error404('Product not found.'));
                }
                const products = order.products.filter((product) => params.id !== product.id);
                const newTotalShoppingCart = parseFloat(
                    (order.totalShoppingCart - productToDelete.cost).toFixed(2)
                );
                const newTotalCost = parseFloat(
                    (order.totalCost - order.totalShoppingCart + newTotalShoppingCart).toFixed(2)
                );

                const updatedOrder = await Order.findOneAndUpdate(
                    {_id: orderId, email: email.user},
                    {
                        products,
                        updatedDate: new Date(),
                        totalShoppingCart: newTotalShoppingCart,
                        totalCost: newTotalCost,
                        status: products.length ? order.status : 'cancelled',
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
                next(new errorTypes.Error404('Order not found.'));
            }
        } catch (err) {
            next(err);
        }
    },
};

module.exports = controller;
