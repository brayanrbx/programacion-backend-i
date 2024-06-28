import{ Router } from 'express';
import ProductManager from '../controller/products.controller.js';

const router = Router();

const productManager = new ProductManager("./src/products.json");

router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('home', { products });
});

router.get('/realtimeproducts', async (req, res) => {
    res.render('realtimeproducts');
});

export default router;