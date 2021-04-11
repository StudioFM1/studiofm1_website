/* Dependencies */
const path = require('path');
const express = require('express');
const routes = require('./routes');

const app = express();

/* Set views path and engine */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
/* Public folder path */
app.use(express.static(path.join(__dirname, 'public')));

/* Handle routes */
app.use('/', routes);

const port = 80;
app.listen(port, () => console.info('\x1b[34m%s\x1b[0m', `Server listening at http://localhost`));
