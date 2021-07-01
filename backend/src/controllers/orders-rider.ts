import Order from '../models/order';
import ShoppingCart from '../models/shoppingCart';
import Product from '../models/product';
import Pantry from '../models/pantry';
import {Error400, Error404} from './errorTypes';
import mongodb from 'mongodb';
import {FEES} from '../config';
import {getDeliveryPrice, getPrice} from './utils';

export default {
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
            return next(new Error400('Falta parametro id.'));
        }
        try {
            const id = new mongodb.ObjectID(params.id);
            const result = await Order.findOne({_id: id});
            if (!result) {
                next(new Error404('Order not found.'));
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
                return next(new Error400('Falta parametro id.'));
            }
            const id = new mongodb.ObjectID(params.id);
            const order = await Order.findOne({_id: id});
            if (!order) {
                return next(new Error404('Order not found.'));
            }
            if (order.rider) {
                return next(new Error400('Order already had been asigned.'));
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
                next(new Error404('Order not found.'));
            }
        } catch (err) {
            next(err);
        }
    },
    updateStatus: async ({params, body, user}, res, next) => {
        try {
            const id = new mongodb.ObjectID(params.id);
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
                next(new Error404('Order not found.'));
            }
        } catch (err) {
            next(err);
        }
    },
    addProduct: async ({params, body, user}, res, next) => {
        try {
            if (!body.id) {
                return next(new Error400('Falta parametro id.'));
            } else if (!body.units) {
                return next(new Error400('Falta parametro units.'));
            }
            const id = new mongodb.ObjectID(params.id);
            const order = await Order.findById(id);
            const productsExist = order.products.find((product) => body.id === product.id);
            if (productsExist) {
                return next(new Error400('El producto ya existe en el pedido.'));
            }
            if (order) {
                const product = await Product.eci.findOne({id: body.id});
                if (!product) {
                    next(new Error404('Product not found.'));
                }
                const products = [...order.products];
                const costProduct = getPrice(product._doc, body.units);
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
                    next(new Error404('Order not found.'));
                }
            } else {
                next(new Error404('Order not found.'));
            }
        } catch (err) {
            next(err);
        }
    },
    updateProduct: async ({params, body, user}, res, next) => {
        try {
            const orderId = new mongodb.ObjectID(params.orderId);
            const order = await Order.findById(orderId);
            if (order) {
                if (!body.items || !body.items.length) {
                    return next(new Error400('Items cannot have length 0'));
                }
                const productIndex = order.products.findIndex((product) => params.id === product.id);
                const products = [...order.products];
                const newProduct = {
                    ...products[productIndex],
                    ...body,
                };
                const newCostProduct = getPrice(newProduct, newProduct.items.length);
                products[productIndex] = {
                    ...newProduct,
                    cost: newCostProduct,
                };

                let totalShoppingCart = 0;
                const orderWithProducts = products.map((product, index) => {
                    const costProduct = getPrice(product, product.items.length);
                    if (product.statusOrder !== 'not-available') {
                        totalShoppingCart = parseFloat((totalShoppingCart + costProduct).toFixed(2));
                    }
                    return {
                        ...product,
                        items: new Array(order.products[index].units).fill({date: null}),
                        note: order.products[index].note,
                        cost: costProduct,
                    };
                });
                const deliveryPrice = getDeliveryPrice();
                const totalCost = parseFloat(
                    (
                        totalShoppingCart +
                        deliveryPrice.finalDeliverFee +
                        deliveryPrice.finalShopperFee
                    ).toFixed(2)
                );

                if (productIndex > -1) {
                    const updatedOrder = await Order.findOneAndUpdate(
                        {_id: orderId, rider: user.email},
                        {
                            products,
                            updatedDate: new Date(),
                            totalShoppingCart,
                            totalCost,
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
                        next(new Error404('Order not found.'));
                    }
                } else {
                    next(new Error404('Product not found.'));
                }
            } else {
                next(new Error404('Order not found.'));
            }
        } catch (err) {
            next(err);
        }
    },
    deleteProduct: async ({params, body, user}, res, next) => {
        try {
            const orderId = new mongodb.ObjectID(params.orderId);
            const order = await Order.findById(orderId);
            if (order) {
                const productToDelete = order.products.find((product) => params.id === product.id);
                if (!productToDelete) {
                    return next(new Error404('Product not found.'));
                }
                const products = order.products.filter((product) => params.id !== product.id);
                const newTotalShoppingCart = parseFloat(
                    (order.totalShoppingCart - productToDelete.cost).toFixed(2)
                );
                const newTotalCost = parseFloat(
                    (order.totalCost - order.totalShoppingCart + newTotalShoppingCart).toFixed(2)
                );

                const updatedOrder = await Order.findOneAndUpdate(
                    {_id: orderId, rider: user.email},
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
                    next(new Error404('Order not found.'));
                }
            } else {
                next(new Error404('Order not found.'));
            }
        } catch (err) {
            next(err);
        }
    },
    finalizeOrder: async ({params, body, user}, res, next) => {
        try {
            const id = new mongodb.ObjectID(params.id);
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
                            id: product.id,
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
                next(new Error404('Order not found.'));
            }
        } catch (err) {
            next(err);
        }
    },
};