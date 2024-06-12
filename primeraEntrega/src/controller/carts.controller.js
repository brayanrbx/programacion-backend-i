import fs from 'fs';

class CartManager {
    /**
     * initialize the attributes of the class
     * @param {String} route
     */
    constructor(route) {
        this.route = route;
    }

    existsCart(id, arrayCart) {
        const index = arrayCart.findIndex(cart => cart.id == id);
        if (index < 0) throw new Error("The cart doesn't exist")
        return index
    }

    async getCarts() {
        const carts = await fs.promises.readFile(this.route, 'utf-8');
        return JSON.parse(carts);
    }

    async saveCart(carts) {
        const data = JSON.stringify(carts, null, '\t');
        await fs.promises.writeFile(this.route, data);
    }

    async getCartById(id) {
        const arrayCart = await this.getCarts();
        const index = this.existsCart(id, arrayCart);
        return arrayCart[index];
    }

    async addCart() {
        const carts = await this.getCarts();
        const newCartId = carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;
        const newCart = {
            id: newCartId,
            products: []
        }
        carts.push(newCart);
        this.saveCart(carts);
        return newCart;
    }

    async addCartProduct(cid, pid, quantity) {
        const arrayCart = await this.getCarts();
        const index = this.existsCart(cid, arrayCart);
        const cart = arrayCart[index];
        const productExists = cart.products.find(product => product.product === pid);
        if (productExists) {
            productExists.quantity += quantity;
        } else {
            cart.products.push({ product: pid, quantity });
        }
        this.saveCart(arrayCart);
        return cart;
    }

    async deleteCart(id) {
        const arrayCarts = await this.getCarts();
        const index = this.existsCart(id, arrayCarts);
        arrayCarts.splice(index, 1);
        this.saveCart(arrayCarts);
    }
}

export default CartManager;