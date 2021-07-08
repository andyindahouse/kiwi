import puppeteer from 'puppeteer-extra';
import mongodb from 'mongodb';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import * as config from './config.js';

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
                const [, valueOne, valueTwo] = /(\d+).* unidad al (\d+).* de descuento/.exec(specialOffer);
                return {
                    specialOffer: 'offerDiscount',
                    specialOfferValue: [valueOne, valueTwo],
                };
            }
            if (/Lleva (\d+) y paga (\d+)/.test(specialOffer)) {
                const [, valueOne, valueTwo] = /Lleva (\d+) y paga (\d+)/.exec(specialOffer);
                return {
                    specialOffer: 'quantityDiscount',
                    specialOfferValue: [valueOne, valueTwo],
                };
            }
        };
        const getProductSaleType = (productSaleType) => {
            switch (productSaleType) {
                // only sold by weigth (Example: 300gr steak)
                case 'SELLING_TYPE_WEIGHT':
                    return 'weight';
                // one piece or sold by % pieces (Example: 200gr salmon or one salmon)
                case 'SELLING_TYPE_WEIGHT_AND_UNIT':
                    return 'weight_and_unit';
                // products sold by unit (Example: bottle of water)
                case 'SELLING_TYPE_TRAY':
                case 'SELLING_TYPE_UNIT':
                    return 'unit';
                // full pieces (price -> X kg of piece)  (Example: one chicken)
                case 'SELLING_TYPE_PIECE':
                    return 'piece';
                default:
                    return 'unit';
            }
        };
        return [...document.querySelectorAll('.grid-item')]
            .filter((elem) => !!elem)
            .map((elem) => {
                const jsonData = elem.getAttribute('data-json');
                // const productDefaultListOption = elem.getAttribute('data-product-default_list_options');
                const productSaleType = elem.getAttribute('data-product-sale_type');
                const hasPreparations = !!elem.getAttribute('data-product-preparations');
                const isCooled = !!elem.querySelector('span[title="Producto refrigerado"]');
                const isGlutenFree = !!elem.querySelector('span[title="Producto sin gluten"]');
                const isLactoseFree = !!elem.querySelector('span[title="Producto sin lactosa"]');
                const offerData = !!elem.querySelector('.offer-description');

                if (jsonData) {
                    return {
                        ...JSON.parse(elem.getAttribute('data-json')),
                        img: 'https:' + elem.querySelector(' * > img').getAttribute('src'),
                        url: elem.querySelector('a').getAttribute('href'),
                        ...(offerData
                            ? {...getDiscountType(offerData.textContent)}
                            : {specialOffer: null, specialOfferValue: null}),
                        saleType: getProductSaleType(productSaleType),
                        hasPreparations,
                        isCooled,
                        isGlutenFree,
                        isLactoseFree,
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
            items = await page.evaluate(() => [...document.querySelectorAll('.grid-item')].length);
            if (items < itemTargetCount) {
                previousHeight = await page.evaluate('document.body.scrollHeight');
                await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
                await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
                await page.waitForTimeout(scrollDelay);
            }
        }
    } catch (e) {
        console.log(e);
    }
    return await getProducts(page);
};

const initScrapper = async () => {
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

    for (let i = 0; i < urls.length; i++) {
        try {
            const supermarket = urls[i];
            const url = urls[i].url;
            console.log(`Scraping category ${url}...`);
            await page.goto(url, {waitUntil: 'networkidle0'});
            await page.waitForTimeout(1000); // redirect from check page

            const products = await getTotalProducts(page);
            console.log({products});
            let client;

            const paginationEnabled = await page.evaluate(
                `document.querySelector('.button._pagination._on')`
            );
            if (!paginationEnabled) {
                //Enable infinite scroll
                const searchButtonNodeSelector = '.button._pagination';
                await page.click(searchButtonNodeSelector);
                // In this point if the checks to avoid scrapping
                await page.waitForTimeout(1000); // refresh when pagination mode change
            }

            //Polling
            await page.evaluate('window.scrollBy(0, 100000000)');
            let numberPage = 2;
            let pageSize = 24;
            while (numberPage * pageSize < products) {
                await page.waitForResponse(supermarket.api.replace('%NUMBERPAGE%', String(numberPage)), {
                    timeout: 9999,
                });
                numberPage += 1;
            }

            const prods = await scrapeInfiniteScrollItems(page, parseInt(products));
            console.log('scraped', prods.length);
            console.log('Inserting items...');
            client = await mongodb.MongoClient.connect(config.configMongo.url, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            const collection = await client.db(config.configMongo.db).collection(urls[i].collection);

            for (let j = 0; j < prods.length; j++) {
                const productData = {
                    ...prods[j],
                    market: config.collectionProducts[config.indexCollection].market,
                    img: prods[j].img.replace('40x40.', '325x325.'),
                    updateDate: new Date(),
                    available: true,
                };
                if (productData.status === 'AVAILABLE') {
                    const result = await collection.updateOne(
                        {id: productData.id},
                        {
                            $set: {
                                ...productData,
                            },
                        }
                    );
                    if (result.matchedCount === 0) {
                        await collection.insertOne({
                            ...productData,
                            createDate: new Date(),
                        });
                    }
                }
            }
            console.log(`${supermarket.name} Items inserted.`);
        } catch (e) {
            console.log(e);
        }
    }
    try {
        await page.close();
        await browser.close();
    } catch (e) {
        console.log(e);
    }
    console.log(`Scraper finished.`);
    console.log(new Date());
    console.timeEnd('Scraping time');
    process.exit();
};

initScrapper();
