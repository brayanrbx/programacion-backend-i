import { Router } from 'express';
import CartManager from '../dao/db/carts-manager.js';

const routeCarts = Router();
const cartsController = new CartManager();

routeCarts.get('/:cid', async (req, res, next) => {
    try {
        const { cid } = req.params;
        const cart = await cartsController.getCartById(cid);
        res.status(200).json({
            msg: cart
        })
    }
    catch(err) {
        err.status = 500;
        next(err);
    }
});

routeCarts.post('/', async (req, res, next) => {
    try {
        const cart = await cartsController.addCart();
        res.status(201).json({
            msg: 'Cart added successfully',
            cart
        });
    }
    catch(err) {
        err.status = 500;
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
        err.status = 500;
        next(err);
    }
});

routeCarts.put('/:cid', async (req, res, next) => {
    try {
        const { cid } = req.params;
        const { body } = req
        const cart = await cartsController.updateCart(cid, body);
        res.status(200).json({
            msg: cart
        })
    }
    catch(err) {
        err.status = 500;
        next(err);
    }
})

routeCarts.put('/:cid/products/:pid', async (req, res, next) => {
    const { cid, pid } = req.params;
    const quantity = req.body.quantity || 1;
    try {
        const cart = await cartsController.updateCartProduct(cid, pid, quantity)
        res.status(201).json({
            msg: 'Cart updated successfully',
            cart
        });
    }
    catch(err) {
        err.status = 500;
        next(err);
    }
})

routeCarts.delete('/:cid', async (req, res, next) => {
    try {
        const { cid } = req.params;
        await cartsController.deleteCart(cid)
        res.status(200).json({
            msg: 'Cart deleted successful'
        });
    }
    catch(err) {
        err.status = 400;
        next(err);
    }
});

routeCarts.delete('/:cid/products/:pid', async (req, res, next) => {
    const { cid, pid } = req.params;
    try {
        const cart = await cartsController.deleteCartProduct(cid, pid)
        res.status(201).json({
            msg: 'Product cart deleted successfully',
            cart
        });
    }
    catch(err) {
        err.status = 500;
        next(err);
    }
})

export default routeCarts;

