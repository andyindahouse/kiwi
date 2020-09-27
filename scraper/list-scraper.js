const puppeteer = require('puppeteer-extra');
const mongodb = require('mongodb');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const config = require('./config');

puppeteer.use(StealthPlugin());

const getTotalPages = async (url) => {
    const browser = await puppeteer.launch(config.pupetterOptions);
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitFor(config.timeout);
    const pages = await page.evaluate(() =>
        document.querySelector('.pagination').getAttribute('data-pagination-total')
    );
    await browser.close();
    return pages;
};

const getProductsPage = async (url) => {
    const getProducts = async (url) => {
        await page.goto(url);
        await page.waitFor(config.timeout);
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
                            ...(offerData && {...getDiscountType(offerData.textContent)}),
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
    const url = config.scrapingUrl.url;
    const pages = await getTotalPages(url);
    console.log(`Scraping category ${config.scrapingUrl.collection}...`);
    let urlWithPage = `${url}`;
    let client;
    try {
        client = await mongodb.MongoClient.connect(config.configMongo.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const collection = await client.db(config.configMongo.db).collection(config.scrapingUrl.collection);
        for (let i = 1; i <= pages; i++) {
            urlWithPage = `${url}${i}`;
            const prods = await getProductsPage(urlWithPage);
            prods.forEach(async (product) => {
                const productData = {
                    ...product,
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
                    });
                }
            });
            console.log(`${pages - i} pages left.`);
        }
        console.log(`Scraper finished.`);
    } catch (e) {
        console.log(e);
    } finally {
        client.close();
    }
})();
