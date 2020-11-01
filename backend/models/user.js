'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    firstName: String,
    lastName: String,
    deliveryAddress: String,
    deliveryWeekDay: String,
    deliveryHour: String,
    phone: String,
    rider: Boolean,
});

module.exports = mongoose.model('User', UserSchema, 'users');
