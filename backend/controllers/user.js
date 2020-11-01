'use strict';

const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const {PASSPORT_CONFIG} = require('../config');
const User = require('../models/user');
const errorTypes = require('./errorTypes');

const controller = {
    register: (req, res, next) => {
        User.findOne({email: req.body.email})
            .then((data) => {
                if (data) {
                    throw new errorTypes.InfoError('User already exists');
                } else {
                    const hash = bcrypt.hashSync(req.body.password, parseInt(PASSPORT_CONFIG.BCRYPT_ROUNDS));
                    const document = new User({
                        email: req.body.email,
                        password: hash,
                        firstName: req.body.firstName || '',
                        lastName: req.body.lastName || '',
                        deliveryAddress: req.body.deliveryAddress || '',
                        deliveryWeekDay: req.body.deliveryWeekDay || '',
                        deliveryHour: req.body.deliveryHour || '',
                        phone: req.body.phone || '',
                    });
                    return document.save();
                }
            })
            .then((data) => {
                res.json({
                    data: {
                        email: data.email,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        deliveryAddress: data.deliveryAddress,
                        deliveryWeekDay: data.deliveryWeekDay,
                        deliveryHour: data.deliveryHour,
                        phone: data.phone,
                        rider: data.rider,
                    },
                });
            })
            .catch((err) => {
                next(err);
            });
    },
    login: (req, res, next) => {
        passport.authenticate('local', {session: false}, (error, user) => {
            if (error || !user) {
                next(new errorTypes.Error401('Username or password not correct.'));
            } else {
                const payload = {
                    sub: user._id,
                    exp: Date.now() + parseInt(PASSPORT_CONFIG.JWT_LIFETIME),
                    email: user.email,
                };
                const token = jwt.sign(JSON.stringify(payload), PASSPORT_CONFIG.JWT_SECRET, {
                    algorithm: PASSPORT_CONFIG.JWT_ALGORITHM,
                });
                res.json({data: {token: token}});
            }
        })(req, res);
    },
    isEmailTaken: async ({query}, res, next) => {
        if (!query.email) {
            next(new errorTypes.Error400('Query param email not recibed.'));
        }
        try {
            const user = await User.findOne({email: query.email});
            res.json({
                data: {
                    isTaken: !!user,
                },
            });
        } catch (err) {
            next(err);
        }
    },
    getUserInfo: async (req, res, next) => {
        try {
            const user = await User.findOne({email: req.user.email});
            res.json({
                data: {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    deliveryAddress: user.deliveryAddress,
                    deliveryWeekDay: user.deliveryWeekDay,
                    deliveryHour: user.deliveryHour,
                    phone: user.phone,
                    rider: user.rider,
                },
            });
        } catch (err) {
            next(err);
        }
    },
};

module.exports = controller;
