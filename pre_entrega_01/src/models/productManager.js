import fs from 'fs';
import path from 'path';
import __dirname from '../util.js';

class ProductManager {

    #path;

    constructor() {
        this.#path = path.join(__dirname, "data", "products.json");
    }

    addProduct = ({title, description, code, price, status = true, stock, category, thumbnails = []}) => {

        let products = this.getProducts();
        products.lastId++;

        let newProduct = {
            id: products.lastId,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails,
        };

        products.productsList.push(newProduct);
        fs.writeFileSync(this.#path, JSON.stringify(products, null, '\t'));
    }

    getProducts = () => {
        let products = {
            lastId: 0,
            productsList: []
        };

        if (fs.existsSync(this.#path)) {
            products = JSON.parse(fs.readFileSync(this.#path, 'utf-8'));
        }

        return products;
    };

    getProductById = id => {
        let product = this.getProducts().productsList.find(product => product.id === id);

        return product;
    };

    updateProduct = (id, productArr) => {
        let product = this.getProductById(id);

        productArr.forEach(newProp => {
            product[newProp[0]] = newProp[1];
        });

        let products = this.getProducts();
        products.productsList = products.productsList.map(p => p.id === id ? product : p);

        fs.writeFileSync(this.#path, JSON.stringify(products, null, '\t'));
    }

    deleteProduct = id => {
        let products = this.getProducts();

        products.productsList = products.productsList.filter(product => product.id !== id);

        fs.writeFileSync(this.#path, JSON.stringify(products, null, '\t'));
    }

}

export default ProductManager;