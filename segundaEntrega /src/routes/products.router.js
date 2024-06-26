import { Router } from 'express';
import path from 'path';
import ProductManager from '../controller/products.controller.js';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
const routeProducts = Router();
const route = path.resolve(__dirname, '../products.json');
const productsController = new ProductManager(route);

routeProducts.get('/', async (req, res, next) => {
    try {
        const products = await productsController.getProducts();
        const { limit } = req.query;
        if (limit) {
            let limitProducts = products.slice(0, limit);
            res.status(200).json({
                msg: limitProducts
            });
        }
        else {
            res.status(200).json({
                msg: products
            });
        }
    }
    catch(err) {
        err.status = 400;
        next(err);
    }
});

routeProducts.get('/:pid', async (req, res, next) => {
    try {
        const { pid } = req.params;
        const product = await productsController.getProductById(pid);
        res.status(200).json({
            msg: product
        })
    }
    catch(err) {
        err.status = 400;
        next(err);
    }
});

routeProducts.post('/', async (req, res, next) => {
    try {
        const { body } = req;
        const product = await productsController.addProduct(body)
        res.status(201).json({
            msg: 'Product added successfully',
            product
        });
    }
    catch(err) {
        err.status = 400;
        next(err);
    }
});

routeProducts.put('/:pid', async (req, res, next) => {
    try {
        const { pid } = req.params;
        const { body } = req;
        const product = await productsController.updateProduct(pid, body)
        res.status(201).json({
            msg: "Product updated successfully",
            product
        });
    }
    catch(err) {
        err.status = 400;
        next(err);
    }
});

routeProducts.delete('/:pid', async (req, res, next) => {
    try {
        const { pid } = req.params;
        await productsController.deleteProduct(pid)
        res.status(200).json({
            msg: 'Product delete successful'
        });
    }
    catch(err) {
        err.status = 400;
        next(err);
    }
});

export default routeProducts;

