const chromePathWindows = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const chromePathMac = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const chromePathServer = '/usr/bin/google-chrome';

const chromePath = chromePathServer;
const timeout = 20000;
const pupetterOptions = {
    executablePath: chromePath,
    headless: true,
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--auto-open-devtools-for-tabs',
        `--window-size=${2000},${2000}`,
    ],
    // args: ['--no-sandbox', '--disable-setuid-sandbox', '--auto-open-devtools-for-tabs'],
};
const configMongo = {
    url: `mongodb://root:${encodeURIComponent('2q"GtK:W{b+<xmt?')}@localhost/kiwi?authSource=admin&w=1`,
    db: 'kiwi',
};
const marketUrl = 'https://www.elcorteingles.es';
const indexCollection = 0;
const collectionProducts = [{market: 'eci', collection: 'productsEci'}];
const scrapingUrl = [
    {
        url: `${marketUrl}/supermercado/alimentacion-general/`,
        collection: collectionProducts[indexCollection].collection,
    },
    {
        url: `${marketUrl}/supermercado/desayunos-dulces-y-pan/`,
        collection: collectionProducts[indexCollection].collection,
    },
    {url: `${marketUrl}/supermercado/lacteos/`, collection: collectionProducts[indexCollection].collection},
    {
        url: `${marketUrl}/supermercado/congelados/`,
        collection: collectionProducts[indexCollection].collection,
    },
    {
        url: `${marketUrl}/supermercado/dieteticos/`,
        collection: collectionProducts[indexCollection].collection,
    },
    {url: `${marketUrl}/supermercado/bebidas/`, collection: collectionProducts[indexCollection].collection},
    {url: `${marketUrl}/supermercado/frescos/`, collection: collectionProducts[indexCollection].collection},
    {url: `${marketUrl}/supermercado/bebes/`, collection: collectionProducts[indexCollection].collection},
    {
        url: `${marketUrl}/supermercado/cuidado-e-higiene-personal/`,
        collection: collectionProducts[indexCollection].collection,
    },
    {
        url: `${marketUrl}/supermercado/drogueria-y-limpieza/`,
        collection: collectionProducts[indexCollection].collection,
    },
];

const selectedScrapingUrl = scrapingUrl[0];

const openFoodApi = 'https://world.openfoodfacts.org/api/v0/product';

module.exports = {
    timeout,
    pupetterOptions,
    marketUrl,
    scrapingUrl: scrapingUrl,
    configMongo,
    openFoodApi,
    collectionProducts,
    indexCollection,
};
