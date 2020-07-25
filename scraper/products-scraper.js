const puppeteer = require('puppeteer-extra');
const mongodb = require('mongodb');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const config = require('./config');

puppeteer.use(StealthPlugin());

const getProductDetail = async (url) => {
    const browser = await puppeteer.launch(config.pupetterOptions);
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitFor(config.timeout);
    const product = await page.evaluate(() => {
        console.log(document);
        const ean = document.querySelector('.reference-container.pdp-reference > .hidden').textContent;
        return {
            ean,
        };
    });
    await browser.close();
    return product;
};

(async () => {
    let client;
    try {
        client = await mongodb.MongoClient.connect(config.configMongo.url, {useNewUrlParser: true});
        const collection = await client.db(config.configMongo.db).collection(config.scrapingUrl.collection);

        const cursor = collection.find().limit(5);
        for (let product = await cursor.next(); product; product = await cursor.next()) {
            console.time('a');
            const productData = await getProductDetail(`${config.marketUrl}${product.url}`);
            const objectId = product._id;
            console.log(productData);
            await collection.updateOne({_id: objectId}, {$set: {ean: productData.ean}});
            console.timeEnd('a');
        }
    } catch (e) {
        console.log(e);
    }
})();
