const { Router } = require('express');
const routeProducts = Router();
const path = require('path');
const route = path.resolve(__dirname, '../products.json');
const productManager = require('../controller/products');

const productsController = new productManager(route);


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

routeProducts.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await productsController.getProductById(id);
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

routeProducts.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { body } = req;
        const product = await productsController.updateProduct(id, body)
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

routeProducts.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { body } = req;
        await productsController.deleteProduct(id, body)
        res.status(200).json({
            msg: 'Product delete successful'
        });
    }
    catch(err) {
        err.status = 400;
        next(err);
    }
});

module.exports = routeProducts;

