import fs from 'fs';

class ProductManager {
    /**
     * initialize the attributes of the class
     * @param {String} route
     */
    constructor(route) {
        this.route = route;
    }

    async validateExistsFile() {
        const exists = await fs.promises.stat(this.route);
        if (!exists) await fs.promises.writeFile(this.route, JSON.stringify([]));
    }

    checkTypes(obj, type) {
        return Object.values(obj).every(value => typeof value === type);
    }

    existsProduct(id, arrayProduct) {
        const index = arrayProduct.findIndex(product => product.id == id);
        if (index < 0) throw new Error("The product doesn't exist")
        return index
    }


    async saveProduct(products) {
        const data = JSON.stringify(products, null, '\t');
        await fs.promises.writeFile(this.route, data);
    }

    async getProducts() {
        await this.validateExistsFile();
        const products = await fs.promises.readFile(this.route, 'utf-8');
        return JSON.parse(products);
    }

    async getProductById(id) {
        const arrayProduct = await this.getProducts();
        const index = this.existsProduct(id, arrayProduct);
        return arrayProduct[index];
    }

    async addProduct(product) {
        const { title, description, price, code, status, stock, thumbnail } = product;

        if (!this.checkTypes({ title, description, code }, 'string') || !this.checkTypes({ price, stock }, 'number') || !this.checkTypes({ status }, 'boolean')) throw new Error('Invalid data');

        const products = await this.getProducts();

        if (products.length > 0) {
            const productExists = products.some(product => product.code === code);

            if (productExists) throw new Error('The product already exists');
        }

        const newProductId = products.length > 0 ? products[products.length - 1].id + 1 : 1;
        const newProduct = {
            id: newProductId,
            title,
            description,
            code,
            price,
            status,
            stock,
            thumbnail
        }
        products.push(newProduct);
        this.saveProduct(products);
        return newProduct;
    }

    async updateProduct (id, newData) {
        const { title, description, price, code, status, stock, thumbnail } = newData;

        if (!this.checkTypes({ title, description, code }, 'string') || !this.checkTypes({ price, stock }, 'number') || !this.checkTypes({ status }, 'boolean')) throw new Error('Invalid data');

        const products = await this.getProducts();

        const index = this.existsProduct(id, products);
        const newProduct = {
            id: products[index].id,
            title,
            description,
            code,
            price,
            status,
            stock,
            thumbnail: thumbnail || []
        }
        products.splice(index, 1, newProduct);
        this.saveProduct(products);
        return newProduct;
    }
    async deleteProduct(id) {
        const arrayProducts = await this.getProducts();
        const index = this.existsProduct(id, arrayProducts);
        arrayProducts.splice(index, 1);
        this.saveProduct(arrayProducts);
    }
}

export default ProductManager;