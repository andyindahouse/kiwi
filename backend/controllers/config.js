import Config from '../models/config.js';
import errorTypes from './errorTypes.js';

export default {
    config: async (req, res, next) => {
        try {
            const config = await Config.findOne();
            if (config) {
                const {_id, ...configData} = config._doc;
                res.json({
                    data: {
                        ...configData,
                    },
                });
            } else {
                next(new errorTypes.Error404('Config not found.'));
            }
        } catch (err) {
            next(err);
        }
    },
};
