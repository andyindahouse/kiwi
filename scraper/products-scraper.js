const puppeteer = require('puppeteer-extra');
const mongodb = require('mongodb');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const axios = require('axios');
const config = require('./config');

puppeteer.use(StealthPlugin());

const getProductDetail = async (url) => {
    const browser = await puppeteer.launch(config.pupetterOptions);
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitFor(config.timeout);
    const product = await page.evaluate(() => {
        const ean = document.querySelector('.reference-container.pdp-reference > .hidden').textContent;
        return {
            ean,
        };
    });
    await browser.close();
    return product;
};

const getOpenFoodDataByEan = async (ean) => {
    const openFoodData = await axios.get(`${config.openFoodApi}/${ean}`);
    const {product} = openFoodData.data;
    return {
        nutriments: {
            nutritionDataPer: `${product['nutrition_data_per']}`,
            energyKcal100g: `${product.nutriments['energy-kcal_100g']}${product.nutriments['energy-kcal_unit']}`,
            fat100g: `${product.nutriments['fat_100g']}${product.nutriments['fat_unit']}`,
            saturedFat100g: `${product.nutriments['saturated-fat_100g']}${product.nutriments['saturated-fat_unit']}`,
            carbohydrates100g: `${product.nutriments['carbohydrates_100g']}${product.nutriments['carbohydrates_unit']}`,
            sugar100g: `${product.nutriments['sugars_100g']}${product.nutriments['sugars_unit']}`,
            proteins100g: `${product.nutriments['proteins_100g']}${product.nutriments['proteins_unit']}`,
            salt100g: `${product.nutriments['salt_100g']}${product.nutriments['salt_unit']}`,
        },
    };
};

(async () => {
    console.log('Starting scraping products...');
    let client;
    try {
        client = await mongodb.MongoClient.connect(config.configMongo.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const collection = await client.db(config.configMongo.db).collection(config.scrapingUrl.collection);

        const cursor = collection.find();
        for (let product = await cursor.next(); product; product = await cursor.next()) {
            const productData = await getProductDetail(`${config.marketUrl}${product.url}`);
            const openFoodData = await getOpenFoodDataByEan(productData.ean);
            const objectId = product._id;
            await collection.updateOne(
                {_id: objectId},
                {
                    $set: {
                        ean: productData.ean,
                        ...openFoodData,
                        updatedDate: new Date(),
                    },
                }
            );
            console.log(objectId, 'updated');
        }
    } catch (e) {
        console.log(e);
    } finally {
        client.close();
    }
})();
