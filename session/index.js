'use strict';

const session = require('express-session');
const MongoStore = require('connect-mongo');

function createSession(sessionSecret, mongoURI) {
    return session({
        secret: sessionSecret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            path: '/',
            secure: false,
            httpOnly: true,
            maxAge: 60 * 60 * 1000, // 1 hour
        },
        store: MongoStore.create({
            mongoUrl: mongoURI,
            ttl: 24 * 60 * 60, // = 1 day.
            touchAfter: 24 * 3600, // time period in seconds (1 day).
        }),
    });
}

module.exports = createSession;
