import ProductModel from "../models/products.model.js";

class ProductManager {
    async getProducts({ limit = 10, page = 1, sort, query } = {}) {
        try {
            const skip = (page - 1) * limit;

            let queryOptions = {};

            if (query) {
                queryOptions = { category: query };
            }

            const sortOptions = {};
            if (sort) {
                if (sort === 'asc' || sort === 'desc') {
                    sortOptions.price = sort === 'asc' ? 1 : -1;
                }
            }

            const products = await ProductModel
                .find(queryOptions)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit);

            const totalProducts = await ProductModel.countDocuments(queryOptions);

            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            return {
                docs: products,
                totalPages,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
            };

        } catch (error) {
            console.log("Error to get products", error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const arrayProduct = await ProductModel.findById(id);

            if (!arrayProduct) {
                console.log("Product not found");
                return null;
            }

            return arrayProduct;
        }
        catch(error) {
            console.log("Error to get product", error);
            throw error;
        }
    }

    async addProduct(product) {
        try {
            const { title, description, price, img, code, stock, category, thumbnails } = product;

            const productExists = await ProductModel.findOne({ code: code });

            if (productExists) {
                console.log("Code must be unique");
                return;
            }

            const newProduct = new ProductModel({
                title,
                description,
                price,
                img,
                code,
                stock,
                category,
                status: true,
                thumbnails: thumbnails || []
            })

            await newProduct.save();
            return newProduct;
        }
        catch(error) {
            console.log("Error to add product", error);
            throw error;
        }
    }

    async updateProduct (id, newData) {
        try {
            const product = await ProductModel.findByIdAndUpdate(id, newData);

            if (!product) {
                console.log("Product not found");
                return null;
            }

            return product;
        } catch (error) {
            console.log('Error to update product', error);
            throw error;
        }
    }
    async deleteProduct(id) {
        try {
            const deletedProduct = await ProductModel.findByIdAndDelete(id);

            if (!deletedProduct) {
                console.log("Product not found");
                return null;
            }

        } catch (error) {
            console.log('Error to delete product', error);
            throw error;
        }
    }
}

export default ProductManager;