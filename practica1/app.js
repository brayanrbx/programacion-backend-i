class ProductManager {

    constructor() {
        this.products = [];
    }

    checkTypes(obj, type) {
        return Object.values(obj).every(value => typeof value === type);
    }

    getProducts() {
        try {
            return this.products;
        }
        catch(err) {
            console.log('An error has occurred', err);
        }
    }

    getProductById(id) {
        try {
            const arrayProducts = this.getProducts();
            const index = arrayProducts.findIndex(product => product.id == id);
            if (index < 0) throw new Error("The product doesn't exist");
            return arrayProducts[index];
        }
        catch (error) {
            console.error(error.message);
        }
    }

    addProduct(product) {
        const { title, description, price, thumbnail, code, stock } = product;
        try {
            if (!this.checkTypes({ title, description, thumbnail, code }, 'string') || !this.checkTypes({ price, stock }, 'number')) throw new Error('Invalid data');

            if (this.products.length > 0) {
                const productExists = this.products.some(product => product.code === code);

                if (productExists) throw new Error('The product already exists');
            }

            const newProductId = this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1;
            const newProduct = {
                id: newProductId,
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            }
            this.products.push(newProduct);

        }
        catch (error) {
            console.error(error.message);
        }
    }
}

// object instance
const products = new ProductManager();
console.log(products.getProducts());
products.addProduct({ title: 'producto prueba', description: 'Este es un producto prueba', price: 200, thumbnail: 'Sin imagen', code: 'abc123', stock: 25 });
console.log(products.getProducts());
products.addProduct({ title: 'producto prueba', description: 'Este es un producto prueba', price: 200, thumbnail: 'Sin imagen', code: 'abc123', stock: 25 });
console.log(products.getProductById(1));
products.getProductById(2);







