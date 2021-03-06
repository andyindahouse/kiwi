import passport from 'passport';
import {InfoError, Error400, Error401, Error403, Error404} from '../controllers/errorTypes';

export default {
    ensureAuthenticated: (req, res, next) => {
        passport.authenticate('jwt', {session: false}, (err, user, info) => {
            if (info) {
                return next(new Error401(info.message));
            }
            if (err) {
                return next(err);
            }
            if (!user) {
                return next(new Error403('Forbidden access.'));
            }
            req.user = user;
            next();
        })(req, res, next);
    },

    ensureRider: (req, res, next) => {
        if (!req.user.rider) {
            return next(new Error403('Forbidden access.'));
        }
        next();
    },

    errorHandler: (error, req, res, next) => {
        if (error instanceof InfoError) res.status(200).json({error: error.message});
        else if (error instanceof Error404) res.status(404).json({error: error.message});
        else if (error instanceof Error403) res.status(403).json({error: error.message});
        else if (error instanceof Error401) res.status(401).json({error: error.message});
        else if (error instanceof Error400) res.status(400).json({error: error.message});
        else if (error.name == 'ValidationError') res.status(200).json({error: error.message});
        else if (error.message) res.status(500).json({error: error.message});
        else next();
    },

    notFoundHandler: (req, res) => {
        res.status(404).json({error: 'Endpoint not found'});
    },
};
