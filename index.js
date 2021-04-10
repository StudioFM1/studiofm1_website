const express = require('express');
const app = express();
const port = 80;
const routes = require('./routes');
const path= require('path');

/* Set views path and engine */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
/* Public folder path */
app.use(express.static(path.join(__dirname, 'public')));

//ROUTES
app.use('/', routes);


app.listen(port,()=>console.info('\x1b[34m%s\x1b[0m', `Server listening at http://localhost`));