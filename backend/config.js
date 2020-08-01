'use strict';

// Server config
const PORT = 3000;

//Mongo config
const CONFIG_MONGO = {
    URL: 'mongodb://root:example@localhost/test?authSource=admin&w=1',
    DB: 'test',
};

const PRODUCTS_COLLECTION = 'alimentacion-general';

// Passport config
const PASSPORT_CONFIG = {
    JWT_SECRET: 'yoursecret',
    BCRYPT_ROUNDS: 12,
    JWT_LIFETIME: 86400,
    JWT_ALGORITHM: 'HS256',
};

module.exports = {PORT, CONFIG_MONGO, PRODUCTS_COLLECTION, PASSPORT_CONFIG};
