import mongodb from 'mongodb';
import * as config from './config.js';

(async () => {
    if (process.argv.length !== 5) {
        console.log('Fecha no encontrada');
        process.exit(0);
    } else {
        console.log('Mark not found products...');
        let client;
        try {
            client = await mongodb.MongoClient.connect(config.configMongo.url, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            const collection = await client
                .db(config.configMongo.db)
                .collection(config.collectionProducts[config.indexCollection].collection);
            var tzoffset =
                new Date(
                    Number(process.argv[2]),
                    Number(process.argv[3]) - 1,
                    Number(process.argv[4]),
                    0,
                    0
                ).getTimezoneOffset() * 60000;
            var date = new Date(
                new Date(
                    Number(process.argv[2]),
                    Number(process.argv[3]) - 1,
                    Number(process.argv[4]),
                    0,
                    0
                ).getTime() - tzoffset
            );
            console.log(date);
            const result = await collection.updateMany(
                {
                    updateDate: {
                        $lt: date,
                    },
                },
                {
                    $set: {available: false},
                }
            );
            console.log(result.modifiedCount, 'productos actualizados');
        } catch (e) {
            console.log(e);
        } finally {
            client?.close();
        }
    }
})();
