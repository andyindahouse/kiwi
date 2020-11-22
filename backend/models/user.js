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
    deliveryPostalCode: String,
    deliveryCity: String,
    deliveryVehicle: String,
    phone: String,
    rider: Boolean,
    active: Boolean,
});

module.exports = mongoose.model('User', UserSchema, 'users');
