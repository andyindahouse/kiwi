const puppeteer = require('puppeteer-extra');
const mongodb = require('mongodb');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const axios = require('axios');
const config = require('./config');

puppeteer.use(StealthPlugin());

const getProductDetail = async (url) => {
    console.time('TOTAL TIME');
    let ean = null;
    const browser = await puppeteer.launch(config.pupetterOptions);
    const page = await browser.newPage();
    console.log(url);
    await page.goto(url, {waitUntil: 'networkidle0'});
    await page.waitFor(1000); // wait for a possible redirect (when detail url doesn't exist)

    console.log('PAGE-URL', page.url());
    if (page.url() !== url) {
        console.log('INFO: detail page not found');
    } else {
        try {
            console.log('INFO: looking for ean...');
            console.time('TIME WAITING');
            const elementHandle = await page.waitForSelector('.reference-container.pdp-reference > .hidden', {
                timeout: 5000,
            });
            console.timeEnd('TIME WAITING');
            ean = await page.evaluate((el) => el.textContent, elementHandle);
            console.log(ean);
        } catch (error) {
            console.log('INFO: ean not found', error);
            console.timeEnd('TIME WAITING');
        }
    }
    await browser.close();
    console.timeEnd('TOTAL TIME');
    return {
        ean,
    };
};

const getOpenFoodDataByEan = async (ean) => {
    const openFoodData = await axios.get(`${config.openFoodApi}/${ean}`);
    const {product} = openFoodData.data;
    if (product) {
        return {
            nutriments: {
                nutritionDataPer: parseInt(product['nutrition_data_per']),
                energyKcal100g: parseInt(product.nutriments['energy-kcal_100g']),
                fat100g: parseInt(product.nutriments['fat_100g']),
                saturedFat100g: parseInt(product.nutriments['saturated-fat_100g']),
                carbohydrates100g: parseInt(product.nutriments['carbohydrates_100g']),
                sugar100g: parseInt(product.nutriments['sugars_100g']),
                proteins100g: parseInt(product.nutriments['proteins_100g']),
                salt100g: parseInt(product.nutriments['salt_100g']),
            },
            allergensFromIngredients: product['allergens_from_ingredients'],
            nutriscoreGrade: product['nutriscore_grade'],
            ingredientsTextEs: product['ingredients_text_es'],
            novaGroups: product['nova_groups'],
        };
    }
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

        const cursor = collection.find({ean: {$exists: false}}).addCursorFlag('noCursorTimeout', true);

        for (let product = await cursor.next(); product; product = await cursor.next()) {
            console.log('------------------------------------------------------------');
            console.count();
            const productData = await getProductDetail(`${config.marketUrl}${product.url}`);
            const objectId = product._id;
            if (productData.ean) {
                console.time('OPEN FOODS');
                const openFoodData = await getOpenFoodDataByEan(productData.ean);
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
                console.timeEnd('OPEN FOODS');
            }
        }
        console.log('end collection');
    } catch (e) {
        console.log(e);
    } finally {
        client.close();
    }
})();
