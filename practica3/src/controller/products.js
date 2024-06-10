const fs = require('fs');

class ProductManager {
    /**
     * initialize the attributes of the class
     * @param {String} route
     */
    constructor(route) {
        this.route = route;
    }

    async validateExistsFile() {
        const exist = await fs.promises.stat(this.route);
        if (!exist) await fs.promises.writeFile(this.route, JSON.stringify([]));
    }

    checkTypes(obj, type) {
        return Object.values(obj).every(value => typeof value === type);
    }

    existsProduct(id, arrayProducts) {
        const index = arrayProducts.findIndex(product => product.id == id);
        if (index < 0) throw new Error("The product doesn't exist")
        return index
    }


    async saveProduct(products) {
        await this.validateExistsFile();
        const data = JSON.stringify(products, null, '\t');
        await fs.promises.writeFile(this.route, data);
    }

    async getProducts() {
        await this.validateExistsFile();
        const products = await fs.promises.readFile(this.route, 'utf-8');
        return JSON.parse(products);
    }

    async getProductById(id) {
        const arrayProducts = await this.getProducts();
        const index = this.existsProduct(id, arrayProducts);
        return arrayProducts[index];

    }

    async addProduct(product) {
        const { title, description, price, thumbnail, code, stock } = product;

        if (!this.checkTypes({ title, description, thumbnail, code }, 'string') || !this.checkTypes({ price, stock }, 'number')) throw new Error('Invalid data');

        const newProducts = await this.getProducts();

        if (newProducts.length > 0) {
            const productExists = newProducts.some(product => product.code === code);

            if (productExists) throw new Error('The product already exists');
        }
        const newProductId = newProducts.length > 0 ? newProducts[newProducts.length - 1].id + 1 : 1;
        const newProduct = {
            id: newProductId,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }
        newProducts.push(newProduct);
        this.saveProduct(newProducts);
        return newProduct;
    }

    async updateProduct (id, newData) {
        const { title, description, price, thumbnail, code, stock } = newData;
        const arrayProducts = await this.getProducts();
        if (!this.checkTypes({ title, description, thumbnail, code }, 'string') || !this.checkTypes({ price, stock }, 'number')) throw new Error('Invalid data');
        const index = this.existsProduct(id, arrayProducts);
        const oldProduct = arrayProducts[index];
        const newProduct = {
            id: oldProduct.id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }
        arrayProducts.splice(index, 1, newProduct);
        this.saveProduct(arrayProducts);
        return newProduct;
    }
    async deleteProduct(id) {
        const arrayProducts = await this.getProducts();
        const index = this.existsProduct(id, arrayProducts);
        arrayProducts.splice(index, 1);
        this.saveProduct(arrayProducts);
    }
}

module.exports = ProductManager;