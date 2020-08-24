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
    getAllAvailables: async ({query, user}, res, next) => {
        try {
            const pageNumber = parseInt(query.pageNumber || 0);
            const pageSize = parseInt(query.pageSize || 20);

            const limit = pageSize;
            const skip = pageNumber * pageSize;
            try {
                const totalSize = await Order.find({rider: {$exists: false}}).countDocuments();
                const result = await Order.find({rider: {$exists: false}})
                    .sort({_id: -1})
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
    get: async ({query, user}, res, next) => {
        try {
            const pageNumber = parseInt(query.pageNumber || 0);
            const pageSize = parseInt(query.pageSize || 20);

            const limit = pageSize;
            const skip = pageNumber * pageSize;
            const findOrder = {
                rider: user.email,
                ...(query.status
                    ? {status: Array.isArray(query.status) ? query.status : [query.status]}
                    : {}),
            };
            try {
                const totalSize = await Order.find(findOrder).countDocuments();
                const result = await Order.find(findOrder).sort({_id: -1}).skip(skip).limit(limit);
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
            return next(new errorTypes.Error400('Falta parametro id.'));
        }
        try {
            const id = new ObjectID(params.id);
            const result = await Order.findOne({_id: id});
            if (!result) {
                next(new errorTypes.Error404('Order not found.'));
            } else {
                res.json(result);
            }
        } catch (err) {
            next(err);
        }
    },
    assign: async ({params, body, user}, res, next) => {
        try {
            if (!params.id) {
                return next(new errorTypes.Error400('Falta parametro id.'));
            }
            const id = new ObjectID(params.id);
            const order = await Order.findOne({_id: id});
            if (!order) {
                return next(new errorTypes.Error404('Order not found.'));
            }
            if (order.rider) {
                return next(new errorTypes.Error400('Order already had been asigned.'));
            }
            const updatedOrder = await Order.findOneAndUpdate(
                {_id: id},
                {
                    rider: user.email,
                    updatedDate: new Date(),
                    products: order.products.map((e) => ({...e, statusOrder: 'pending'})),
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
    updateStatus: async ({params, body, user}, res, next) => {
        try {
            const id = new ObjectID(params.id);
            const updatedOrder = await Order.findOneAndUpdate(
                {_id: id, rider: user.email},
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
    addProduct: async ({params, body, user}, res, next) => {
        try {
            if (!body.ean) {
                return next(new errorTypes.Error400('Falta parametro ean.'));
            } else if (!body.units) {
                return next(new errorTypes.Error400('Falta parametro units.'));
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
                    {_id: id, rider: user.email},
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
    updateProduct: async ({params, body, user}, res, next) => {
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
                const newProduct = {
                    ...products[productIndex],
                    ...body,
                };
                const newCostProduct = utils.getPrice(newProduct, newProduct.items.length);
                products[productIndex] = {
                    ...newProduct,
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
                        {_id: id, rider: user.email},
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
    deleteProduct: async ({params, body, user}, res, next) => {
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
                    {_id: id, rider: user.email},
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
                    {_id: id, rider: user.email},
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

                const newProducts = order.products.reduce((acum, product) => {
                    const items = product.items.map((item) => {
                        console.log(item);
                        return {
                            ...item,
                            inStorage: 'pending',
                            ean: product.ean,
                            img: product.img,
                            name: product.name,
                            buyedDate: new Date(),
                            email: order.email,
                        };
                    });
                    return [...acum, ...items];
                }, []);

                console.log(newProducts);

                try {
                    await Pantry.insertMany(newProducts);
                } catch (err) {
                    next(err);
                }

                if (updatedOrder) {
                    res.json({data: updatedOrder});
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
