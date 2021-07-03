import Product from '../models/product';
import {Error400, Error404} from './errorTypes';

export default {
    products: async ({query}, res, next) => {
        const pageNumber = parseInt(query.pageNumber || 0);
        const pageSize = parseInt(query.pageSize || 20);
        const searchText = query.searchText;

        const limit = pageSize;
        const skip = pageNumber * pageSize;
        const textQuery = searchText
            ? {
                  $text: {
                      $search: searchText,
                      $language: 'spanish',
                      $caseSensitive: false,
                      $diacriticSensitive: false,
                  },
              }
            : {};

        try {
            const totalSize = await Product.eci
                .find({
                    ...textQuery,
                    ...{available: {$ne: false}},
                })
                .countDocuments();
            const result = await Product.eci
                .find({
                    ...textQuery,
                    ...{available: {$ne: false}},
                })
                .select({score: {$meta: 'textScore'}})
                .sort({score: {$meta: 'textScore'}})
                .skip(skip)
                .limit(limit);
            res.json({
                pageNumber,
                pageSize,
                content: result,
                totalSize,
            });
        } catch (err) {
            next(err);
        }
    },
    productById: async ({params}, res, next) => {
        if (!params.id) {
            next(new Error400('Falta parametro id.'));
        }
        try {
            const result = await Product.eci.findOne({id: params.id});
            if (!result) {
                next(new Error404('Product not found.'));
            } else {
                res.json(result);
            }
        } catch (err) {
            next(err);
        }
    },
    getNutrimentsFromProducts: async ({query}, res, next) => {
        const productsEan = query.id && query.id.length ? query.id : [query.id];
        console.log(productsEan);
        try {
            const result = await Product.eci.find({id: {$in: productsEan}});
            const nutriments = result.reduce(
                (acum, prod) => {
                    const product = prod._doc;
                    return {
                        carbohydrates100g:
                            acum.carbohydrates100g +
                            (product.nutriments.carbohydrates100g ? product.nutriments.carbohydrates100g : 0),
                        energyKcal100g:
                            acum.energyKcal100g +
                            (product.nutriments.energyKcal100g ? product.nutriments.energyKcal100g : 0),
                        fat100g: acum.fat100g + (product.nutriments.fat100g ? product.nutriments.fat100g : 0),
                        nutritionDataPer: product.nutriments.nutritionDataPer,
                        proteins100g:
                            acum.proteins100g +
                            (product.nutriments.proteins100g ? product.nutriments.proteins100g : 0),
                        salt100g:
                            acum.salt100g + (product.nutriments.salt100g ? product.nutriments.salt100g : 0),
                        saturedFat100g:
                            acum.saturedFat100g +
                            (product.nutriments.saturedFat100g ? product.nutriments.saturedFat100g : 0),
                        sugar100g:
                            acum.sugar100g +
                            (product.nutriments.sugar100g ? product.nutriments.sugar100g : 0),
                    };
                },
                {
                    carbohydrates100g: 0,
                    energyKcal100g: 0,
                    fat100g: 0,
                    salt100g: 0,
                    proteins100g: 0,
                    saturedFat100g: 0,
                    sugar100g: 0,
                }
            );
            res.json(nutriments);
        } catch (err) {
            next(err);
        }
    },
};
