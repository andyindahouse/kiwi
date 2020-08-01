const express = require('express');
const routes = require('./app/router');
const cors = require('cors');

const app = express();
app.use(cors());
app.use('/', routes);

app.listen('3000');
console.log('Magic happens on port 3000');
exports = module.exports = app;
