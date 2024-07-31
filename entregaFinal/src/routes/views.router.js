import { Router } from 'express';
import ProductManager from '../dao/db/products-manager.js';
import CartManager from '../dao/db/carts-manager.js';

const router = Router();

const productManager = new ProductManager();
const cartManager = new CartManager();


router.get("/products", async (req, res) => {
    try {
        const { page = 1, limit = 2 } = req.query;
        const products = await productManager.getProducts({
            page: parseInt(page),
            limit: parseInt(limit)
        });

        const newArray = products.docs.map(product => {
            const { _id, ...rest } = product.toObject();
            return rest;
        });

        res.render("products", {
            products: newArray,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            currentPage: products.page,
            totalPages: products.totalPages
        });

    } catch (error) {
        console.error("Error to get products", error);
        res.status(500).json({
            status: 'error',
            error: "Internal server error"
        });
    }
});

router.get("/carts/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const cart = await cartManager.getCartById(cartId);

        if (!cart) {
            console.log("cart not found with that id");
            return res.status(404).json({ error: "Cart not found" });
        }

        const cartProducts = cart.products.map(item => ({
            product: item.product.toObject(),
            //Lo convertimos a objeto para pasar las restricciones de Exp Handlebars.
            quantity: item.quantity
        }));


        res.render("carts", { products: cartProducts });
    } catch (error) {
        console.error("Error to get cart", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// router.get('/', async (req, res) => {
//     const products = await productManager.getProducts();
//     res.render('home', { products });
// });

// router.get('/realtimeproducts', async (req, res) => {
//     res.render('realtimeproducts');
// });

export default router;