const { Router } = require('express');
const routeProducts = require('./products');

const routeMain = Router();

routeMain.use('/products', routeProducts);

module.exports = routeMain;