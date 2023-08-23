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

    // TODO: Cambiar para que se actualice de acuerdo a un objeto pasado por parámetro
    updateProduct = (id, prop, newValue) => {
        if (!newValue)
            return console.log('ERROR: provided data is not enough to update a product');

        if (prop === "id")
            return console.log('ERROR: cannot update id');

        let products = this.getProducts();

        if (!this.getProductById(id)) {
            return;
        }

        let product = products.find(product => product.id === id);
        if (prop === null) {
            for (const prop in newValue) {
                if (!product[prop])
                    return console.log(`ERROR: cannot update product with id ${id} because property ${prop} does not exist`);
                if (prop !== "id")
                    product[prop] = newValue[prop];
            }
        } else {
            if (!product[prop])
                return console.log(`ERROR: cannot update product with id ${id} because property ${prop} does not exist`);
            product[prop] = newValue;
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