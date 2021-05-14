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
/* Error formatter */
const format = require('./helpers/format');

/* Create express app */
const app = express();
app.set('views', path.join(__dirname, 'views')); // Set views files path
app.set('view engine', 'ejs'); // Set view engine
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files
app.use(express.json()); // Parse json middleware
/* Override methods (get POST from client and treat them like PUT or DELETE) */
app.use(
    methodOverride((req, res) => {
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
            // look in urlencoded POST bodies and delete it
            var method = req.body._method;
            delete req.body._method;
            return method;
        }
    })
);

/* Connect to mongo database */
const mongoURI = process.env.MONGO_URI;
dbConnection(mongoURI)
.then(() => console.info('\x1b[34m%s\x1b[0m', 'Connected to mongo server'))
.catch(err => console.error(err));

/* Create session */
const sessionSecret = process.env.SESSION_SECRET;
app.use(createSession(sessionSecret, mongoURI));

/* Handle routes and errors */
app.use('/', routes);
app.use('/admin', mw.isLoggedIn, adminRoutes);
app.use((err, req, res, next) => {
    // handle errors
    err = err.status ? err : format.clientError(err);
    res.status(err.status).json({ errors: err.msgs });
});
app.use((req, res, next) =>
    res.status(404).render('404', { title: 404, msg: 'Resource not found' })); // 404 page

/* Start server */
app.listen(process.env.PORT, () =>
    console.info('\x1b[34m%s\x1b[0m', `Server listening at ${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}`));
