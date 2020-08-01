const mongodb = require('mongodb');
const config = require('../../config');

async function getProducts(query) {
    console.log(query);
    const pageNumber = parseInt(query.pageNumber || 0);
    const pageSize = parseInt(query.pageSize || 20);
    const searchText = query.searchText;

    const limit = pageSize;
    const skip = pageNumber * pageSize;

    let client;
    try {
        client = await mongodb.MongoClient.connect(config.configMongo.url, {useNewUrlParser: true});
        const collection = await client.db(config.configMongo.db).collection(config.collection);
        const textQuery = searchText ? {name: new RegExp(searchText, 'gi')} : {};
        const result = await collection.find(textQuery).sort({__id: -1}).skip(skip).limit(limit).toArray();
        const totalSize = await collection.find(textQuery).count();
        return {
            pageNumber,
            pageSize,
            content: result,
            totalSize,
        };
    } catch (e) {
        console.log(e);
    } finally {
        client.close();
    }
}

async function getProductDetail(params) {
    console.log(params);
    let client;
    try {
        client = await mongodb.MongoClient.connect(config.configMongo.url, {useNewUrlParser: true});
        const collection = await client.db(config.configMongo.db).collection(config.collection);
        const result = await collection.findOne({ean: params.ean});
        return result;
    } catch (e) {
        console.log(e);
    } finally {
        client.close();
    }
}

module.exports = {getProducts, getProductDetail};
