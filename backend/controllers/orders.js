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
    getAll: async ({query, user}, res, next) => {
        try {
            const pageNumber = parseInt(query.pageNumber || 0);
            const pageSize = parseInt(query.pageSize || 20);

            const limit = pageSize;
            const skip = pageNumber * pageSize;
            try {
                const totalSize = await Order.find().countDocuments();
                const result = await Order.find().sort({_id: -1}).skip(skip).limit(limit);
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
                const productsId = shopppingCart.products.map((product) => product.ean);
                const products = await Product.find({ean: {$in: productsId}});
                let totalShoppingCart = 0;
                const orderWithProducts = products.map((product, index) => {
                    const costProduct = utils.getPrice(product._doc, shopppingCart.products[index].units);
                    totalShoppingCart = parseFloat((totalShoppingCart + costProduct).toFixed(2));
                    return {
                        ...product._doc,
                        items: new Array(shopppingCart.products[index].units).fill({date: null}),
                        note: shopppingCart.products[index].note,
                        cost: costProduct,
                    };
                });
                const totalCost = parseFloat(
                    (totalShoppingCart + FEES.deliverFee + FEES.shopperFee).toFixed(2)
                );
                const order = {
                    _id: new ObjectID(),
                    email: user.email,
                    createdDate: new Date(),
                    products: orderWithProducts,
                    totalShoppingCart,
                    deliverFee: FEES.deliverFee,
                    shopperFee: FEES.shopperFee,
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
    addProduct: async ({params, body}, res, next) => {
        try {
            if (!body.ean) {
                next(new errorTypes.Error400('Falta parametro ean.'));
            } else if (!body.units) {
                next(new errorTypes.Error400('Falta parametro units.'));
            }
            const id = new ObjectID(params.id);
            const order = await Order.findById(id);
            const productsExist = order.products.find((product) => body.ean === product.ean);
            if (productsExist) {
                return next(new errorTypes.Error400('El producto ya existe en el pedido.'));
            }
            if (order) {
                const product = await Product.findOne({ean: body.ean});
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
                    {_id: id},
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
            const id = new ObjectID(params.id);
            const order = await Order.findById(id);
            if (order) {
                if (!body.items || !body.items.length) {
                    return next(new errorTypes.Error400('Items cannot have length 0'));
                }
                const productIndex = order.products.findIndex((product) => params.ean === product.ean);
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
                        {_id: id},
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
            const id = new ObjectID(params.id);
            const order = await Order.findById(id);
            if (order) {
                const productToDelete = order.products.find((product) => params.ean === product.ean);
                if (!productToDelete) {
                    return next(new errorTypes.Error404('Product not found.'));
                }
                const products = order.products.filter((product) => params.ean !== product.ean);
                const newTotalShoppingCart = parseFloat(
                    (order.totalShoppingCart - productToDelete.cost).toFixed(2)
                );
                const newTotalCost = parseFloat(
                    (order.totalCost - order.totalShoppingCart + newTotalShoppingCart).toFixed(2)
                );

                const updatedOrder = await Order.findOneAndUpdate(
                    {_id: id},
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
                const productsAdded = order.products;
                const pantryProducts = [...products];

                productsAdded.forEach((product) => {
                    const index = pantryProducts.findIndex((productData) => productData.ean === product.ean);
                    if (index > -1) {
                        const productIndex = pantryProducts[index];
                        pantryProducts[index] = {
                            ...productIndex,
                            items: [...productIndex.items, ...product.items],
                        };
                    } else {
                        pantryProducts.push(product);
                    }
                });
            } else {
                next(new errorTypes.Error404('Order not found.'));
            }
        } catch (err) {
            next(err);
        }
    },
};

module.exports = controller;
