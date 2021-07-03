import Pantry from '../models/pantry';
import {Error400, Error404} from './errorTypes';
import mongodb from 'mongodb';

export default {
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
                    ? {inStorage: {$in: Array.isArray(query.inStorage) ? query.inStorage : [query.inStorage]}}
                    : {}),
                ...(query.perishable ? {$nor: [{inStorage: 'consumed'}, {date: null}]} : {}),
            };
            const order = {
                ...(query.orderBy ? {[query.orderBy]: query.orderDir === 'asc' ? 1 : -1} : {_id: -1}),
            };
            try {
                const totalSize = await Pantry.find(findPantryProducts).countDocuments();
                const match = Object.keys(findPantryProducts).map((key) => {
                    return {[key]: findPantryProducts[key]};
                });

                const result = await Pantry.aggregate([
                    {$match: {$and: match}},
                    ...(query.orderBy === 'date'
                        ? [
                              {$addFields: {fieldType: {$type: '$date'}}},
                              {$sort: {fieldType: 1, ...order}},
                              {$project: {fieldType: 0}},
                          ]
                        : []),
                    {$skip: skip},
                    {$limit: limit},
                ]);
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
    update: async ({params, body, user}, res, next) => {
        if (!params.id) {
            return next(new Error400('Falta parametro id.'));
        }
        try {
            const id = new mongodb.ObjectID(params.id);
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
                next(new Error404('Product not found.'));
            }
        } catch (err) {
            next(err);
        }
    },
};
