'use strict';

const Pantry = require('../models/pantry');
const Product = require('../models/product');
const errorTypes = require('./errorTypes');

const controller = {
    get: async (req, res, next) => {
        try {
            const pantry = await Pantry.findOne({email: req.user.email});
            if (pantry && pantry.products) {
                res.json({data: pantry.products});
            } else {
                res.json({data: []});
            }
        } catch (err) {
            next(err);
        }
    },
    update: async (req, res, next) => {
        try {
            const pantry = await Pantry.findOneAndUpdate(
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
            if (pantry && pantry.products) {
                res.json({data: pantry.products});
            } else {
                res.json({data: []});
            }
        } catch (err) {
            next(err);
        }
    },
};

module.exports = controller;
