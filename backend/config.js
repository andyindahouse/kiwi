'use strict';

// Server config
const PORT = 3000;

//Mongo config
const CONFIG_MONGO = {
    URL: 'mongodb://root:example@localhost/kiwi?authSource=admin&w=1',
    URL_: 'mongodb://admin:password@mongo1,mongo2,mongo3/kiwi?replicaSet=rs0&authSource=admin&w=1&',
    DB: 'kiwi',
};

const PRODUCTS_COLLECTION = 'products';

// Passport config
const PASSPORT_CONFIG = {
    JWT_SECRET: 'yoursecret',
    BCRYPT_ROUNDS: 12,
    JWT_LIFETIME: 86400,
    JWT_ALGORITHM: 'HS256',
};

const FEES = {
    deliverFee: 1.95,
    shopperFee: 3.95,
};

POSTAL_CODES_ALLOWED = [28806];

module.exports = {PORT, CONFIG_MONGO, PRODUCTS_COLLECTION, PASSPORT_CONFIG, FEES};
