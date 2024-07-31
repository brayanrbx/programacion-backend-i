import CartModel from "../models/cart.model.js";

class CartManager {
    async getCartById(id) {
        try {
            const cart = await CartModel.findById(id);
            if (!cart) {
                console.log("cart not found with that id");
                return null;
            }
            return cart;
        } catch (error) {
            console.log("Error to get cart", error);
            throw error;
        }
    }

    async addCart() {
        try {
            const newCart = new CartModel({products: []});
            await newCart.save();
            return newCart;
        } catch (error) {
            console.log("Error to add cart", error);
            throw error;
        }
    }

    async addCartProduct(cid, pid, quantity = 1) {
        try {
            const cart = await this.getCartById(cid);
            const productExists = cart.products.find(product => product.product._id.toString() === pid);
            if (productExists) {
                productExists.quantity += quantity;
            } else {
                cart.products.push({ product: pid, quantity });
            }
            cart.markModified("products");
            await cart.save();
            return cart;
        } catch (error) {
            console.log("Error to add product to cart", error);
            throw error;
        }
    }

    async updateCart(id, newData) {
        try {
            const arrayCarts = await CartModel.findByIdAndUpdate(id, newData);
            if (!arrayCarts) {
                console.log("cart not found with that id");
                return null;
            }
            return arrayCarts;
        }
        catch (error) {
            console.log("Error to get cart", error);
            throw error;
        }
    }

    async updateCartProduct(cid, pid, quantity = 1) {
        try {
            const cart = await this.getCartById(cid);
            console.log(quantity)
            const productExists = cart.products.find(product => product.product._id.toString() === pid);
            if (productExists) {
                productExists.quantity += quantity;
            } 
            cart.markModified("products");
            await cart.save();
            return cart;
        } catch (error) {
            console.log("Error to add product to cart", error);
            throw error;
        }
    }

    async deleteCart(id) {
        try {
            const arrayCarts = await CartModel.findByIdAndDelete(id);
            if (!arrayCarts) {
                console.log("cart not found with that id");
                return null;
            }
            return arrayCarts;
        }
        catch (error) {
            console.log("Error to get cart", error);
            throw error;
        }
    }

    async deleteCartProduct(cid, pid) {
        try {
            const cart = await this.getCartById(cid);
            cart.products = cart.products.filter(product => product.product._id.toString() !== pid);
            cart.markModified("products");
            await cart.save();
            return cart;
        } catch (error) {
            console.log("Error to add product to cart", error);
            throw error;
        }
    }
}

export default CartManager;