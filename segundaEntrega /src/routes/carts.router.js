import { Router } from 'express';
import path from 'path';
import CartManager from '../controller/carts.controller.js';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
const routeCarts = Router();
const route = path.resolve(__dirname, '../carts.json');
const cartsController = new CartManager(route);

routeCarts.get('/:cid', async (req, res, next) => {
    try {
        const { cid } = req.params;
        const cart = await cartsController.getCartById(cid);
        res.status(200).json({
            msg: cart
        })
    }
    catch(err) {
        err.status = 400;
        next(err);
    }
});

routeCarts.post('/', async (req, res, next) => {
    try {
        const cart = await cartsController.addCart()
        res.status(201).json({
            msg: 'Cart added successfully',
            cart
        });
    }
    catch(err) {
        err.status = 400;
        next(err);
    }
});

routeCarts.post('/:cid/products/:pid', async (req, res, next) => {
    const { cid, pid } = req.params;
    const quantity = req.body.quantity || 1;
    try {
        const cart = await cartsController.addCartProduct(cid, pid, quantity)
        res.status(201).json({
            msg: 'Cart added successfully',
            cart
        });
    }
    catch(err) {
        err.status = 400;
        next(err);
    }
});

routeCarts.delete('/:cid', async (req, res, next) => {
    try {
        const { cid } = req.params;
        const { body } = req;
        await cartsController.deleteCart(cid, body)
        res.status(200).json({
            msg: 'Cart delete successful'
        });
    }
    catch(err) {
        err.status = 400;
        next(err);
    }
});

export default routeCarts;

