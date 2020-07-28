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
    url: 'mongodb://root:example@localhost/test?authSource=admin&w=1',
    db: 'test',
};
const marketUrl = 'https://www.elcorteingles.es';
const scrapingUrl = [
    {url: `${marketUrl}/supermercado/alimentacion-general/`, collection: 'alimentacion-general'},
    {url: `${marketUrl}/supermercado/drogueria-y-limpieza/`, collection: 'drogueria-y-limpieza'},
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
