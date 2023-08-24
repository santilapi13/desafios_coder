import fs from 'fs';
import path from 'path';
import __dirname from '../util.js';

class ProductManager {

    #path;

    constructor() {
        this.#path = path.join(__dirname, "data", "products.json");
    }

    addProduct = ({title, description, code, price, status = true, stock, category, thumbnails = []}) => {
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

        // TODO: Revisar como se asigna el ID. Lo ideal sería guardarlo en algún lugar y no buscar el de mayor valor.
        let lastId = this.getProducts().reduce((max, product) => product.id > max ? product.id : max, 0);
        newProduct.id = lastId + 1;

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

        productArr.forEach(newProp => {
            product[newProp[0]] = newProp[1];
        });

        products = products.map(p => p.id === id ? product : p);

        fs.writeFileSync(this.#path, JSON.stringify(products, null, '\t'));
    }

    deleteProduct = id => {
        let products = this.getProducts();

        products = products.filter(product => product.id !== id);

        fs.writeFileSync(this.#path, JSON.stringify(products, null, '\t'));
    }

}

export default ProductManager;