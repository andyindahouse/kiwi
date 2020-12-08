const puppeteer = require('puppeteer-extra');
const mongodb = require('mongodb');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const config = require('./config');

puppeteer.use(StealthPlugin());

const getTotalProducts = async (page) => {
    const title = await page.evaluate(() => document.title);
    console.log(title);
    const products = title.split('(')[1].substring(0, title.split('(')[1].length - 1);
    return products;
};

const getProducts = async (page) => {
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

const scrapeInfiniteScrollItems = async (page, itemTargetCount, scrollDelay = 1000) => {
    let items = 0;
    try {
        let previousHeight;
        while (items < itemTargetCount) {
            items = await page.evaluate(() => {
                return [...document.querySelectorAll('.grid-item')].length;
            });
            if (items < itemTargetCount) {
                previousHeight = await page.evaluate('document.body.scrollHeight');
                await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
                await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
                await page.waitForTimeout(scrollDelay);
            }
            console.log(items, itemTargetCount);
        }
    } catch (e) {
        console.log(e);
    }
    return await getProducts(page);
};

(async () => {
    console.log('Starting scraping list...');
    console.log(new Date());
    console.time('Scraping time');
    let urls = config.scrapingUrls;
    if (process.argv.length === 3) {
        urls = [urls.find((url) => url.name === process.argv[2])];
        if (!urls) {
            console.log(`Section don't exist`);
            process.exit(404);
        }
    }
    const browser = await puppeteer.launch(config.pupetterOptions);
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    for (let i = 0; i < urls.length; i++) {
        try {
            const url = urls[i].url;
            console.log(`Scraping category ${url}...`);
            await page.goto(url);
            await page.waitForTimeout(config.timeout);
            const products = await getTotalProducts(page);
            console.log(products);
            let urlWithPage = `${url}`;
            let client;

            //Enbale infinite scroll
            const searchButtonNodeSelector = '.button._pagination';
            await page.click(searchButtonNodeSelector);
            await page.waitForTimeout(config.timeout);
            const prods = await scrapeInfiniteScrollItems(page, parseInt(products));
            console.log(prods.length, 'scraped');
            console.log('Inserting items...');
            client = await mongodb.MongoClient.connect(config.configMongo.url, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            const collection = await client.db(config.configMongo.db).collection(urls[i].collection);

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
        } catch (e) {
            console.log(e);
        }
        console.log('Items inserted.');
    }
    try {
        await browser.close();
    } catch (e) {
        console.log(e);
    }
    console.log(`Scraper finished.`);
    console.log(new Date());
    console.timeEnd('Scraping time');
    process.exit();
})();
