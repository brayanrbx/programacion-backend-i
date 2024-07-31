import { Router } from 'express';
import ProductManager from '../dao/db/products-manager.js';

const routeProducts = Router();
const productsController = new ProductManager();

routeProducts.get('/', async (req, res, next) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        const products = await productsController.getProducts({
            limit: parseInt(limit),
            page: parseInt(page),
            sort,
            query,
        });

        res.status(200).json({
            status: 'success',
            payload: products,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: products.hasNextPage ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}` : null,
        });
    }
    catch(err) {
        err.status = 500;
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
        err.status = 500;
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
        err.status = 500;
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
        err.status = 500;
        next(err);
    }
});

routeProducts.delete('/:pid', async (req, res, next) => {
    try {
        const { pid } = req.params;
        await productsController.deleteProduct(pid)
        res.status(200).json({
            msg: 'Product deleted successful'
        });
    }
    catch(err) {
        err.status = 500;
        next(err);
    }
});

export default routeProducts;

