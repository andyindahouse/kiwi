import Config from '../models/config';
import {Error404} from './errorTypes';

export default {
    config: async (req, res, next) => {
        try {
            const config = await Config.findOne();
            if (!config) {
                return next(new Error404('Config not found.'));
            }

            res.json({
                data: {
                    deliveryDays: config.deliveryDays,
                },
            });
        } catch (err) {
            next(err);
        }
    },
};
