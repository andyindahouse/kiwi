'use strict';

// Server config
const PORT = 3000;

//Mongo config
const CONFIG_MONGO = {
    URL: `mongodb://root:${encodeURIComponent('2q"GtK:W{b+<xmt?')}@mongo/kiwi?authSource=admin&w=1`,
    URL_LOCAL: `mongodb://root:${encodeURIComponent('2q"GtK:W{b+<xmt?')}@localhost/kiwi?authSource=admin&w=1`,
    URL_: 'mongodb://admin:password@mongo1,mongo2,mongo3/kiwi?replicaSet=rs0&authSource=admin&w=1&',
    DB: 'kiwi',
};

const PRODUCTS_COLLECTION = {
    eci: 'productsEci',
};

// Passport config
const PASSPORT_CONFIG = {
    JWT_SECRET: 'K#$*N8-BBfwFe2a]',
    BCRYPT_ROUNDS: 12,
    JWT_LIFETIME: 86400,
    JWT_ALGORITHM: 'HS256',
};

const FEES = {
    deliverFee: 1.95,
    shopperFee: 3.95,
};

const POSTAL_CODES_ALLOWED = [28806];

module.exports = {PORT, CONFIG_MONGO, PRODUCTS_COLLECTION, PASSPORT_CONFIG, FEES, POSTAL_CODES_ALLOWED};
