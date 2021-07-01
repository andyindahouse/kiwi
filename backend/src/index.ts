import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import https from 'https';
import http from 'http';
import mongoose from 'mongoose';
import passport from 'passport';
import passportJwt from 'passport-jwt';
import passportLocal from 'passport-local';
import bcrypt from 'bcrypt';
import cors from 'cors';
import {PORT, CONFIG_MONGO, PASSPORT_CONFIG} from './config';
import User from './models/user';
import customMdw from './middleware/custom';
import routesUser from './routes/routes-user';
import routesRider from './routes/routes-rider';

const {Strategy: JwtStrategy, ExtractJwt} = passportJwt;
const {Strategy: LocalStrategy} = passportLocal;

mongoose.connect(CONFIG_MONGO.URL, {useNewUrlParser: true}).catch((err) => {
    console.log(err);
    process.exit(1);
});

const app = express();

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            session: false,
        },
        (email, password, done) => {
            User.findOne({email})
                .then((data) => {
                    if (!data) {
                        return done(null, false);
                    } else if (!bcrypt.compareSync(password, data.password)) {
                        return done(null, false);
                    }
                    return done(null, data);
                })
                .catch((err) => done(err, null));
        }
    )
);

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PASSPORT_CONFIG.JWT_SECRET,
    algorithms: [PASSPORT_CONFIG.JWT_ALGORITHM],
};

passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
        User.findOne({_id: jwt_payload.sub})
            .then((data) => {
                if (!data) {
                    return done(null, false);
                } else {
                    return done(null, data);
                }
            })
            .catch((err) => done(err, null));
    })
);

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(passport.initialize());

app.use('/api', routesUser);
app.use('/api/rider', routesRider);

app.use(customMdw.errorHandler);
app.use(customMdw.notFoundHandler);

const httpServer = http.createServer(app);

const port = PORT || 3000;

httpServer.listen(port, () => {
    console.log(`Magic happens on port ${port}`);
});

if (process.argv.length === 3 && process.argv[2] && process.argv[2] === 'https') {
    // Certificate
    const privateKey = fs.readFileSync('/etc/letsencrypt/live/kiwiapp.es/privkey.pem', 'utf8');
    const certificate = fs.readFileSync('/etc/letsencrypt/live/kiwiapp.es/cert.pem', 'utf8');
    const ca = fs.readFileSync('/etc/letsencrypt/live/kiwiapp.es/chain.pem', 'utf8');

    const credentials = {
        key: privateKey,
        cert: certificate,
        ca: ca,
    };

    const httpsServer = https.createServer(credentials, app);

    httpsServer.listen(port + 1, () => {
        console.log(`Secure Magic happens on port ${port + 1}`);
    });
}
