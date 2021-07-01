import Order from '../models/order.js';
import ShoppingCart from '../models/shoppingCart.js';
import Product from '../models/product.js';
import Pantry from '../models/pantry.js';
import errorTypes from './errorTypes.js';
import mongodb from 'mongodb';
import {FEES} from '../config.js';
import {getDeliveryPrice, getPrice} from './utils.js';

export default {
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
            const id = new mongodb.ObjectID(params.id);
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
                const products = await Product.eci.find({id: {$in: productsId}});
                let totalShoppingCart = 0;
                const orderWithProducts = products
                    .filter((product) => product && product._doc && product._doc.available)
                    .map((product) => {
                        const productInCart = shopppingCart.products.find(
                            (prodInCart) => prodInCart.id === product.id
                        );
                        const costProduct = getPrice(product._doc, productInCart.units);
                        totalShoppingCart = parseFloat((totalShoppingCart + costProduct).toFixed(2));
                        return {
                            ...product._doc,
                            items:
                                product._doc.saleType === 'unit'
                                    ? new Array(productInCart.units).fill({date: null})
                                    : [{date: null}],
                            units: productInCart.units,
                            note: productInCart.note,
                            cost: costProduct,
                        };
                    });
                if (!orderWithProducts.length) {
                    return next(new errorTypes.Error400('Order without products availables.'));
                }
                const deliveryPrice = getDeliveryPrice();
                const totalCost = parseFloat(
                    (
                        totalShoppingCart +
                        deliveryPrice.finalDeliverFee +
                        deliveryPrice.finalShopperFee
                    ).toFixed(2)
                );
                const order = {
                    _id: new mongodb.ObjectID(),
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phone: user.phone,
                    createdDate: new Date(),
                    products: orderWithProducts,
                    totalShoppingCart,
                    ...deliveryPrice,
                    totalCost,
                    status: 'pending',
                    note: body.note,
                    deliveryAddress: body.deliveryAddress,
                    deliveryPostalCode: body.deliveryPostalCode,
                    deliveryDate: body.deliveryDate,
                    deliveryHour: body.deliveryHour,
                    replaceProducts: !!body.replaceProducts,
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
    updateStatus: async ({params, body, user}, res, next) => {
        try {
            const id = new mongodb.ObjectID(params.id);
            const updatedOrder = await Order.findOneAndUpdate(
                {_id: id, email: user.email},
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
    deleteProduct: async ({user, params, body}, res, next) => {
        try {
            const orderId = new mongodb.ObjectID(params.orderId);
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
                    {
                        _id: orderId,
                        email: user.email,
                    },
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
