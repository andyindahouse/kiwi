const configMongo = {
    url: 'mongodb://root:example@localhost/test?authSource=admin&w=1',
    db: 'test',
};

const collection = 'alimentacion-general';

module.exports = {configMongo, collection};
