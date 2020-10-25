const chromePathWindows = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const chromePathMac = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const chromePath = chromePathWindows;
const timeout = 20000;
const pupetterOptions = {
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--auto-open-devtools-for-tabs'],
};
const configMongo = {
    url: 'mongodb://root:example@localhost/kiwi?authSource=admin&w=1',
    db: 'kiwi',
};
const marketUrl = 'https://www.elcorteingles.es';
const collectionProducts = 'products';
const scrapingUrl = [
    {url: `${marketUrl}/supermercado/alimentacion-general/`, collection: collectionProducts},
    {url: `${marketUrl}/supermercado/desayunos-dulces-y-pan/`, collection: collectionProducts},
    {url: `${marketUrl}/supermercado/lacteos/`, collection: collectionProducts},
    {url: `${marketUrl}/supermercado/congelados/`, collection: collectionProducts},
    {url: `${marketUrl}/supermercado/dieteticos/`, collection: collectionProducts},
    {url: `${marketUrl}/supermercado/bebidas/`, collection: collectionProducts},
    {url: `${marketUrl}/supermercado/frescos/`, collection: collectionProducts},
    {url: `${marketUrl}/supermercado/bebes/`, collection: collectionProducts},
    {url: `${marketUrl}/supermercado/cuidado-e-higiene-personal/`, collection: collectionProducts},
    {url: `${marketUrl}/supermercado/drogueria-y-limpieza/`, collection: collectionProducts},
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
};
