'use strict';

/* Load enviromental variables */
require('dotenv').config({ path: `${__dirname}/config/.env.development` });

/* Dependencies */
const path = require('path');
const express = require('express');
/* Load database connection */
const dbConnection = require('./database');
/* Load session object */
const createSession = require('./session');
const routes = require('./routes');

/* Create express app */
const app = express();
/* Boddy parser middleware */
app.use(express.json());

/* Set views path and engine */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
/* Public folder path */
app.use(express.static(path.join(__dirname, 'public')));

/* Connect to mongo database */
const mongoURI = process.env.MONGO_URI;
dbConnection(mongoURI)
    .then(() => console.info('\x1b[34m%s\x1b[0m', 'Connected to mongo server'))
    .catch(err => console.error('\x1b[31m%s\x1b[0m', err));

/* Create session */
const sessionSecret = process.env.SESSION_SECRET;
app.use(createSession(sessionSecret, mongoURI));

/* Handle routes */
app.use('/', routes);

/* Error middleware */
app.use(function (err, req, res, next) {
    console.error('\x1b[31m%s\x1b[0m', err);
    const status = err.status || 500;
    res.status(status).json({ error: err.message || 'Something went wrong', status: status });
});

/* Start server */
app.listen(process.env.PORT, () => console.info('\x1b[34m%s\x1b[0m', `Server listening at ${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}`));
