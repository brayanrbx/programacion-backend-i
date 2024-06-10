const fs = require('fs');
const path = require('path');

const route = path.resolve(__dirname, './products.json');

class ProductManager {
    /**
     * initialize the attributes of the class
     * @param {String} route
     */
    constructor(route) {
        this.route = route;
    }

    async validateExistsFile() {
        try {
            const exists = await fs.promises.stat(this.route);
        }
        catch(err) {
            await fs.promises.writeFile(this.route, JSON.stringify([]));
        }
    }

    checkTypes(obj, type) {
        return Object.values(obj).every(value => typeof value === type);
    }

    existsProduct(id, arrayProducts) {
        try {
            const index = arrayProducts.findIndex(product => product.id == id);
            if (index < 0) throw new Error("The product doesn't exist")
            return index
        }
        catch (error) {
            console.error(error.message);
        }
    }


    async saveProduct(products) {
        await this.validateExistsFile();
        const data = JSON.stringify(products, null, '\t');
        await fs.promises.writeFile(this.route, data);
    }

    async getProducts() {
        try {
            await this.validateExistsFile();
            const products = await fs.promises.readFile(this.route, 'utf-8');
            return JSON.parse(products);
        }
        catch(err) {
            console.log('An error has occurred', err);
        }
    }

    async getProductById(id) {
        try {
            const arrayProducts = await this.getProducts();
            const index = this.existsProduct(id, arrayProducts);
            return arrayProducts[index];
        }
        catch (error) {
            console.error(error.message);
        }
    }

    async addProduct(product) {
        const { title, description, price, thumbnail, code, stock } = product;
        try {
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
        }
        catch (error) {
            console.error(error.message);
        }
    }

    async updateProduct (id, newData) {
        try {
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
        catch (error) {
            console.error(error.message);
        }
    }
    async deleteProduct(id) {
        try {
            const arrayProducts = await this.getProducts();
            const index = this.existsProduct(id, arrayProducts);
            arrayProducts.splice(index, 1);
            this.saveProduct(arrayProducts);
        }
        catch (error) {
            console.error(error.message);
        }
    }
}

const products = new ProductManager(route);

const main = async () => {
    const product = await products.getProducts();
    console.log(product);
    await products.addProduct({ title: 'producto prueba', description: 'Este es un producto prueba', price: 200, thumbnail: 'Sin imagen', code: 'abc123', stock: 25 });
    console.log(await products.getProducts());
    await products.addProduct({ title: 'producto prueba', description: 'Este es un producto prueba', price: 200, thumbnail: 'Sin imagen', code: 'abc123', stock: 25 });
    console.log(await products.getProductById(1));
    console.log(await products.getProductById(2));
    await products.updateProduct(1, { title: 'producto prueba2', description: 'Este es un producto prueba2', price: 200, thumbnail: 'Sin imagen', code: 'abc124', stock: 25 });
    console.log(await products.getProducts());
    await products.deleteProduct(1);
    console.log(await products.getProducts());
    await products.deleteProduct(1);
}

main();

