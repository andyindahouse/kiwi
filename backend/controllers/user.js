'use strict';

const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const {PASSPORT_CONFIG, POSTAL_CODES_ALLOWED} = require('../config');
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
                        deliveryCity: req.body.deliveryCity || '',
                        deliveryVehicle: req.body.deliveryVehicle || '',
                        phone: req.body.phone || '',
                        deliveryPostalCode: req.body.deliveryPostalCode || '',
                        active: false,
                        ...(req.baseUrl === '/api/rider' && {rider: true}),
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
                        deliveryPostalCode: data.deliveryPostalCode,
                        deliveryCity: data.deliveryCity,
                        deliveryVehicle: data.deliveryVehicle,
                        phone: data.phone,
                        rider: data.rider,
                    },
                });
            })
            .catch((err) => {
                next(err);
            });
    },
    login: async (req, res, next) => {
        const user = await User.findOne({email: req.body.email});
        if (!user) {
            return next(new errorTypes.Error401('Username or password not correct.'));
        } else {
            const isRider = req.baseUrl === '/api/rider';
            if (isRider && !user.rider) {
                return next(new errorTypes.Error401('Username or password not correct.'));
            } else if (!isRider && !!user.rider) {
                return next(new errorTypes.Error401('Username or password not correct.'));
            }
        }

        passport.authenticate('local', {session: false}, (error, user) => {
            if (error || !user) {
                return next(new errorTypes.Error401('Username or password not correct.'));
            } else if (!user.active) {
                return next(new errorTypes.Error401('User is not active.'));
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
            return next(new errorTypes.Error400('Query param email not recibed.'));
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
    isPostalCodeAllowed: async ({query}, res, next) => {
        if (!query.postalCode) {
            return next(new errorTypes.Error400('Query param postalCode not recibed.'));
        }
        res.json({
            data: {
                isAllowed: POSTAL_CODES_ALLOWED.indexOf(parseInt(query.postalCode)) > -1,
            },
        });
    },
    getDeliveryCities: async ({query}, res, next) => {
        res.json({
            data: {
                deliveryCities: ['Alcalá de Henares'],
            },
        });
    },
    getUserInfo: async (req, res, next) => {
        try {
            const user = req.user;
            res.json({
                data: {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    deliveryAddress: user.deliveryAddress,
                    deliveryWeekDay: user.deliveryWeekDay,
                    deliveryHour: user.deliveryHour,
                    deliveryPostalCode: user.deliveryPostalCode,
                    deliveryCity: user.deliveryCity,
                    deliveryVehicle: user.deliveryVehicle,
                    phone: user.phone,
                    rider: user.rider,
                    active: user.active,
                },
            });
        } catch (err) {
            next(err);
        }
    },
    editUserInfo: async (req, res, next) => {
        const userInfo = req.body;
        try {
            const updatedUser = await User.findOneAndUpdate(
                {email: req.user.email},
                {
                    ...(userInfo.firstName && {firstName: userInfo.firstName}),
                    ...(userInfo.lastName && {lastName: userInfo.lastName}),
                    ...(userInfo.deliveryAddress && {deliveryAddress: userInfo.deliveryAddress}),
                    ...(userInfo.deliveryWeekDay && {deliveryWeekDay: userInfo.deliveryWeekDay}),
                    ...(userInfo.deliveryHour && {deliveryHour: userInfo.deliveryHour}),
                    ...(userInfo.deliveryPostalCode && {deliveryPostalCode: userInfo.deliveryPostalCode}),
                    ...(userInfo.deliveryCity && {deliveryCity: userInfo.deliveryCity}),
                    ...(userInfo.deliveryVehicle && {deliveryVehicle: userInfo.deliveryVehicle}),
                    ...(userInfo.phone && {phone: userInfo.phone}),
                },
                {
                    new: true,
                    upsert: false,
                    useFindAndModify: false,
                }
            );
            if (updatedUser) {
                res.json({
                    data: {
                        email: updatedUser.email,
                        firstName: updatedUser.firstName,
                        lastName: updatedUser.lastName,
                        deliveryAddress: updatedUser.deliveryAddress,
                        deliveryWeekDay: updatedUser.deliveryWeekDay,
                        deliveryHour: updatedUser.deliveryHour,
                        deliveryPostalCode: updatedUser.deliveryPostalCode,
                        deliveryCity: updatedUser.deliveryCity,
                        deliveryVehicle: updatedUser.deliveryVehicle,
                        phone: updatedUser.phone,
                        rider: updatedUser.rider,
                        active: updatedUser.active,
                    },
                });
            } else {
                next(new errorTypes.Error404('User not found.'));
            }
        } catch (err) {
            next(err);
        }
    },
    editUserPassword: async (req, res, next) => {
        if (!req.body.newPassword || !req.body.oldPassword) {
            return next(new errorTypes.Error400('Passwords not recived.'));
        }
        if (!bcrypt.compareSync(req.body.oldPassword, req.user.password)) {
            return next(new errorTypes.Error400('Password error.'));
        }
        try {
            const updatedUserPassword = await User.findOneAndUpdate(
                {email: req.user.email},
                {
                    password: bcrypt.hashSync(req.body.newPassword, parseInt(PASSPORT_CONFIG.BCRYPT_ROUNDS)),
                },
                {
                    new: true,
                    upsert: false,
                    useFindAndModify: false,
                }
            );
            if (updatedUserPassword) {
                res.json({
                    data: {
                        email: updatedUserPassword.email,
                        firstName: updatedUserPassword.firstName,
                        lastName: updatedUserPassword.lastName,
                        deliveryAddress: updatedUserPassword.deliveryAddress,
                        deliveryWeekDay: updatedUserPassword.deliveryWeekDay,
                        deliveryHour: updatedUserPassword.deliveryHour,
                        deliveryPostalCode: updatedUserPassword.deliveryPostalCode,
                        deliveryCity: updatedUserPassword.deliveryCity,
                        deliveryVehicle: updatedUserPassword.deliveryVehicle,
                        phone: updatedUserPassword.phone,
                        rider: updatedUserPassword.rider,
                        active: updatedUserPassword.active,
                    },
                });
            } else {
                next(new errorTypes.Error404('User not found.'));
            }
        } catch (err) {
            next(err);
        }
    },
};

module.exports = controller;
