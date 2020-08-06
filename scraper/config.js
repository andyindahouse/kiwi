const chromePathWindows = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const chromePathMac = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const chromePath = chromePathMac;
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
const scrapingUrl = [
    {url: `${marketUrl}/supermercado/alimentacion-general/`, collection: 'products', openFood: true},
    {url: `${marketUrl}/supermercado/drogueria-y-limpieza/`, collection: 'products'},
];

const selectedScrapingUrl = scrapingUrl[0];

const openFoodApi = 'https://world.openfoodfacts.org/api/v0/product';

module.exports = {
    timeout,
    pupetterOptions,
    marketUrl,
    scrapingUrl: selectedScrapingUrl,
    configMongo,
    openFoodApi,
};
