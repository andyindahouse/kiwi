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
                        first_name: req.body.first_name || '',
                        last_name: req.body.last_name || '',
                    });
                    return document.save();
                }
            })
            .then((data) => {
                res.json({data: data});
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
};

module.exports = controller;
