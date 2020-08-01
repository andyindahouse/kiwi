'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcrypt');
const cors = require('cors');
const {PORT, CONFIG_MONGO, PASSPORT_CONFIG} = require('./config');
const routes = require('./routes/routes');
const User = require('./models/user');
const customMdw = require('./middleware/custom');

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

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = PASSPORT_CONFIG.JWT_SECRET;
opts.algorithms = [PASSPORT_CONFIG.JWT_ALGORITHM];

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

//app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(passport.initialize());

app.use('/api', routes);

app.use(customMdw.errorHandler);
app.use(customMdw.notFoundHandler);

const port = PORT || 3000;
app.listen(port, function () {
    console.log(`Magic happens on port ${port}`);
});
