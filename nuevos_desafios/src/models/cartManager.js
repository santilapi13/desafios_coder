import fs from 'fs';
import path from 'path';
import __dirname from '../util.js';

class CartManager {

    #path;

    constructor() {
        this.#path = path.join(__dirname, "data", "carts.json");
    }

    createCart = (products = []) => {
        let carts = this.getCarts();
        carts.lastId++;

        let newCart = {
            id: carts.lastId,
            products
        }

        carts.cartsList.push(newCart);
        fs.writeFileSync(this.#path, JSON.stringify(carts, null, '\t'));
    }

    getCarts = () => {
        let carts = {
            lastId: 0,
            carts: []
        };

        if (fs.existsSync(this.#path)) {
            carts = JSON.parse(fs.readFileSync(this.#path, 'utf-8'));
        }

        return carts;
    }

    getProductsByCartId = id => {
        let cart = this.getCarts().cartsList.find(cart => cart.id === id);

        if (cart)
            return cart.products;

        return cart;
    }

    addProductToCart = (id, productId) => {
        let carts = this.getCarts();

        let cart = carts.cartsList.find(cart => cart.id === id);

        let product = cart.products.find(product => product.id === productId);

        if (!product) {
            product = {
                id: productId,
                quantity: 1
            }
            cart.products.push(product);
        } else
            product.quantity++;

        fs.writeFileSync(this.#path, JSON.stringify(carts, null, '\t'));
    }

}


export default CartManager;