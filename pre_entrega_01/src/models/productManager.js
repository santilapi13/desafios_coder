import fs from 'fs';
import path from 'path';
import __dirname from '../util.js';

class ProductManager {

    static lastId = 1;    // Id autoincrementable
    #path;

    constructor() {
        this.#path = path.join(__dirname, "data", "products.json");
    }

    addProduct = ({title, description, code, price, status = true, stock, category, thumbnails}) => {
        let newProduct = {
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails,
        };

        newProduct.id = ProductManager.lastId;
        ProductManager.lastId++;

        let products = this.getProducts();

        products.push(newProduct);
        fs.writeFileSync(this.#path, JSON.stringify(products, null, '\t'));
    }

    getProducts = () => {
        let products = [];
        if (fs.existsSync(this.#path)) {
            products = JSON.parse(fs.readFileSync(this.#path, 'utf-8'));
        }
        return products;
    };

    getProductById = id => {
        let product = this.getProducts().find(product => product.id === id);

        return product;
    };

    updateProduct = (id, productArr) => {
        let products = this.getProducts();
        let product = this.getProductById(id);

        for (prop in productArr) {
            product[prop.key] = prop.value;
        }

        fs.writeFileSync(this.#path, JSON.stringify(products, null, '\t'));
    }

    deleteProduct = id => {
        let products = this.getProducts();

        products = products.filter(product => product.id !== id);

        fs.writeFileSync(this.#path, JSON.stringify(products, null, '\t'));
    }

}

export default ProductManager;