const puppeteer = require('puppeteer-extra');
const mongodb = require('mongodb');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const config = require('./config');

puppeteer.use(StealthPlugin());

// const getTotalPages = async (page) => {
//     const pages = await page.evaluate(() =>
//         document.querySelector('.pagination').getAttribute('data-pagination-total')
//     );
//     return pages;
// };

const getTotalProducts = async (page) => {
    const title = await page.evaluate(() => document.title);
    console.log(title);
    const products = title.split('(')[1].substring(0, title.split('(')[1].length - 1);
    return products;
};

const getProductsPage = async (page, url) => {
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
    const products = await getProducts(url);
    return products;
};

const scrapeInfiniteScrollItems = async (page, itemTargetCount, scrollDelay = 1000) => {
    let items = 0;
    try {
        let previousHeight;
        await page.waitForTimeout(config.timeout);
        while (items < itemTargetCount) {
            items = await page.evaluate(() => {
                return [...document.querySelectorAll('.grid-item')].length;
            });
            previousHeight = await page.evaluate('document.body.scrollHeight');
            await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
            await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
            await page.waitForTimeout(scrollDelay);
            console.log(items, itemTargetCount);
        }
    } catch (e) {
        console.log(e);
    }
    return await page.evaluate(() => {
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
};

(async () => {
    console.log('Starting scraping list...');
    console.log(new Date());
    console.time('Scraping');
    const urls = config.scrapingUrl;
    const browser = await puppeteer.launch(config.pupetterOptions);
    const page = await browser.newPage();
    for (let i = 0; i <= urls.length; i++) {
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
        await page.waitForTimeout(3000);
        const items = await scrapeInfiniteScrollItems(page, parseInt(products));
        console.log(items);
        // try {
        //     client = await mongodb.MongoClient.connect(config.configMongo.url, {
        //         useNewUrlParser: true,
        //         useUnifiedTopology: true,
        //     });
        //     const collection = await client.db(config.configMongo.db).collection(urls[i].collection);
        //     for (let j = 1; j <= pages; j++) {
        //         urlWithPage = `${url}${j}`;
        //         const prods = await getProductsPage(page, urlWithPage);
        //         prods.forEach(async (product) => {
        //             const productData = {
        //                 ...product,
        //                 market: config.collectionProducts[config.indexCollection].market,
        //                 img: product.img.replace('40x40.', '325x325.'),
        //                 updateDate: new Date(),
        //             };
        //             await collection.findOne({id: productData.id});
        //             const result = await collection.updateOne(
        //                 {id: productData.id},
        //                 {
        //                     $set: {...productData},
        //                 }
        //             );
        //             if (result.matchedCount === 0) {
        //                 await collection.insertOne({
        //                     ...productData,
        //                     createDate: new Date(),
        //                     available: true,
        //                 });
        //             }
        //         });
        //         console.log(`${pages - j} pages left.`);
        //     }
        //     await browser.close();
        //     console.log(`Scraper finished.`);
        //     console.log(new Date());
        //     console.time('Scraping');
        // } catch (e) {
        //     console.log(e);
        // } finally {
        //     client.close();
        // }
    }
})();
