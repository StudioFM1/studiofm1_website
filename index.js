'use strict';

/* Dependencies */
const path = require('path');
const express = require('express');
const methodOverride = require('method-override');
/* Import database connection */
const dbConnection = require('./database');
/* Import session object */
const createSession = require('./session');
/* Import middleware */
const mw = require('./middleware')
/* Import routing */
const routes = require('./routes');
const adminRoutes = require('./routes/admin.js');

/* Create express app */
const app = express();
app.set('views', path.join(__dirname, 'views')); // Set views files path
app.set('view engine', 'ejs'); // Set view engine
app.use(methodOverride('_method')); // Override method middleware
app.use(express.json()); // Parse json middleware
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

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
app.use('/admin', mw.isLoggedIn, adminRoutes);

/* Error middleware */
app.use(function (err, req, res, next) {
    console.error('\x1b[31m%s\x1b[0m', err);
    const status = err.status || 500;
    res.status(status).json({ error: err.message || 'Something went wrong', status: status });
});

/* Start server */
app.listen(process.env.PORT, () => console.info('\x1b[34m%s\x1b[0m', `Server listening at ${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}`));
