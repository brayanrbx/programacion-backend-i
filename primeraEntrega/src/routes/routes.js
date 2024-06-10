import { Router } from 'express';
import routeProducts from './products.router.js';

const routeMain = Router();

routeMain.use('/products', routeProducts);

export default routeMain;