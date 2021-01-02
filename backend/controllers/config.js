'use strict';

const Config = require('../models/config');
const errorTypes = require('./errorTypes');

const controller = {
    config: async (req, res, next) => {
        try {
            const config = await Config.findOne();
            if (config) {
                const {_id, ...configData} = config._doc;
                res.json({
                    data: {
                        ...configData,
                    },
                });
            } else {
                next(new errorTypes.Error404('Config not found.'));
            }
        } catch (err) {
            next(err);
        }
    },
};

module.exports = controller;
