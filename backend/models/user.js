'use strict';

const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
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

module.exports = model('User', UserSchema, 'users');
