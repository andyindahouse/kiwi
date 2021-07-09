// Server config
export const PORT = 3000;

//Mongo config
export const CONFIG_MONGO = {
    URL: `mongodb://root:${encodeURIComponent('2q"GtK:W{b+<xmt?')}@mongo/kiwi?authSource=admin&w=1`,
    URL_LOCAL: `mongodb://root:${encodeURIComponent('2q"GtK:W{b+<xmt?')}@localhost/kiwi?authSource=admin&w=1`,
    URL_: 'mongodb://admin:password@mongo1,mongo2,mongo3/kiwi?replicaSet=rs0&authSource=admin&w=1&',
    DB: 'kiwi',
};

export const PRODUCTS_COLLECTION = {
    eci: 'productsEci',
};

// Passport config
export const PASSPORT_CONFIG = {
    JWT_SECRET: 'K#$*N8-BBfwFe2a]',
    BCRYPT_ROUNDS: 12,
    JWT_LIFETIME: 86400,
    JWT_ALGORITHM: 'HS256',
};

export const FEES = {
    deliverFee: 4,
    shopperFee: 5,
    discount: 0.5,
};

export const POSTAL_CODES_ALLOWED = [28806];
