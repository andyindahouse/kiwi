'use strict';

const Pantry = require('../models/pantry');
const Product = require('../models/product');
const errorTypes = require('./errorTypes');

const controller = {
    get: async ({query, user}, res, next) => {
        try {
            const pageNumber = parseInt(query.pageNumber || 0);
            const pageSize = parseInt(query.pageSize || 20);

            const limit = pageSize;
            const skip = pageNumber * pageSize;
            const findPantryProducts = {
                email: user.email,
                ...(query.searchText ? {name: new RegExp(query.searchText, 'gi')} : {}),
                ...(query.inStorage
                    ? {inStorage: Array.isArray(query.inStorage) ? query.inStorage : [query.inStorage]}
                    : {}),
            };
            try {
                const totalSize = await Pantry.find(findPantryProducts).countDocuments();
                const result = await Pantry.find(findPantryProducts).sort({_id: -1}).skip(skip).limit(limit);
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
    update: async ({params, user}, res, next) => {
        if (!params.id) {
            return next(new errorTypes.Error400('Falta parametro id.'));
        }
        try {
            const id = new ObjectID({_id: id});
            const updateProductPantry = await Pantry.findOneAndUpdate(
                {_id: id, email: user.email},
                {
                    ...body,
                },
                {
                    new: true,
                    upsert: true,
                    useFindAndModify: true,
                }
            );
            if (updateProductPantry) {
                res.json({data: updateProductPantry});
            } else {
                next(new errorTypes.Error404('Product not found.'));
            }
        } catch (err) {
            next(err);
        }
    },
};

module.exports = controller;
