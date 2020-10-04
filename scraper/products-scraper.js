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
        const ean = document.querySelector('.reference-container.pdp-reference > .hidden')
            ? document.querySelector('.reference-container.pdp-reference > .hidden').textContent
            : null;
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
            const objectId = product._id;
            if (productData.ean) {
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
            } else {
                console.log(objectId, 'not ean found');
            }
        }
    } catch (e) {
        console.log(e);
    } finally {
        client.close();
    }
})();
