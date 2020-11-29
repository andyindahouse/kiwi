const puppeteer = require('puppeteer-extra');
const mongodb = require('mongodb');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const config = require('./config');

puppeteer.use(StealthPlugin());

const getTotalPages = async (url) => {
    const browser = await puppeteer.launch(config.pupetterOptions);
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.goto(url);
    await page.waitForTimeout(config.timeout);
    const pages = await page.evaluate(() =>
        document.querySelector('.pagination').getAttribute('data-pagination-total')
    );
    await browser.close();
    return pages;
};

const getProductsPage = async (url) => {
    const getProducts = async (url) => {
        await page.goto(url);
        await page.waitForTimeout(config.timeout);
        const data = await page.evaluate(() => {
            const getDiscountType = (specialOffer) => {
                if (/(\d+).* unidad al (\d+).* de descuento/.test(specialOffer)) {
                    const [text, valueOne, valueTwo] = /(\d+).* unidad al (\d+).* de descuento/.exec(
                        specialOffer
                    );
                    return {
                        specialOffer: 'offerDiscount',
                        specialOfferValue: [valueOne, valueTwo],
                    };
                }
                if (/Lleva (\d+) y paga (\d+)/.test(specialOffer)) {
                    const [text, valueOne, valueTwo] = /Lleva (\d+) y paga (\d+)/.exec(specialOffer);
                    return {
                        specialOffer: 'quantityDiscount',
                        specialOfferValue: [valueOne, valueTwo],
                    };
                }
            };
            return [...document.querySelectorAll('.grid-item')]
                .filter((elem) => !!elem)
                .map((elem) => {
                    const jsonData = elem.getAttribute('data-json');
                    const offerData = elem.querySelector('.offer-description');
                    if (jsonData) {
                        return {
                            ...JSON.parse(elem.getAttribute('data-json')),
                            img: 'https:' + elem.querySelector(' * > img').getAttribute('src'),
                            url: elem.querySelector('a').getAttribute('href'),
                            ...(offerData
                                ? {...getDiscountType(offerData.textContent)}
                                : {specialOffer: null, specialOfferValue: null}),
                        };
                    }
                    return null;
                })
                .filter(Boolean);
        });
        return data;
    };
    const browser = await puppeteer.launch(config.pupetterOptions);
    const page = await browser.newPage();
    const products = await getProducts(url);
    await browser.close();
    return products;
};

(async () => {
    console.log('Starting scraping list...');
    console.log(new Date());
    console.time('Scraping');
    const urls = config.scrapingUrl;
    for (let i = 0; i <= urls.length; i++) {
        const url = urls[i].url;
        const pages = await getTotalPages(url);
        console.log(`Scraping category ${url}...`);
        let urlWithPage = `${url}`;
        let client;
        try {
            client = await mongodb.MongoClient.connect(config.configMongo.url, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            const collection = await client.db(config.configMongo.db).collection(urls[i].collection);
            for (let j = 1; j <= pages; j++) {
                urlWithPage = `${url}${j}`;
                const prods = await getProductsPage(urlWithPage);
                prods.forEach(async (product) => {
                    const productData = {
                        ...product,
                        market: config.collectionProducts[config.indexCollection].market,
                        img: product.img.replace('40x40.', '325x325.'),
                        updateDate: new Date(),
                    };
                    await collection.findOne({id: productData.id});
                    const result = await collection.updateOne(
                        {id: productData.id},
                        {
                            $set: {...productData},
                        }
                    );
                    if (result.matchedCount === 0) {
                        await collection.insertOne({
                            ...productData,
                            createDate: new Date(),
                            available: true,
                        });
                    }
                });
                console.log(`${pages - j} pages left.`);
            }
            console.log(`Scraper finished.`);
            console.log(new Date());
            console.time('Scraping');
        } catch (e) {
            console.log(e);
        } finally {
            client.close();
        }
    }
})();
